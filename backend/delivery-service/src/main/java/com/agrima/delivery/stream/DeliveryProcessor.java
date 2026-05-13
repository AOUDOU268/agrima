package com.agrima.delivery.stream;

import com.agrima.delivery.model.Delivery;
import com.agrima.delivery.repository.DeliveryRepository;
import com.agrima.events.DeliveryStartedEvent;
import com.agrima.events.OrderPlacedEvent;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;

import java.util.function.Consumer;

@Configuration
public class DeliveryProcessor {

    private final StreamBridge streamBridge;
    private final DeliveryRepository deliveryRepository;

    public DeliveryProcessor(StreamBridge streamBridge, DeliveryRepository deliveryRepository) {
        this.streamBridge = streamBridge;
        this.deliveryRepository = deliveryRepository;
    }

    public void publishDeliveryStarted(DeliveryStartedEvent event) {
        streamBridge.send("deliveryStarted-out-0", event);
    }

    @Bean
    public Consumer<Message<OrderPlacedEvent>> orderPlaced() {
        return message -> {
            OrderPlacedEvent event = message.getPayload();
            // Create delivery for the order
            Delivery delivery = new Delivery();
            delivery.setCommandeId(event.getOrderId());
            delivery.setStatut("READY");
            deliveryRepository.save(delivery);
            System.out.println("Delivery created for order: " + event.getOrderId());
        };
    }
}