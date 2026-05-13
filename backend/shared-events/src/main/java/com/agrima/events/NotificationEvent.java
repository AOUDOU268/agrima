package com.agrima.events;

import java.time.LocalDateTime;

public class NotificationEvent {
    private Long userId;
    private String type;
    private String title;
    private String message;
    private Long relatedEntityId;
    private String relatedEntityType;
    private LocalDateTime timestamp;

    public NotificationEvent() {}

    public NotificationEvent(Long userId, String type, String title, String message, Long relatedEntityId, String relatedEntityType) {
        this.userId = userId;
        this.type = type;
        this.title = title;
        this.message = message;
        this.relatedEntityId = relatedEntityId;
        this.relatedEntityType = relatedEntityType;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getRelatedEntityId() { return relatedEntityId; }
    public void setRelatedEntityId(Long relatedEntityId) { this.relatedEntityId = relatedEntityId; }

    public String getRelatedEntityType() { return relatedEntityType; }
    public void setRelatedEntityType(String relatedEntityType) { this.relatedEntityType = relatedEntityType; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}