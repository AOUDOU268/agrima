package com.agrima.product.controller;

import com.agrima.product.model.Product;
import com.agrima.product.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductRepository repository;

    public ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Product> list() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> get(@PathVariable("id") Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        return repository.save(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable("id") Long id, @RequestBody Product product) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setNom(product.getNom());
                    existing.setDescription(product.getDescription());
                    existing.setCategorie(product.getCategorie());
                    existing.setPrix(product.getPrix());
                    existing.setUnite(product.getUnite());
                    existing.setStock(product.getStock());
                    existing.setStockMinimal(product.getStockMinimal());
                    existing.setEstBio(product.isEstBio());
                    existing.setEstDeSaison(product.isEstDeSaison());
                    existing.setDateRecolte(product.getDateRecolte());
                    existing.setProducteurId(product.getProducteurId());
                    existing.setNoteMoyenne(product.getNoteMoyenne());
                    existing.setAvis(product.getAvis());
                    return ResponseEntity.ok(repository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
