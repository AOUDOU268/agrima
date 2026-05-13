package com.agrima.events;

import java.time.LocalDateTime;

public class DeliveryStartedEvent {
    private Long deliveryId;
    private Long orderId;
    private Long livreurId;
    private LocalDateTime timestamp;

    public DeliveryStartedEvent() {}

    public DeliveryStartedEvent(Long deliveryId, Long orderId, Long livreurId) {
        this.deliveryId = deliveryId;
        this.orderId = orderId;
        this.livreurId = livreurId;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and setters
    public Long getDeliveryId() { return deliveryId; }
    public void setDeliveryId(Long deliveryId) { this.deliveryId = deliveryId; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getLivreurId() { return livreurId; }
    public void setLivreurId(Long livreurId) { this.livreurId = livreurId; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}