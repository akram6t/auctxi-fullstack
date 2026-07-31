package com.auctxi.api.controller;

import com.auctxi.api.dto.AuthRequest;
import com.auctxi.api.dto.AuthResponse;
import com.auctxi.api.dto.RegisterRequest;
import com.auctxi.api.service.AuthService;
import com.auctxi.api.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final NotificationService notificationService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        
        // Trigger welcome email asynchronously (fire and forget for now)
        new Thread(() -> {
            notificationService.sendEmail(
                request.getEmail(), 
                "Welcome to AuctXI!", 
                "Hi " + request.getName() + ",\n\nYour account has been successfully created. Welcome to the platform!", 
                "<h3>Welcome to AuctXI!</h3><p>Hi " + request.getName() + ", your account has been successfully created.</p>"
            );
        }).start();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationException(AuthenticationException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials. Please try again."));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
    }
}
