package com.agrima.gateway.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.server.reactive.ServerHttpRequest;
import reactor.core.publisher.Mono;
import org.springframework.http.HttpMethod;

@RestController
public class GatewayController {

    private final WebClient webClient = WebClient.builder()
        .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(2 * 1024 * 1024))
        .build();

    @RequestMapping(value = {"/api/utilisateurs", "/api/utilisateurs/**", "/api/users/**"}, method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
    public Mono<ResponseEntity<byte[]>> proxyUser(ServerHttpRequest request, @RequestBody(required = false) byte[] body) {
        return proxy("http://127.0.0.1:8082", request, body);
    }

    @RequestMapping(value = {"/api/products", "/api/products/**", "/api/categories/**"}, method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
    public Mono<ResponseEntity<byte[]>> proxyProduct(ServerHttpRequest request, @RequestBody(required = false) byte[] body) {
        return proxy("http://127.0.0.1:8081", request, body);
    }

    @RequestMapping(value = {"/api/orders", "/api/orders/**"}, method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
    public Mono<ResponseEntity<byte[]>> proxyOrder(ServerHttpRequest request, @RequestBody(required = false) byte[] body) {
        return proxy("http://127.0.0.1:8084", request, body);
    }

    @RequestMapping(value = {"/api/payments", "/api/payments/**"}, method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
    public Mono<ResponseEntity<byte[]>> proxyPayment(ServerHttpRequest request, @RequestBody(required = false) byte[] body) {
        return proxy("http://127.0.0.1:8085", request, body);
    }

    @RequestMapping(value = {"/api/deliveries", "/api/deliveries/**"}, method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
    public Mono<ResponseEntity<byte[]>> proxyDelivery(ServerHttpRequest request, @RequestBody(required = false) byte[] body) {
        return proxy("http://127.0.0.1:8086", request, body);
    }

    @RequestMapping(value = {"/api/notifications", "/api/notifications/**"}, method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
    public Mono<ResponseEntity<byte[]>> proxyNotification(ServerHttpRequest request, @RequestBody(required = false) byte[] body) {
        return proxy("http://127.0.0.1:8087", request, body);
    }

    @RequestMapping(value = {"/api/chat", "/api/chat/**"}, method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
    public Mono<ResponseEntity<byte[]>> proxyChat(ServerHttpRequest request, @RequestBody(required = false) byte[] body) {
        return proxy("http://127.0.0.1:8088", request, body);
    }

    @RequestMapping(value = {"/api/auth", "/api/auth/**"}, method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
    public Mono<ResponseEntity<byte[]>> proxyAuth(ServerHttpRequest request, @RequestBody(required = false) byte[] body) {
        return proxy("http://127.0.0.1:8083", request, body);
    }

    private Mono<ResponseEntity<byte[]>> proxy(String targetBase, ServerHttpRequest request, byte[] body) {
        String url = targetBase + request.getURI().getPath();
        if (request.getURI().getQuery() != null) {
            url += "?" + request.getURI().getQuery();
        }

        WebClient.RequestBodySpec requestSpec = webClient
            .method(request.getMethod())
            .uri(url)
            .headers(headers -> {
                request.getHeaders().forEach((name, values) -> {
                    if (!name.equalsIgnoreCase("host") && !name.equalsIgnoreCase("content-length")) {
                        headers.addAll(name, values);
                    }
                });
            });

        if (body != null) {
            return requestSpec.bodyValue(body).exchangeToMono(response -> response.toEntity(byte[].class));
        } else {
            return requestSpec.exchangeToMono(response -> response.toEntity(byte[].class));
        }
    }

    @GetMapping("/gateway-health")
    public Mono<String> health() {
        return Mono.just("Robust Webflux Gateway is alive");
    }
}
