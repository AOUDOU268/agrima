package com.agrima.user.controller;

import com.agrima.user.model.UserProfile;
import com.agrima.user.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository repository;

    public UserController(UserRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<UserProfile> list() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> get(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public UserProfile create(@RequestBody UserProfile user) {
        return repository.save(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserProfile> update(@PathVariable Long id, @RequestBody UserProfile user) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setAuthUserId(user.getAuthUserId());
                    existing.setFirstName(user.getFirstName());
                    existing.setLastName(user.getLastName());
                    existing.setEmail(user.getEmail());
                    existing.setTelephone(user.getTelephone());
                    existing.setAdresses(user.getAdresses());
                    existing.setPreferences(user.getPreferences());
                    return ResponseEntity.ok(repository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
