package com.agrima.delivery.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tournees")
public class TourneeLivraison {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long livreurId;
    private LocalDateTime heureDepart;
    private LocalDateTime heureRetour;
    private double distanceTotale;

    @OneToMany
    @JoinColumn(name = "tournee_id")
    private List<Delivery> livraisons = new ArrayList<>();

    public TourneeLivraison() {
        // Default constructor for JPA
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLivreurId() {
        return livreurId;
    }

    public void setLivreurId(Long livreurId) {
        this.livreurId = livreurId;
    }

    public LocalDateTime getHeureDepart() {
        return heureDepart;
    }

    public void setHeureDepart(LocalDateTime heureDepart) {
        this.heureDepart = heureDepart;
    }

    public LocalDateTime getHeureRetour() {
        return heureRetour;
    }

    public void setHeureRetour(LocalDateTime heureRetour) {
        this.heureRetour = heureRetour;
    }

    public double getDistanceTotale() {
        return distanceTotale;
    }

    public void setDistanceTotale(double distanceTotale) {
        this.distanceTotale = distanceTotale;
    }

    public List<Delivery> getLivraisons() {
        return livraisons;
    }

    public void setLivraisons(List<Delivery> livraisons) {
        this.livraisons = livraisons;
    }
}
