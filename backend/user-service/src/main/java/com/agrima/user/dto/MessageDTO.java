package com.agrima.user.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private Long id;
    private Long profilId;
    private String sujet;
    private String contenu;
    private LocalDateTime dateEnvoi;
    private Boolean lu;
}
