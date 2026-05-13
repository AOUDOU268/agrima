package com.agrima.user.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {
    private String sujet;
    private String contenu;
}
