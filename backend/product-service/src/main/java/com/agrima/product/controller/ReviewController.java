package com.agrima.product.controller;

import com.agrima.product.model.Review;
import com.agrima.product.repository.ReviewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewRepository repository;

    public ReviewController(ReviewRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Review> list() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> get(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Review create(@RequestBody Review review) {
        return repository.save(review);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> update(@PathVariable Long id, @RequestBody Review review) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setNote(review.getNote());
                    existing.setCommentaire(review.getCommentaire());
                    existing.setVerifieAchat(review.isVerifieAchat());
                    existing.setProduct(review.getProduct());
                    existing.setReponses(review.getReponses());
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
