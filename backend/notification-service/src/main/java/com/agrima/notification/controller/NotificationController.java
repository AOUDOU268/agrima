package com.agrima.notification.controller;

import com.agrima.notification.dto.NotificationRequestDto;
import com.agrima.notification.dto.NotificationResponseDto;
import com.agrima.notification.mapper.NotificationMapper;
import com.agrima.notification.model.Notification;
import com.agrima.notification.model.NotificationType;
import com.agrima.notification.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationRepository repository;
    private final NotificationMapper mapper;

    public NotificationController(NotificationRepository repository, NotificationMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @GetMapping
    public List<NotificationResponseDto> list() {
        return repository.findAll().stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponseDto> get(@PathVariable Long id) {
        return repository.findById(id)
                .map(notification -> ResponseEntity.ok(mapper.toResponseDto(notification)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<NotificationResponseDto> listByUser(@PathVariable Long userId) {
        return repository.findByUserId(userId).stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @PostMapping
    public NotificationResponseDto create(@RequestBody NotificationRequestDto notificationDto) {
        Notification notification = mapper.toEntity(notificationDto);
        Notification saved = repository.save(notification);
        return mapper.toResponseDto(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NotificationResponseDto> update(@PathVariable Long id, @RequestBody NotificationRequestDto notificationDto) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setUserId(notificationDto.getUserId());
                    if (notificationDto.getType() != null && !notificationDto.getType().isBlank()) {
                        existing.setType(NotificationType.valueOf(notificationDto.getType()));
                    }
                    existing.setTitre(notificationDto.getTitre());
                    existing.setMessage(notificationDto.getMessage());
                    existing.setRelatedEntityType(notificationDto.getRelatedEntityType());
                    existing.setRelatedEntityId(notificationDto.getRelatedEntityId());
                    Notification saved = repository.save(existing);
                    return ResponseEntity.ok(mapper.toResponseDto(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
