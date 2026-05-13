package com.agrima.events;

import java.time.LocalDateTime;

public class PaymentConfirmedEvent {
    private Long orderId;
    private Long userId;
    private Double amount;
    private LocalDateTime timestamp;

    public PaymentConfirmedEvent() {}

    public PaymentConfirmedEvent(Long orderId, Long userId, Double amount) {
        this.orderId = orderId;
        this.userId = userId;
        this.amount = amount;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}