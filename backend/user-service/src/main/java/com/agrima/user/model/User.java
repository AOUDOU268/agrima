package com.agrima.user.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entité User unifiée.
 * Combine les données du profil utilisateur (infos personnelles, adresses, préférences)
 * et les données d'administration (rôle, statut, modération).
 */
@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Lien avec auth-service
    @Column(name = "auth_user_id")
    private Long authUserId;

    // Informations personnelles
    @Column(nullable = false, unique = true)
    private String email;

    private String nom;

    private String prenom;

    private String telephone;

    // Rôle et statut
    @Column(nullable = false)
    @Builder.Default
    private String role = "ROLE_CONSOMMATEUR";

    @Column(nullable = false)
    @Builder.Default
    private String statut = "En attente"; // Actif, Suspendu, Bloqué, En attente, Validé, Signalé

    private String localisation;

    // Dates
    @Column(name = "date_inscription")
    @Builder.Default
    private LocalDateTime dateInscription = LocalDateTime.now();

    @Column(name = "derniere_activite")
    private LocalDateTime derniereActivite;

    @Builder.Default
    private boolean actif = true;

    // Scores et signalements
    @Column(name = "score_confiance")
    @Builder.Default
    private Integer scoreConfiance = 50;

    @Column(name = "nb_signalements")
    @Builder.Default
    private Integer nbSignalements = 0;

    private Double note;

    // Champs producteur
    private String siret;

    @Column(name = "nom_exploitation")
    private String nomExploitation;

    @ElementCollection
    @CollectionTable(name = "user_certifications", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "certification")
    @Builder.Default
    private List<String> certifications = new ArrayList<>();

    // Champs livreur
    private String vehicule;

    @Column(name = "plaque_immatriculation")
    private String plaqueImmatriculation;

    // Champs suspension / blocage
    @Column(name = "date_suspension")
    private LocalDateTime dateSuspension;

    @Column(name = "duree_suspension")
    private Integer dureeSuspension;

    @Column(name = "date_blocage")
    private LocalDateTime dateBlocage;

    // Tags
    @ElementCollection
    @CollectionTable(name = "user_tags", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "tag")
    @Builder.Default
    private List<String> tags = new ArrayList<>();

    // Adresses
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "user_id")
    @Builder.Default
    private List<Adresse> adresses = new ArrayList<>();

    // Préférences
    @Embedded
    @Builder.Default
    private PreferencesUtilisateur preferences = new PreferencesUtilisateur();
}
