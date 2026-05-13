package com.agrima.user.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActionModerationDTO {
    private Long id;
    private Long profilId;
    private String type; // SUSPENSION, AVERTISSEMENT, VALIDATION, CONTACT, BLOCAGE
    private String description;
    private String raison;
    private LocalDateTime dateAction;
    private Long moderateurId;
    private String statut; // EFFECTUEE, EN_ATTENTE, REJETEE
}
