package com.agrima.delivery.controller;

import com.agrima.delivery.model.TourneeLivraison;
import com.agrima.delivery.repository.TourneeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tournees")
public class TourneeController {
    private final TourneeRepository repository;

    public TourneeController(TourneeRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<TourneeLivraison> list() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourneeLivraison> get(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public TourneeLivraison create(@RequestBody TourneeLivraison tournee) {
        return repository.save(tournee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TourneeLivraison> update(@PathVariable Long id, @RequestBody TourneeLivraison tournee) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setLivreurId(tournee.getLivreurId());
                    existing.setHeureDepart(tournee.getHeureDepart());
                    existing.setHeureRetour(tournee.getHeureRetour());
                    existing.setDistanceTotale(tournee.getDistanceTotale());
                    existing.setLivraisons(tournee.getLivraisons());
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
