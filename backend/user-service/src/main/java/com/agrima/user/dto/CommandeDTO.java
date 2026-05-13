package com.agrima.user.dto;

import lombok.*;
import java.time.LocalDateTime;

/**
 * DTO pour les commandes (utilisé dans les exports)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommandeDTO {
    private Long id;
    private String numero;
    private String statut;
    private Double montant;
    private LocalDateTime date;
}