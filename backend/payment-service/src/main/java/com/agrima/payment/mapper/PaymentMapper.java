package com.agrima.payment.mapper;

import com.agrima.payment.dto.PaymentRequestDto;
import com.agrima.payment.dto.PaymentResponseDto;
import com.agrima.payment.model.Payment;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PaymentMapper {

    public Payment toEntity(PaymentRequestDto dto) {
        Payment entity = new Payment();
        entity.setOrderId(dto.getOrderId());
        entity.setUserId(dto.getUserId());
        entity.setAmount(dto.getAmount());
        return entity;
    }

    public PaymentResponseDto toResponseDto(Payment entity) {
        PaymentResponseDto dto = new PaymentResponseDto();
        dto.setId(entity.getId());
        dto.setOrderId(entity.getOrderId());
        dto.setUserId(entity.getUserId());
        dto.setAmount(entity.getAmount());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    public List<PaymentResponseDto> toResponseDtoList(List<Payment> entities) {
        return entities.stream()
            .map(this::toResponseDto)
            .collect(Collectors.toList());
    }
}