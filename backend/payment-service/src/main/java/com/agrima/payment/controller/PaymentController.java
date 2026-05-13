package com.agrima.payment.controller;

import com.agrima.events.PaymentConfirmedEvent;
import com.agrima.payment.dto.PaymentRequestDto;
import com.agrima.payment.dto.PaymentResponseDto;
import com.agrima.payment.mapper.PaymentMapper;
import com.agrima.payment.model.Payment;
import com.agrima.payment.repository.PaymentRepository;
import com.agrima.payment.stream.PaymentProcessor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentRepository repository;
    private final PaymentProcessor paymentProcessor;
    private final PaymentMapper mapper;

    public PaymentController(PaymentRepository repository, PaymentProcessor paymentProcessor, PaymentMapper mapper) {
        this.repository = repository;
        this.paymentProcessor = paymentProcessor;
        this.mapper = mapper;
    }

    @GetMapping
    public List<PaymentResponseDto> list() {
        return mapper.toResponseDtoList(repository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponseDto> get(@PathVariable Long id) {
        return repository.findById(id)
                .map(payment -> ResponseEntity.ok(mapper.toResponseDto(payment)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PaymentResponseDto create(@RequestBody PaymentRequestDto paymentDto) {
        Payment payment = mapper.toEntity(paymentDto);
        if (payment.getStatus() == null) {
            payment.setStatus("PENDING");
        }
        Payment saved = repository.save(payment);
        return mapper.toResponseDto(saved);
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<PaymentResponseDto> confirm(@PathVariable Long id) {
        return repository.findById(id)
                .map(payment -> {
                    payment.setStatus("CONFIRMED");
                    Payment saved = repository.save(payment);
                    PaymentConfirmedEvent event = new PaymentConfirmedEvent(
                        payment.getOrderId(),
                        payment.getUserId(),
                        payment.getAmount().doubleValue()
                    );
                    paymentProcessor.publishPaymentConfirmed(event);
                    return ResponseEntity.ok(mapper.toResponseDto(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
