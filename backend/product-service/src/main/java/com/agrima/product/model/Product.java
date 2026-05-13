package com.agrima.product.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category categorie;

    private BigDecimal prix;
    private String unite;
    private int stock;
    private int stockMinimal;
    private boolean estBio;
    private boolean estDeSaison;
    private LocalDate dateRecolte;
    private Long producteurId;
    private double noteMoyenne;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> avis = new ArrayList<>();

    public Product() {
        // Default constructor for JPA
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Category getCategorie() {
        return categorie;
    }

    public void setCategorie(Category categorie) {
        this.categorie = categorie;
    }

    public BigDecimal getPrix() {
        return prix;
    }

    public void setPrix(BigDecimal prix) {
        this.prix = prix;
    }

    public String getUnite() {
        return unite;
    }

    public void setUnite(String unite) {
        this.unite = unite;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public int getStockMinimal() {
        return stockMinimal;
    }

    public void setStockMinimal(int stockMinimal) {
        this.stockMinimal = stockMinimal;
    }

    public boolean isEstBio() {
        return estBio;
    }

    public void setEstBio(boolean estBio) {
        this.estBio = estBio;
    }

    public boolean isEstDeSaison() {
        return estDeSaison;
    }

    public void setEstDeSaison(boolean estDeSaison) {
        this.estDeSaison = estDeSaison;
    }

    public LocalDate getDateRecolte() {
        return dateRecolte;
    }

    public void setDateRecolte(LocalDate dateRecolte) {
        this.dateRecolte = dateRecolte;
    }

    public Long getProducteurId() {
        return producteurId;
    }

    public void setProducteurId(Long producteurId) {
        this.producteurId = producteurId;
    }

    public double getNoteMoyenne() {
        return noteMoyenne;
    }

    public void setNoteMoyenne(double noteMoyenne) {
        this.noteMoyenne = noteMoyenne;
    }

    public List<Review> getAvis() {
        return avis;
    }

    public void setAvis(List<Review> avis) {
        this.avis = avis;
    }
}
