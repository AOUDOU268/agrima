package com.agrima.user.controller;

import com.agrima.user.dto.*;
import com.agrima.user.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Contrôleur pour l'administration des profils utilisateurs
 * Accessible uniquement aux administrateurs
 */
@RestController
@RequestMapping("/api/users/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    // ========== GESTION DES PROFILS ==========

    @GetMapping("/profils")
    public ResponseEntity<Page<ProfilAdminDTO>> obtenirTousProfils(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String statut,
            Pageable pageable) {
        return ResponseEntity.ok(adminService.obtenirProfilsFiltres(role, statut, pageable));
    }

    @GetMapping("/profils/{id}")
    public ResponseEntity<ProfilAdminDTO> obtenirProfil(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.obtenirProfil(id));
    }

    @GetMapping("/profils/urgents")
    public ResponseEntity<List<ProfilAdminDTO>> obtenirProfilsUrgents() {
        return ResponseEntity.ok(adminService.obtenirProfilsUrgents());
    }

    @PutMapping("/profils/{id}")
    public ResponseEntity<ProfilAdminDTO> mettreAJourProfil(
            @PathVariable Long id,
            @RequestBody UpdateProfilRequest request) {
        return ResponseEntity.ok(adminService.mettreAJourProfil(id, request));
    }

    @DeleteMapping("/profils/{id}")
    public ResponseEntity<Void> supprimerProfil(@PathVariable Long id) {
        adminService.supprimerProfil(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/profils/{id}/valider")
    public ResponseEntity<ProfilAdminDTO> validerProfil(
            @PathVariable Long id,
            @RequestBody ValidationRequest request) {
        return ResponseEntity.ok(adminService.validerProfil(id, request.getRaison()));
    }

    @PostMapping("/profils/{id}/suspendre-temp")
    public ResponseEntity<ProfilAdminDTO> suspendreTemporairement(
            @PathVariable Long id,
            @RequestBody SuspensionRequest request) {
        return ResponseEntity.ok(
            adminService.suspendreTemporairement(id, request.getDuree(), request.getRaison())
        );
    }

    @PostMapping("/profils/{id}/reactiver")
    public ResponseEntity<ProfilAdminDTO> reactiverProfil(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.reactiverProfil(id));
    }

    @PostMapping("/profils/{id}/avertir")
    public ResponseEntity<ActionModerationDTO> ajouterAvertissement(
            @PathVariable Long id,
            @RequestBody AvertissementRequest request) {
        return ResponseEntity.ok(
            adminService.ajouterAvertissement(id, request.getRaison(), request.getDetails())
        );
    }

    @PostMapping("/profils/{id}/bloquer")
    public ResponseEntity<ProfilAdminDTO> bloquerProfil(
            @PathVariable Long id,
            @RequestBody BlocageRequest request) {
        return ResponseEntity.ok(adminService.bloquerProfil(id, request.getRaison()));
    }

    @PostMapping("/profils/{id}/message")
    public ResponseEntity<MessageDTO> envoyerMessage(
            @PathVariable Long id,
            @RequestBody MessageRequest request) {
        return ResponseEntity.ok(
            adminService.envoyerMessage(id, request.getSujet(), request.getContenu())
        );
    }

    @GetMapping("/profils/{id}/historique-actions")
    public ResponseEntity<List<ActionModerationDTO>> obtenirHistoriqueActions(
            @PathVariable Long id) {
        return ResponseEntity.ok(adminService.obtenirHistoriqueActions(id));
    }

    @PostMapping("/utilisateurs/{id}/role")
    public ResponseEntity<ProfilAdminDTO> assignerRole(
            @PathVariable Long id,
            @RequestBody RoleRequest request) {
        return ResponseEntity.ok(adminService.assignerRole(id, request.getRole()));
    }

    @DeleteMapping("/utilisateurs/{id}/role/{role}")
    public ResponseEntity<ProfilAdminDTO> retirerRole(
            @PathVariable Long id,
            @PathVariable String role) {
        return ResponseEntity.ok(adminService.retirerRole(id, role));
    }

    @GetMapping("/actions/en-attente")
    public ResponseEntity<List<ActionModerationDTO>> obtenirActionsEnAttente() {
        return ResponseEntity.ok(adminService.obtenirActionsEnAttente());
    }

    @PostMapping("/actions/{id}/approuver")
    public ResponseEntity<ActionModerationDTO> approuverAction(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approuverAction(id));
    }

    @PostMapping("/actions/{id}/rejeter")
    public ResponseEntity<ActionModerationDTO> rejeterAction(
            @PathVariable Long id,
            @RequestBody RejectionRequest request) {
        return ResponseEntity.ok(adminService.rejeterAction(id, request.getRaison()));
    }

    @GetMapping("/statistiques")
    public ResponseEntity<StatistiquesGlobalesDTO> obtenirStatistiques() {
        return ResponseEntity.ok(adminService.obtenirStatistiques());
    }

    @GetMapping("/rapports/moderation")
    public ResponseEntity<RapportModerationDTO> genererRapportModeration(
            @RequestParam LocalDate dateDebut,
            @RequestParam LocalDate dateFin) {
        return ResponseEntity.ok(adminService.genererRapportModeration(dateDebut, dateFin));
    }

    @GetMapping("/profils/{id}/export")
    public ResponseEntity<ProfilExportDTO> exporterProfil(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.exporterProfil(id));
    }
}
