package com.agrima.user.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfilRequest {
    private String telephone;
    private String localisation;
    private Integer scoreConfiance;
    private String statut;
    private String siret;
    private String nomExploitation;
    private String vehicule;
    private String plaqueImmatriculation;
}
