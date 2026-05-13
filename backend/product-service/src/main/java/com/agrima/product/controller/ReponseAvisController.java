package com.agrima.product.controller;

import com.agrima.product.model.ReponseAvis;
import com.agrima.product.repository.ReponseAvisRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reponses-avis")
public class ReponseAvisController {
    private final ReponseAvisRepository repository;

    public ReponseAvisController(ReponseAvisRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<ReponseAvis> list() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReponseAvis> get(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ReponseAvis create(@RequestBody ReponseAvis response) {
        return repository.save(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReponseAvis> update(@PathVariable Long id, @RequestBody ReponseAvis response) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setCommentaire(response.getCommentaire());
                    existing.setAuteurId(response.getAuteurId());
                    existing.setReview(response.getReview());
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
