package com.agrima.user.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entité Utilisateur pour l'administration.
 * Représente un utilisateur de la plateforme Agrima avec tous les champs
 * nécessaires pour la modération et la gestion des profils.
 */
@Entity
@Table(name = "utilisateurs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    private String nom;

    private String prenom;

    private String telephone;

    @Column(nullable = false)
    private String role; // ROLE_CONSOMMATEUR, ROLE_PRODUCTEUR, ROLE_ADMIN, ROLE_LIVREUR

    @Column(nullable = false)
    @Builder.Default
    private String statut = "En attente"; // Actif, Suspendu, Bloqué, En attente, Validé, Signalé

    private String localisation;

    @Column(name = "date_inscription")
    @Builder.Default
    private LocalDateTime dateInscription = LocalDateTime.now();

    @Column(name = "derniere_activite")
    private LocalDateTime derniereActivite;

    @Column(name = "score_confiance")
    @Builder.Default
    private Integer scoreConfiance = 50;

    @Column(name = "nb_signalements")
    @Builder.Default
    private Integer nbSignalements = 0;

    private Double note;

    private String portefeuille;

    // Champs producteur
    private String siret;

    @Column(name = "nom_exploitation")
    private String nomExploitation;

    @ElementCollection
    @CollectionTable(name = "utilisateur_certifications", joinColumns = @JoinColumn(name = "utilisateur_id"))
    @Column(name = "certification")
    @Builder.Default
    private List<String> certifications = new ArrayList<>();

    // Champs livreur
    private String vehicule;

    @Column(name = "plaque_immatriculation")
    private String plaqueImmatriculation;

    // Champs suspension
    @Column(name = "date_suspension")
    private LocalDateTime dateSuspension;

    @Column(name = "duree_suspension")
    private Integer dureeSuspension;

    @Column(name = "date_blocage")
    private LocalDateTime dateBlocage;

    @ElementCollection
    @CollectionTable(name = "utilisateur_tags", joinColumns = @JoinColumn(name = "utilisateur_id"))
    @Column(name = "tag")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @Builder.Default
    private boolean actif = true;

    @Embedded
    @Builder.Default
    private PreferencesUtilisateur preferences = new PreferencesUtilisateur();
}
