package com.agrima.user.service;

import com.agrima.user.dto.*;
import com.agrima.user.model.Utilisateur;
import com.agrima.user.model.ActionModeration;
import com.agrima.user.repository.UtilisateurRepository;
import com.agrima.user.repository.ActionModerationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AdminService {

    private final UtilisateurRepository utilisateurRepository;
    private final ActionModerationRepository actionModerationRepository;
    private final NotificationService notificationService;
    private final AdminMapper adminMapper;

    // ========== GESTION DES PROFILS ==========

    public Page<ProfilAdminDTO> obtenirProfilsFiltres(String role, String statut, Pageable pageable) {
        log.info("Récupération des profils - role: {}, statut: {}", role, statut);
        
        Page<Utilisateur> profils;
        if (role != null && statut != null) {
            profils = utilisateurRepository.findByRoleAndStatut(role, statut, pageable);
        } else if (role != null) {
            profils = utilisateurRepository.findByRole(role, pageable);
        } else if (statut != null) {
            profils = utilisateurRepository.findByStatut(statut, pageable);
        } else {
            profils = utilisateurRepository.findAll(pageable);
        }
        
        return profils.map(adminMapper::toProfilAdminDTO);
    }

    public ProfilAdminDTO obtenirProfil(Long id) {
        log.info("Récupération du profil: {}", id);
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));
        return adminMapper.toProfilAdminDTO(utilisateur);
    }

    public List<ProfilAdminDTO> obtenirProfilsUrgents() {
        log.info("Récupération des profils urgents");
        List<Utilisateur> profils = utilisateurRepository.findByNbSignalementsGreaterThanOrStatut(3, "Signalé");
        return profils.stream()
            .map(adminMapper::toProfilAdminDTO)
            .collect(Collectors.toList());
    }

    public ProfilAdminDTO mettreAJourProfil(Long id, UpdateProfilRequest request) {
        log.info("Mise à jour du profil: {}", id);
        
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        if (request.getTelephone() != null) {
            utilisateur.setTelephone(request.getTelephone());
        }
        if (request.getLocalisation() != null) {
            utilisateur.setLocalisation(request.getLocalisation());
        }
        if (request.getStatut() != null) {
            utilisateur.setStatut(request.getStatut());
        }
        if (request.getScoreConfiance() != null) {
            utilisateur.setScoreConfiance(request.getScoreConfiance());
        }

        Utilisateur updated = utilisateurRepository.save(utilisateur);
        
        log.info("Profil mis à jour avec succès: {}", id);
        return adminMapper.toProfilAdminDTO(updated);
    }

    public void supprimerProfil(Long id) {
        log.info("Suppression du profil: {}", id);
        utilisateurRepository.deleteById(id);
    }

    // ========== ACTIONS DE MODERATION ==========

    public ProfilAdminDTO validerProfil(Long id, String raison) {
        log.info("Validation du profil: {}", id);
        
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        utilisateur.setStatut("Validé");
        Utilisateur updated = utilisateurRepository.save(utilisateur);

        ActionModeration action = ActionModeration.builder()
            .utilisateur(utilisateur)
            .type("VALIDATION")
            .description("Profil validé par l'administrateur")
            .raison(raison)
            .dateAction(LocalDateTime.now())
            .statut("EFFECTUEE")
            .build();
        actionModerationRepository.save(action);

        notificationService.notifierValidation(utilisateur);

        return adminMapper.toProfilAdminDTO(updated);
    }

    public ProfilAdminDTO suspendreTemporairement(Long id, Integer duree, String raison) {
        log.info("Suspension temporaire du profil: {} pour {} jours", id, duree);
        
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        utilisateur.setStatut("Suspendu");
        utilisateur.setDateSuspension(LocalDateTime.now());
        utilisateur.setDureeSuspension(duree);
        Utilisateur updated = utilisateurRepository.save(utilisateur);

        ActionModeration action = ActionModeration.builder()
            .utilisateur(utilisateur)
            .type("SUSPENSION")
            .description("Profil suspendu temporairement pour " + duree + " jours")
            .raison(raison)
            .dateAction(LocalDateTime.now())
            .statut("EFFECTUEE")
            .build();
        actionModerationRepository.save(action);

        notificationService.notifierSuspension(utilisateur, duree, raison);

        return adminMapper.toProfilAdminDTO(updated);
    }

    public ProfilAdminDTO reactiverProfil(Long id) {
        log.info("Récupération du profil: {}", id);
        
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        utilisateur.setStatut("Actif");
        utilisateur.setDateSuspension(null);
        utilisateur.setDureeSuspension(null);
        Utilisateur updated = utilisateurRepository.save(utilisateur);

        ActionModeration action = ActionModeration.builder()
            .utilisateur(utilisateur)
            .type("REACTIVATION")
            .description("Profil réactivé")
            .dateAction(LocalDateTime.now())
            .statut("EFFECTUEE")
            .build();
        actionModerationRepository.save(action);

        notificationService.notifierReactivation(utilisateur);

        return adminMapper.toProfilAdminDTO(updated);
    }

    public ActionModerationDTO ajouterAvertissement(Long id, String raison, String details) {
        log.info("Ajout d'un avertissement au profil: {}", id);
        
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        ActionModeration action = ActionModeration.builder()
            .utilisateur(utilisateur)
            .type("AVERTISSEMENT")
            .description("Avertissement: " + details)
            .raison(raison)
            .dateAction(LocalDateTime.now())
            .statut("EFFECTUEE")
            .build();
        ActionModeration saved = actionModerationRepository.save(action);

        notificationService.notifierAvertissement(utilisateur, raison);

        return adminMapper.toActionModerationDTO(saved);
    }

    public ProfilAdminDTO bloquerProfil(Long id, String raison) {
        log.info("Blocage du profil: {}", id);
        
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        utilisateur.setStatut("Bloqué");
        utilisateur.setDateBlocage(LocalDateTime.now());
        Utilisateur updated = utilisateurRepository.save(utilisateur);

        ActionModeration action = ActionModeration.builder()
            .utilisateur(utilisateur)
            .type("BLOCAGE")
            .description("Profil bloqué définitivement")
            .raison(raison)
            .dateAction(LocalDateTime.now())
            .statut("EFFECTUEE")
            .build();
        actionModerationRepository.save(action);

        notificationService.notifierBlocage(utilisateur, raison);

        return adminMapper.toProfilAdminDTO(updated);
    }

    public MessageDTO envoyerMessage(Long id, String sujet, String contenu) {
        log.info("Envoi d'un message au profil: {}", id);
        
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        ActionModeration action = ActionModeration.builder()
            .utilisateur(utilisateur)
            .type("CONTACT")
            .description("Message: " + sujet)
            .raison(contenu)
            .dateAction(LocalDateTime.now())
            .statut("EFFECTUEE")
            .build();
        actionModerationRepository.save(action);

        notificationService.envoyerMessage(utilisateur, sujet, contenu);

        return MessageDTO.builder()
            .profilId(id)
            .sujet(sujet)
            .contenu(contenu)
            .dateEnvoi(LocalDateTime.now())
            .lu(false)
            .build();
    }

    public List<ActionModerationDTO> obtenirHistoriqueActions(Long id) {
        log.info("Récupération de l'historique des actions du profil: {}", id);
        
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        List<ActionModeration> actions = actionModerationRepository.findByUtilisateur(utilisateur);
        return actions.stream()
            .map(adminMapper::toActionModerationDTO)
            .collect(Collectors.toList());
    }

    // ========== GESTION DES ROLES ==========

    public ProfilAdminDTO assignerRole(Long id, String role) {
        log.info("Assignation du rôle {} au profil: {}", role, id);
        
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        utilisateur.setRole(role);
        Utilisateur updated = utilisateurRepository.save(utilisateur);

        log.info("Rôle assigné avec succès");
        return adminMapper.toProfilAdminDTO(updated);
    }

    public ProfilAdminDTO retirerRole(Long id, String role) {
        log.info("Retrait du rôle {} au profil: {}", role, id);
        
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        Utilisateur updated = utilisateurRepository.save(utilisateur);
        
        log.info("Rôle retiré avec succès");
        return adminMapper.toProfilAdminDTO(updated);
    }

    // ========== ACTIONS EN ATTENTE ==========

    public List<ActionModerationDTO> obtenirActionsEnAttente() {
        log.info("Récupération des actions en attente");
        
        List<ActionModeration> actions = actionModerationRepository.findByStatut("EN_ATTENTE");
        return actions.stream()
            .map(adminMapper::toActionModerationDTO)
            .collect(Collectors.toList());
    }

    public ActionModerationDTO approuverAction(Long id) {
        log.info("Approbation de l'action: {}", id);
        
        ActionModeration action = actionModerationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Action non trouvée: " + id));

        action.setStatut("EFFECTUEE");
        ActionModeration updated = actionModerationRepository.save(action);

        return adminMapper.toActionModerationDTO(updated);
    }

    public ActionModerationDTO rejeterAction(Long id, String raison) {
        log.info("Rejet de l'action: {}", id);
        
        ActionModeration action = actionModerationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Action non trouvée: " + id));

        action.setStatut("REJETEE");
        action.setRaison(raison);
        ActionModeration updated = actionModerationRepository.save(action);

        return adminMapper.toActionModerationDTO(updated);
    }

    // ========== ANALYTICS ET RAPPORTS ==========

    public StatistiquesGlobalesDTO obtenirStatistiques() {
        log.info("Calcul des statistiques globales");
        
        Long total = utilisateurRepository.count();
        Long actifs = utilisateurRepository.countByStatut("Actif");
        Long suspendus = utilisateurRepository.countByStatut("Suspendu");
        Long enAttente = utilisateurRepository.countByStatut("En attente");
        Double scoreMoyen = utilisateurRepository.getScoreConfiantMoyen();
        Long signalements = utilisateurRepository.countSignalements();

        return StatistiquesGlobalesDTO.builder()
            .totalProfils(total.intValue())
            .actifs(actifs.intValue())
            .suspendus(suspendus.intValue())
            .enAttente(enAttente.intValue())
            .scoreConfiantMoyen(scoreMoyen != null ? scoreMoyen : 0.0)
            .signalementsTotaux(signalements.intValue())
            .build();
    }

    public RapportModerationDTO genererRapportModeration(LocalDate dateDebut, LocalDate dateFin) {
        log.info("Génération du rapport de modération de {} à {}", dateDebut, dateFin);
        
        Long totalActions = actionModerationRepository.countByDateActionBetween(
            dateDebut.atStartOfDay(),
            dateFin.atTime(23, 59, 59)
        );

        return RapportModerationDTO.builder()
            .dateDebut(dateDebut.toString())
            .dateFin(dateFin.toString())
            .actionsEffectuees(totalActions.intValue())
            .build();
    }

    public ProfilExportDTO exporterProfil(Long id) {
        log.info("Export du profil: {}", id);
        
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        List<ActionModeration> actions = actionModerationRepository.findByUtilisateur(utilisateur);

        return ProfilExportDTO.builder()
            .id(utilisateur.getId())
            .nom(utilisateur.getNom())
            .email(utilisateur.getEmail())
            .telephone(utilisateur.getTelephone())
            .role(utilisateur.getRole())
            .statut(utilisateur.getStatut())
            .dateInscription(utilisateur.getDateInscription())
            .historique(actions.stream()
                .map(adminMapper::toActionModerationDTO)
                .collect(Collectors.toList()))
            .build();
    }

}
