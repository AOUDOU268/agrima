package com.agrima.order.controller;

import com.agrima.events.OrderPlacedEvent;
import com.agrima.order.dto.OrderRequestDto;
import com.agrima.order.dto.OrderResponseDto;
import com.agrima.order.client.DeliveryClient;
import com.agrima.order.client.DeliveryClientDto;
import com.agrima.order.client.PaymentClient;
import com.agrima.order.client.PaymentClientDto;
import com.agrima.order.mapper.OrderMapper;
import com.agrima.order.model.OrderEntity;
import com.agrima.order.repository.OrderRepository;
import com.agrima.order.stream.OrderProcessor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderRepository repository;
    private final OrderProcessor orderProcessor;
    private final OrderMapper mapper;
    private final PaymentClient paymentClient;
    private final DeliveryClient deliveryClient;

    public OrderController(OrderRepository repository, OrderProcessor orderProcessor, OrderMapper mapper,
                           PaymentClient paymentClient, DeliveryClient deliveryClient) {
        this.repository = repository;
        this.orderProcessor = orderProcessor;
        this.mapper = mapper;
        this.paymentClient = paymentClient;
        this.deliveryClient = deliveryClient;
    }

    @GetMapping
    public List<OrderResponseDto> list() {
        List<OrderEntity> orders = repository.findAll();
        return mapper.toResponseDtoList(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDto> get(@PathVariable Long id) {
        return repository.findById(id)
                .map(order -> ResponseEntity.ok(mapper.toResponseDto(order)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public OrderResponseDto create(@RequestBody OrderRequestDto orderDto) {
        OrderEntity order = mapper.toEntity(orderDto);
        OrderEntity savedOrder = repository.save(order);

        PaymentClientDto paymentRequest = new PaymentClientDto();
        paymentRequest.setOrderId(savedOrder.getId());
        paymentRequest.setUserId(savedOrder.getClientId());
        paymentRequest.setAmount(savedOrder.getMontantTotal());
        paymentClient.createPayment(paymentRequest);

        DeliveryClientDto deliveryRequest = new DeliveryClientDto();
        deliveryRequest.setCommandeId(savedOrder.getId());
        deliveryRequest.setAdresse(savedOrder.getAdresseLivraison());
        deliveryRequest.setModeLivraison(savedOrder.getModeLivraison());
        deliveryClient.createDelivery(deliveryRequest);

        OrderPlacedEvent event = new OrderPlacedEvent(savedOrder.getId(), savedOrder.getClientId(), savedOrder.getProducteurId());
        orderProcessor.publishOrderPlaced(event);
        return mapper.toResponseDto(savedOrder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderResponseDto> update(@PathVariable Long id, @RequestBody OrderRequestDto orderDto) {
        return repository.findById(id)
                .map(existing -> {
                    OrderEntity updated = mapper.toEntity(orderDto);
                    updated.setId(id);
                    OrderEntity saved = repository.save(updated);
                    return ResponseEntity.ok(mapper.toResponseDto(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
