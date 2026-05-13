package com.agrima.order.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "payment-service", url = "${payment.service.url:http://localhost:8085}")
public interface PaymentClient {

    @PostMapping("/api/payments")
    PaymentResponseDto createPayment(@RequestBody PaymentClientDto request);
}
