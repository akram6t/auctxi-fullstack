package com.auctxi.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class NotificationService {
    
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    private final RestTemplate restTemplate = new RestTemplate();
    private final String NOTIFICATION_SERVER_URL = "http://127.0.0.1:3000/api/notification/send";

    public void sendEmail(String to, String subject, String text, String html) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> payload = new HashMap<>();
            payload.put("to", to);
            payload.put("subject", subject);
            payload.put("text", text);
            if (html != null && !html.isEmpty()) {
                payload.put("html", html);
            }

            HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(NOTIFICATION_SERVER_URL, request, String.class);
            
            logger.info("Notification triggered successfully for: " + to);
        } catch (Exception e) {
            logger.error("Failed to send notification to " + to + ": " + e.getMessage());
        }
    }
}
