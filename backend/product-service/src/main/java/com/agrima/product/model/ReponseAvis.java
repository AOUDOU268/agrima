package com.agrima.product.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "review_responses")
public class ReponseAvis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String commentaire;
    private LocalDateTime date;
    private Long auteurId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id")
    private Review review;

    public ReponseAvis() {
        this.date = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getAuteurId() {
        return auteurId;
    }

    public void setAuteurId(Long auteurId) {
        this.auteurId = auteurId;
    }

    public Review getReview() {
        return review;
    }

    public void setReview(Review review) {
        this.review = review;
    }
}
