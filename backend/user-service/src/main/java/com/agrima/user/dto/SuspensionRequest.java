package com.agrima.user.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuspensionRequest {
    private Integer duree; // en jours
    private String raison;
}
