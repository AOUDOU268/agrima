package com.agrima.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUtilisateurRequest {
    
    private String email;
    
    private String nom;
    
    private String prenom;
    
    private String telephone;
    
    private String role;
    
    private String statut;
}
