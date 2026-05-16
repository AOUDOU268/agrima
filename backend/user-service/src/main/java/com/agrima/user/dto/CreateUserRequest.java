package com.agrima.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {
    
    @NotBlank(message = "Email est obligatoire")
    @Email(message = "Email doit être valide")
    private String email;
    
    @NotBlank(message = "Nom est obligatoire")
    private String nom;
    
    @NotBlank(message = "Prénom est obligatoire")
    private String prenom;
    
    private String telephone;
    
    @NotBlank(message = "Rôle est obligatoire")
    private String role;
    
    private String statut;
}
