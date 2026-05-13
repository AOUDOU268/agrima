package com.agrima.product.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int note;
    private String commentaire;
    private LocalDateTime date;
    private boolean verifieAchat;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReponseAvis> reponses = new ArrayList<>();

    public Review() {
        this.date = LocalDateTime.now();
        this.verifieAchat = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getNote() {
        return note;
    }

    public void setNote(int note) {
        this.note = note;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public boolean isVerifieAchat() {
        return verifieAchat;
    }

    public void setVerifieAchat(boolean verifieAchat) {
        this.verifieAchat = verifieAchat;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public List<ReponseAvis> getReponses() {
        return reponses;
    }

    public void setReponses(List<ReponseAvis> reponses) {
        this.reponses = reponses;
    }
}
