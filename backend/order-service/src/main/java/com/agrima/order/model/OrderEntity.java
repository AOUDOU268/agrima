package com.agrima.order.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String numero;
    private String statut;
    private Long clientId;
    private Long producteurId;
    private String adresseLivraison;
    private String modeLivraison;
    private BigDecimal montantTotal;
    private BigDecimal fraisLivraison;
    private LocalDateTime dateCommande;
    private LocalDateTime dateLivraisonEstimee;
    private Long paiementId;
    private Long livraisonId;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LineItem> lignes = new ArrayList<>();

    public OrderEntity() {
        this.dateCommande = LocalDateTime.now();
        this.statut = "PENDING";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public Long getProducteurId() {
        return producteurId;
    }

    public void setProducteurId(Long producteurId) {
        this.producteurId = producteurId;
    }

    public String getAdresseLivraison() {
        return adresseLivraison;
    }

    public void setAdresseLivraison(String adresseLivraison) {
        this.adresseLivraison = adresseLivraison;
    }

    public String getModeLivraison() {
        return modeLivraison;
    }

    public void setModeLivraison(String modeLivraison) {
        this.modeLivraison = modeLivraison;
    }

    public BigDecimal getMontantTotal() {
        return montantTotal;
    }

    public void setMontantTotal(BigDecimal montantTotal) {
        this.montantTotal = montantTotal;
    }

    public BigDecimal getFraisLivraison() {
        return fraisLivraison;
    }

    public void setFraisLivraison(BigDecimal fraisLivraison) {
        this.fraisLivraison = fraisLivraison;
    }

    public LocalDateTime getDateCommande() {
        return dateCommande;
    }

    public void setDateCommande(LocalDateTime dateCommande) {
        this.dateCommande = dateCommande;
    }

    public LocalDateTime getDateLivraisonEstimee() {
        return dateLivraisonEstimee;
    }

    public void setDateLivraisonEstimee(LocalDateTime dateLivraisonEstimee) {
        this.dateLivraisonEstimee = dateLivraisonEstimee;
    }

    public Long getPaiementId() {
        return paiementId;
    }

    public void setPaiementId(Long paiementId) {
        this.paiementId = paiementId;
    }

    public Long getLivraisonId() {
        return livraisonId;
    }

    public void setLivraisonId(Long livraisonId) {
        this.livraisonId = livraisonId;
    }

    public List<LineItem> getLignes() {
        return lignes;
    }

    public void setLignes(List<LineItem> lignes) {
        this.lignes = lignes;
    }

    public BigDecimal calculerTotal() {
        return lignes.stream()
                .map(LineItem::calculerSousTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .add(fraisLivraison == null ? BigDecimal.ZERO : fraisLivraison);
    }
}
