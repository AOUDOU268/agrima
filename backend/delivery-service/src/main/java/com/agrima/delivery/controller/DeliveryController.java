package com.agrima.delivery.controller;

import com.agrima.delivery.dto.DeliveryRequestDto;
import com.agrima.delivery.dto.DeliveryResponseDto;
import com.agrima.delivery.mapper.DeliveryMapper;
import com.agrima.delivery.model.Delivery;
import com.agrima.delivery.repository.DeliveryRepository;
import com.agrima.delivery.stream.DeliveryProcessor;
import com.agrima.events.DeliveryStartedEvent;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {
    private final DeliveryRepository repository;
    private final DeliveryProcessor deliveryProcessor;
    private final DeliveryMapper mapper;

    public DeliveryController(DeliveryRepository repository, DeliveryProcessor deliveryProcessor, DeliveryMapper mapper) {
        this.repository = repository;
        this.deliveryProcessor = deliveryProcessor;
        this.mapper = mapper;
    }

    @GetMapping
    public List<DeliveryResponseDto> list() {
        return repository.findAll().stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryResponseDto> get(@PathVariable Long id) {
        return repository.findById(id)
                .map(delivery -> ResponseEntity.ok(mapper.toResponseDto(delivery)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public DeliveryResponseDto create(@RequestBody DeliveryRequestDto request) {
        Delivery delivery = mapper.toEntity(request);
        Delivery saved = repository.save(delivery);
        return mapper.toResponseDto(saved);
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<DeliveryResponseDto> start(@PathVariable Long id) {
        return repository.findById(id)
                .map(delivery -> {
                    delivery.setStatut("IN_TRANSIT");
                    Delivery saved = repository.save(delivery);
                    DeliveryStartedEvent event = new DeliveryStartedEvent(
                        saved.getId(),
                        saved.getCommandeId(),
                        saved.getLivreurId()
                    );
                    deliveryProcessor.publishDeliveryStarted(event);
                    return ResponseEntity.ok(mapper.toResponseDto(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
