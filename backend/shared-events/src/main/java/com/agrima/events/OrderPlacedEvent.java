package com.agrima.events;

import java.time.LocalDateTime;

public class OrderPlacedEvent {
    private Long orderId;
    private Long userId;
    private Long producteurId;
    private LocalDateTime timestamp;

    public OrderPlacedEvent() {}

    public OrderPlacedEvent(Long orderId, Long userId, Long producteurId) {
        this.orderId = orderId;
        this.userId = userId;
        this.producteurId = producteurId;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getProducteurId() { return producteurId; }
    public void setProducteurId(Long producteurId) { this.producteurId = producteurId; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}