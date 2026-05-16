package com.agrima.user.service;

import com.agrima.user.dto.*;
import com.agrima.user.model.User;
import com.agrima.user.model.ActionModeration;
import com.agrima.user.repository.UserRepository;
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

    private final UserRepository userRepository;
    private final ActionModerationRepository actionModerationRepository;
    private final NotificationService notificationService;
    private final AdminMapper adminMapper = AdminMapper.INSTANCE;

    // ========== GESTION DES PROFILS ==========

    public Page<ProfilAdminDTO> obtenirProfilsFiltres(String role, String statut, Pageable pageable) {
        log.info("Récupération des profils - role: {}, statut: {}", role, statut);
        
        Page<User> profils;
        if (role != null && statut != null) {
            profils = userRepository.findByRoleAndStatut(role, statut, pageable);
        } else if (role != null) {
            profils = userRepository.findByRole(role, pageable);
        } else if (statut != null) {
            profils = userRepository.findByStatut(statut, pageable);
        } else {
            profils = userRepository.findAll(pageable);
        }
        
        return profils.map(adminMapper::toProfilAdminDTO);
    }

    public ProfilAdminDTO obtenirProfil(Long id) {
        log.info("Récupération du profil: {}", id);
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));
        return adminMapper.toProfilAdminDTO(user);
    }

    public List<ProfilAdminDTO> obtenirProfilsUrgents() {
        log.info("Récupération des profils urgents");
        List<User> profils = userRepository.findByNbSignalementsGreaterThanOrStatut(3, "Signalé");
        return profils.stream()
            .map(adminMapper::toProfilAdminDTO)
            .collect(Collectors.toList());
    }

    public ProfilAdminDTO mettreAJourProfil(Long id, UpdateProfilRequest request) {
        log.info("Mise à jour du profil: {}", id);
        
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        if (request.getTelephone() != null) {
            user.setTelephone(request.getTelephone());
        }
        if (request.getLocalisation() != null) {
            user.setLocalisation(request.getLocalisation());
        }
        if (request.getStatut() != null) {
            user.setStatut(request.getStatut());
        }
        if (request.getScoreConfiance() != null) {
            user.setScoreConfiance(request.getScoreConfiance());
        }

        User updated = userRepository.save(user);
        
        log.info("Profil mis à jour avec succès: {}", id);
        return adminMapper.toProfilAdminDTO(updated);
    }

    public void supprimerProfil(Long id) {
        log.info("Suppression du profil: {}", id);
        userRepository.deleteById(id);
    }

    // ========== ACTIONS DE MODERATION ==========

    public ProfilAdminDTO validerProfil(Long id, String raison) {
        log.info("Validation du profil: {}", id);
        
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        user.setStatut("Validé");
        User updated = userRepository.save(user);

        ActionModeration action = ActionModeration.builder()
            .user(user)
            .type("VALIDATION")
            .description("Profil validé par l'administrateur")
            .raison(raison)
            .dateAction(LocalDateTime.now())
            .statut("EFFECTUEE")
            .build();
        actionModerationRepository.save(action);

        notificationService.notifierValidation(user);

        return adminMapper.toProfilAdminDTO(updated);
    }

    public ProfilAdminDTO suspendreTemporairement(Long id, Integer duree, String raison) {
        log.info("Suspension temporaire du profil: {} pour {} jours", id, duree);
        
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        user.setStatut("Suspendu");
        user.setDateSuspension(LocalDateTime.now());
        user.setDureeSuspension(duree);
        User updated = userRepository.save(user);

        ActionModeration action = ActionModeration.builder()
            .user(user)
            .type("SUSPENSION")
            .description("Profil suspendu temporairement pour " + duree + " jours")
            .raison(raison)
            .dateAction(LocalDateTime.now())
            .statut("EFFECTUEE")
            .build();
        actionModerationRepository.save(action);

        notificationService.notifierSuspension(user, duree, raison);

        return adminMapper.toProfilAdminDTO(updated);
    }

    public ProfilAdminDTO reactiverProfil(Long id) {
        log.info("Réactivation du profil: {}", id);
        
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        user.setStatut("Actif");
        user.setDateSuspension(null);
        user.setDureeSuspension(null);
        User updated = userRepository.save(user);

        ActionModeration action = ActionModeration.builder()
            .user(user)
            .type("REACTIVATION")
            .description("Profil réactivé")
            .dateAction(LocalDateTime.now())
            .statut("EFFECTUEE")
            .build();
        actionModerationRepository.save(action);

        notificationService.notifierReactivation(user);

        return adminMapper.toProfilAdminDTO(updated);
    }

    public ActionModerationDTO ajouterAvertissement(Long id, String raison, String details) {
        log.info("Ajout d'un avertissement au profil: {}", id);
        
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        ActionModeration action = ActionModeration.builder()
            .user(user)
            .type("AVERTISSEMENT")
            .description("Avertissement: " + details)
            .raison(raison)
            .dateAction(LocalDateTime.now())
            .statut("EFFECTUEE")
            .build();
        ActionModeration saved = actionModerationRepository.save(action);

        notificationService.notifierAvertissement(user, raison);

        return adminMapper.toActionModerationDTO(saved);
    }

    public ProfilAdminDTO bloquerProfil(Long id, String raison) {
        log.info("Blocage du profil: {}", id);
        
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        user.setStatut("Bloqué");
        user.setDateBlocage(LocalDateTime.now());
        User updated = userRepository.save(user);

        ActionModeration action = ActionModeration.builder()
            .user(user)
            .type("BLOCAGE")
            .description("Profil bloqué définitivement")
            .raison(raison)
            .dateAction(LocalDateTime.now())
            .statut("EFFECTUEE")
            .build();
        actionModerationRepository.save(action);

        notificationService.notifierBlocage(user, raison);

        return adminMapper.toProfilAdminDTO(updated);
    }

    public MessageDTO envoyerMessage(Long id, String sujet, String contenu) {
        log.info("Envoi d'un message au profil: {}", id);
        
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        ActionModeration action = ActionModeration.builder()
            .user(user)
            .type("CONTACT")
            .description("Message: " + sujet)
            .raison(contenu)
            .dateAction(LocalDateTime.now())
            .statut("EFFECTUEE")
            .build();
        actionModerationRepository.save(action);

        notificationService.envoyerMessage(user, sujet, contenu);

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
        
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        List<ActionModeration> actions = actionModerationRepository.findByUser(user);
        return actions.stream()
            .map(adminMapper::toActionModerationDTO)
            .collect(Collectors.toList());
    }

    // ========== GESTION DES ROLES ==========

    public ProfilAdminDTO assignerRole(Long id, String role) {
        log.info("Assignation du rôle {} au profil: {}", role, id);
        
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        user.setRole(role);
        User updated = userRepository.save(user);

        log.info("Rôle assigné avec succès");
        return adminMapper.toProfilAdminDTO(updated);
    }

    public ProfilAdminDTO retirerRole(Long id, String role) {
        log.info("Retrait du rôle {} au profil: {}", role, id);
        
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        User updated = userRepository.save(user);
        
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
        
        Long total = userRepository.count();
        Long actifs = userRepository.countByStatut("Actif");
        Long suspendus = userRepository.countByStatut("Suspendu");
        Long enAttente = userRepository.countByStatut("En attente");
        Double scoreMoyen = userRepository.getScoreConfiantMoyen();
        Long signalements = userRepository.countSignalements();

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
        
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profil non trouvé: " + id));

        List<ActionModeration> actions = actionModerationRepository.findByUser(user);

        return ProfilExportDTO.builder()
            .id(user.getId())
            .nom(user.getNom())
            .email(user.getEmail())
            .telephone(user.getTelephone())
            .role(user.getRole())
            .statut(user.getStatut())
            .dateInscription(user.getDateInscription())
            .historique(actions.stream()
                .map(adminMapper::toActionModerationDTO)
                .collect(Collectors.toList()))
            .build();
    }

}
