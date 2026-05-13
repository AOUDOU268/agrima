package com.agrima.notification.stream;

import com.agrima.events.*;
import com.agrima.notification.model.Notification;
import com.agrima.notification.model.NotificationType;
import com.agrima.notification.repository.NotificationRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;

import java.util.function.Consumer;

@Configuration
public class NotificationProcessor {

    private final NotificationRepository notificationRepository;

    public NotificationProcessor(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Bean
    public Consumer<Message<OrderPlacedEvent>> orderPlaced() {
        return message -> {
            OrderPlacedEvent event = message.getPayload();
            Notification notification = new Notification(
                event.getUserId(),
                NotificationType.ORDER_PLACED.name(),
                "Commande passée",
                "Votre commande #" + event.getOrderId() + " a été passée avec succès.",
                event.getOrderId(),
                "Order"
            );
            notificationRepository.save(notification);
        };
    }

    @Bean
    public Consumer<Message<PaymentConfirmedEvent>> paymentConfirmed() {
        return message -> {
            PaymentConfirmedEvent event = message.getPayload();
            Notification notification = new Notification(
                event.getUserId(),
                NotificationType.PAYMENT_CONFIRMED.name(),
                "Paiement confirmé",
                "Le paiement de " + event.getAmount() + "€ pour la commande #" + event.getOrderId() + " a été confirmé.",
                event.getOrderId(),
                "Order"
            );
            notificationRepository.save(notification);
        };
    }

    @Bean
    public Consumer<Message<DeliveryStartedEvent>> deliveryStarted() {
        return message -> {
            DeliveryStartedEvent event = message.getPayload();
            Notification notification = new Notification(
                null, // TODO: get user from delivery or order
                NotificationType.DELIVERY_STARTED.name(),
                "Livraison démarrée",
                "La livraison pour la commande #" + event.getOrderId() + " a commencé.",
                event.getOrderId(),
                "Order"
            );
            notificationRepository.save(notification);
        };
    }
}