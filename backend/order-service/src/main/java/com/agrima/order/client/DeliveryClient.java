package com.agrima.order.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "delivery-service", url = "${delivery.service.url:http://localhost:8086}")
public interface DeliveryClient {

    @PostMapping("/api/deliveries")
    DeliveryResponseDto createDelivery(@RequestBody DeliveryClientDto request);
}
