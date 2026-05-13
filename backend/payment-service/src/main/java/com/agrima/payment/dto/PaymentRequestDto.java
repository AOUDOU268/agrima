package com.agrima.payment.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentRequestDto {
    private Long orderId;
    private Long userId;
    private BigDecimal amount;

    // Constructors
    public PaymentRequestDto() {}

    // Getters and setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}