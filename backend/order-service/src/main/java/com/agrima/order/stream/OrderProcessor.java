package com.agrima.order.stream;

import com.agrima.events.OrderPlacedEvent;
import com.agrima.events.PaymentConfirmedEvent;
import com.agrima.order.repository.OrderRepository;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;

import java.util.function.Consumer;

@Configuration
public class OrderProcessor {

    private final StreamBridge streamBridge;
    private final OrderRepository orderRepository;

    public OrderProcessor(StreamBridge streamBridge, OrderRepository orderRepository) {
        this.streamBridge = streamBridge;
        this.orderRepository = orderRepository;
    }

    public void publishOrderPlaced(OrderPlacedEvent event) {
        streamBridge.send("orderPlaced-out-0", event);
    }

//    @Bean
//    public Consumer<Message<PaymentConfirmedEvent>> paymentConfirmed() {
//        return message -> {
//            PaymentConfirmedEvent event = message.getPayload();
//            // Update order status to PAID
//            orderRepository.findById(event.getOrderId()).ifPresent(order -> {
//                order.setStatut("PAID");
//                orderRepository.save(order);
//                System.out.println("Order " + event.getOrderId() + " status updated to PAID");
//            });
//        };
//    }
}