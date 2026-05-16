package com.agrima.chat.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

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

    /**
     * Get user details by ID from user-service
     */
    public Map<String, Object> getUserDetails(Long userId) {
        try {
            String url = USER_SERVICE_URL + "/api/users/" + userId;
            return restTemplate.getForObject(url, Map.class);
        } catch (RestClientException e) {
            return null;
        }
    }
}
