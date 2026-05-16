package com.agrima.user.controller;

import com.agrima.user.dto.CreateUserRequest;
import com.agrima.user.dto.UpdateUserRequest;
import com.agrima.user.dto.UserDTO;
import com.agrima.user.model.User;
import com.agrima.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Contrôleur unifié pour la gestion des users.
 * Gère le CRUD complet sur /api/users.
 */
@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    // ========== CRUD /api/users ==========

    @GetMapping("/api/users")
    public ResponseEntity<List<UserDTO>> listAllUsers() {
        List<UserDTO> users = userRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/api/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/api/users")
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody CreateUserRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        User user = User.builder()
                .email(request.getEmail())
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .telephone(request.getTelephone())
                .role(request.getRole() != null ? request.getRole() : "ROLE_CONSOMMATEUR")
                .statut(request.getStatut() != null ? request.getStatut() : "En attente")
                .build();
        User saved = userRepository.save(user);
        return ResponseEntity.ok(mapToDTO(saved));
    }

    @PutMapping("/api/users/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable("id") Long id, @Valid @RequestBody UpdateUserRequest request) {
        return userRepository.findById(id)
                .map(existing -> {
                    if (request.getEmail() != null) existing.setEmail(request.getEmail());
                    if (request.getNom() != null) existing.setNom(request.getNom());
                    if (request.getPrenom() != null) existing.setPrenom(request.getPrenom());
                    if (request.getTelephone() != null) existing.setTelephone(request.getTelephone());
                    if (request.getRole() != null) existing.setRole(request.getRole());
                    if (request.getStatut() != null) existing.setStatut(request.getStatut());
                    User updated = userRepository.save(existing);
                    return ResponseEntity.ok(mapToDTO(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/api/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ========== Helper ==========

    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .telephone(user.getTelephone())
                .role(user.getRole())
                .statut(user.getStatut())
                .build();
    }
}
