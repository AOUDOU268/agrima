package com.agrima.user.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RapportModerationDTO {
    private String dateDebut;
    private String dateFin;
    private Integer totalProfils;
    private Integer actifs;
    private Integer suspendus;
    private Integer enAttente;
    private Double scoreConfiantMoyen;
    private Integer signalementsTotaux;
    private Integer actionsEffectuees;
}
