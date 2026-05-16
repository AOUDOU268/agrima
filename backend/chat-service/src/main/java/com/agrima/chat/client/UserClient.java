package com.agrima.chat.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Component
public class UserClient {

    private final RestTemplate restTemplate;
    private static final String USER_SERVICE_URL = "http://localhost:8082";

    public UserClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Check if a user exists by ID in user-service
     */
    public boolean userExists(Long userId) {
        try {
            String url = USER_SERVICE_URL + "/api/users/" + userId;
            restTemplate.getForObject(url, Object.class);
            return true;
        } catch (RestClientException e) {
            return false;
        }
    }
}
