package com.agrima.user.controller;

import com.agrima.user.dto.CreateUtilisateurRequest;
import com.agrima.user.dto.UpdateUtilisateurRequest;
import com.agrima.user.dto.UtilisateurDTO;
import com.agrima.user.model.Utilisateur;
import com.agrima.user.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
public class UtilisateurController {

    private final UtilisateurRepository utilisateurRepository;

    // CREATE
    @PostMapping
    public ResponseEntity<UtilisateurDTO> creer(@Valid @RequestBody CreateUtilisateurRequest request) {
        Utilisateur utilisateur = Utilisateur.builder()
                .email(request.getEmail())
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .telephone(request.getTelephone())
                .role(request.getRole())
                .statut(request.getStatut() != null ? request.getStatut() : "En attente")
                .build();
        Utilisateur saved = utilisateurRepository.save(utilisateur);
        return ResponseEntity.ok(mapToDTO(saved));
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<UtilisateurDTO>> obtenirTous() {
        List<UtilisateurDTO> utilisateurs = utilisateurRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(utilisateurs);
    }

    // READ ONE
    @GetMapping("/{id}")
    public ResponseEntity<UtilisateurDTO> obtenirParId(@PathVariable("id") Long id) {
        return utilisateurRepository.findById(id)
                .map(u -> ResponseEntity.ok(mapToDTO(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<UtilisateurDTO> mettreAJour(@PathVariable("id") Long id, @Valid @RequestBody UpdateUtilisateurRequest request) {
        return utilisateurRepository.findById(id)
                .map(existing -> {
                    if (request.getEmail() != null) existing.setEmail(request.getEmail());
                    if (request.getNom() != null) existing.setNom(request.getNom());
                    if (request.getPrenom() != null) existing.setPrenom(request.getPrenom());
                    if (request.getTelephone() != null) existing.setTelephone(request.getTelephone());
                    if (request.getRole() != null) existing.setRole(request.getRole());
                    if (request.getStatut() != null) existing.setStatut(request.getStatut());
                    Utilisateur updated = utilisateurRepository.save(existing);
                    return ResponseEntity.ok(mapToDTO(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable("id") Long id) {
        if (utilisateurRepository.existsById(id)) {
            utilisateurRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Helper method to convert entity to DTO
    private UtilisateurDTO mapToDTO(Utilisateur utilisateur) {
        return UtilisateurDTO.builder()
                .id(utilisateur.getId())
                .email(utilisateur.getEmail())
                .nom(utilisateur.getNom())
                .prenom(utilisateur.getPrenom())
                .telephone(utilisateur.getTelephone())
                .role(utilisateur.getRole())
                .statut(utilisateur.getStatut())
                .build();
    }
}
