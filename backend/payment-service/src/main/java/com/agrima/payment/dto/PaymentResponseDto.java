package com.agrima.payment.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponseDto {
    private Long id;
    private Long orderId;
    private Long userId;
    private BigDecimal amount;
    private String status;
    private LocalDateTime createdAt;

    // Constructors
    public PaymentResponseDto() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}