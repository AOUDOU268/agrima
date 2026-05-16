package com.agrima.user.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entité ActionModeration.
 * Enregistre chaque action de modération effectuée par un administrateur
 * sur un utilisateur (validation, suspension, avertissement, blocage, etc.).
 */
@Entity
@Table(name = "actions_moderation")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActionModeration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String type; // VALIDATION, SUSPENSION, AVERTISSEMENT, CONTACT, BLOCAGE, REACTIVATION

    private String description;

    private String raison;

    @Column(name = "date_action", nullable = false)
    @Builder.Default
    private LocalDateTime dateAction = LocalDateTime.now();

    @Column(name = "moderateur_id")
    private Long moderateurId;

    @Column(nullable = false)
    @Builder.Default
    private String statut = "EN_ATTENTE"; // EFFECTUEE, EN_ATTENTE, REJETEE
}
