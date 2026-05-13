package com.agrima.payment.stream;

import com.agrima.events.OrderPlacedEvent;
import com.agrima.events.PaymentConfirmedEvent;
import com.agrima.payment.model.Payment;
import com.agrima.payment.repository.PaymentRepository;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;

import java.math.BigDecimal;
import java.util.function.Consumer;

@Configuration
public class PaymentProcessor {

    private final StreamBridge streamBridge;
    private final PaymentRepository paymentRepository;

    public PaymentProcessor(StreamBridge streamBridge, PaymentRepository paymentRepository) {
        this.streamBridge = streamBridge;
        this.paymentRepository = paymentRepository;
    }

    public void publishPaymentConfirmed(PaymentConfirmedEvent event) {
        streamBridge.send("paymentConfirmed-out-0", event);
    }

    @Bean
    public Consumer<Message<OrderPlacedEvent>> orderPlaced() {
        return message -> {
            OrderPlacedEvent event = message.getPayload();
            // Create payment for the order
            Payment payment = new Payment();
            payment.setOrderId(event.getOrderId());
            payment.setUserId(event.getUserId());
            payment.setAmount(BigDecimal.ZERO); // TODO: get from order
            payment.setStatus("PENDING");
            paymentRepository.save(payment);
            System.out.println("Payment created for order: " + event.getOrderId());
        };
    }
}