package com.agrima.auth.controller;

import com.agrima.auth.model.AppUser;
import com.agrima.auth.model.Role;
import com.agrima.auth.repository.UserRepository;
import com.agrima.auth.security.CustomUserDetailsService;
import com.agrima.auth.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository repository;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService detailsService;

    public AuthController(UserRepository repository,
                          PasswordEncoder encoder,
                          AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          CustomUserDetailsService detailsService) {
        this.repository = repository;
        this.encoder = encoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.detailsService = detailsService;
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(Map.of("message", "Auth-Service is reachable via GET"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (repository.findByEmail(request.email()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }

        AppUser user = new AppUser();
        user.setEmail(request.email());
        user.setPasswordHash(encoder.encode(request.password()));
        user.setDateInscription(LocalDateTime.now());
        user.setActif(true);
        user.getRoles().add(Role.CONSOMMATEUR);
        repository.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        UserDetails userDetails = detailsService.loadUserByUsername(request.email());
        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", request.email()
        ));
    }

    public record RegisterRequest(
            @Email(message = "Email should be valid")
            String email,
            @NotBlank(message = "Password is required")
            String password
    ) {}

    public record LoginRequest(
            @Email(message = "Email should be valid")
            String email,
            @NotBlank(message = "Password is required")
            String password
    ) {}
}