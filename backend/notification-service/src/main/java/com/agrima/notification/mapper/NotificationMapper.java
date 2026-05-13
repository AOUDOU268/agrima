package com.agrima.notification.mapper;

import com.agrima.notification.dto.NotificationRequestDto;
import com.agrima.notification.dto.NotificationResponseDto;
import com.agrima.notification.model.Notification;
import com.agrima.notification.model.NotificationType;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public Notification toEntity(NotificationRequestDto dto) {
        Notification notification = new Notification();
        notification.setUserId(dto.getUserId());
        if (dto.getType() != null && !dto.getType().isBlank()) {
            notification.setType(NotificationType.valueOf(dto.getType()));
        }
        notification.setTitre(dto.getTitre());
        notification.setMessage(dto.getMessage());
        notification.setRelatedEntityId(dto.getRelatedEntityId());
        notification.setRelatedEntityType(dto.getRelatedEntityType());
        return notification;
    }

    public NotificationResponseDto toResponseDto(Notification entity) {
        NotificationResponseDto dto = new NotificationResponseDto();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUserId());
        dto.setType(entity.getType() != null ? entity.getType().name() : null);
        dto.setTitre(entity.getTitre());
        dto.setMessage(entity.getMessage());
        dto.setRelatedEntityId(entity.getRelatedEntityId());
        dto.setRelatedEntityType(entity.getRelatedEntityType());
        dto.setLu(entity.isLu());
        dto.setCreatedAt(entity.getDate());
        return dto;
    }
}
