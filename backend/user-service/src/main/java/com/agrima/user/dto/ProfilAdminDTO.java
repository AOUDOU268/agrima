package com.agrima.user.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfilAdminDTO {
    private Long id;
    private String nom;
    private String email;
    private String telephone;
    private String role;
    private String statut;
    private String localisation;
    private LocalDateTime dateInscription;
    private LocalDateTime derniereActivite;
    private Integer scoreConfiance;
    private Integer nbSignalements;
    private Double note;
    private List<String> tags;
    
    // Champs additionnels pour producteurs
    private String siret;
    private String nomExploitation;
    private List<String> certifications;
    
    // Champs additionnels pour livreurs
    private String vehicule;
    private String plaqueImmatriculation;
}
