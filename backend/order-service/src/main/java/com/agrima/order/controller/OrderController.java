package com.agrima.order.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.agrima.events.OrderPlacedEvent;
import com.agrima.order.client.DeliveryClient;
import com.agrima.order.client.DeliveryClientDto;
import com.agrima.order.client.PaymentClient;
import com.agrima.order.client.PaymentClientDto;
import com.agrima.order.dto.OrderRequestDto;
import com.agrima.order.dto.OrderResponseDto;
import com.agrima.order.mapper.OrderMapper;
import com.agrima.order.model.OrderEntity;
import com.agrima.order.repository.OrderRepository;
import com.agrima.order.stream.OrderProcessor;

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
    @Transactional(readOnly = true)
    public ResponseEntity<OrderResponseDto> get(@PathVariable("id") Long id) {
        return repository.findById(id)
                .map(order -> ResponseEntity.ok(mapper.toResponseDto(order)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Transactional
    public OrderResponseDto create(@RequestBody OrderRequestDto orderDto) {
        OrderEntity order = mapper.toEntity(orderDto);
        OrderEntity savedOrder = repository.save(order);

        try {
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
        } catch (Exception e) {
            System.err.println("Error calling external services or publishing event: " + e.getMessage());
        }

        return mapper.toResponseDto(savedOrder);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<OrderResponseDto> update(@PathVariable("id") Long id, @RequestBody OrderRequestDto orderDto) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setNumero(orderDto.getNumero());
                    existing.setClientId(orderDto.getClientId());
                    existing.setProducteurId(orderDto.getProducteurId());
                    existing.setAdresseLivraison(orderDto.getAdresseLivraison());
                    existing.setModeLivraison(orderDto.getModeLivraison());
                    if (orderDto.getMontantTotal() != null) {
                        existing.setMontantTotal(BigDecimal.valueOf(orderDto.getMontantTotal()));
                    }
                    if (orderDto.getFraisLivraison() != null) {
                        existing.setFraisLivraison(BigDecimal.valueOf(orderDto.getFraisLivraison()));
                    }
                    existing.setDateCommande(orderDto.getDateCommande());
                    existing.setDateLivraisonEstimee(orderDto.getDateLivraisonEstimee());
                    OrderEntity saved = repository.save(existing);
                    return ResponseEntity.ok(mapper.toResponseDto(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> remove(@PathVariable("id") Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
