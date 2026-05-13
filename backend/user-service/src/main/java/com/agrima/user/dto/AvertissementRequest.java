package com.agrima.user.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvertissementRequest {
    private String raison;
    private String details;
}
