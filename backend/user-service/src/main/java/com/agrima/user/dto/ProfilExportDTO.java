package com.agrima.user.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfilExportDTO {
    private Long id;
    private String nom;
    private String email;
    private String telephone;
    private String role;
    private String statut;
    private LocalDateTime dateInscription;
    private List<ActionModerationDTO> historique;
    private List<CommandeDTO> commandes;
}
