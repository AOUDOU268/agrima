package com.agrima.order.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponseDto {
    private Long id;
    private String numero;
    private String statut;
    private Long clientId;
    private Long producteurId;
    private String adresseLivraison;
    private String modeLivraison;
    private Double montantTotal;
    private Double fraisLivraison;
    private LocalDateTime dateCommande;
    private LocalDateTime dateLivraisonEstimee;
    private Long paiementId;
    private Long livraisonId;
    private List<LineItemResponseDto> lignes;

    // Constructors
    public OrderResponseDto() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }

    public Long getProducteurId() { return producteurId; }
    public void setProducteurId(Long producteurId) { this.producteurId = producteurId; }

    public String getAdresseLivraison() { return adresseLivraison; }
    public void setAdresseLivraison(String adresseLivraison) { this.adresseLivraison = adresseLivraison; }

    public String getModeLivraison() { return modeLivraison; }
    public void setModeLivraison(String modeLivraison) { this.modeLivraison = modeLivraison; }

    public Double getMontantTotal() { return montantTotal; }
    public void setMontantTotal(Double montantTotal) { this.montantTotal = montantTotal; }

    public Double getFraisLivraison() { return fraisLivraison; }
    public void setFraisLivraison(Double fraisLivraison) { this.fraisLivraison = fraisLivraison; }

    public LocalDateTime getDateCommande() { return dateCommande; }
    public void setDateCommande(LocalDateTime dateCommande) { this.dateCommande = dateCommande; }

    public LocalDateTime getDateLivraisonEstimee() { return dateLivraisonEstimee; }
    public void setDateLivraisonEstimee(LocalDateTime dateLivraisonEstimee) { this.dateLivraisonEstimee = dateLivraisonEstimee; }

    public Long getPaiementId() { return paiementId; }
    public void setPaiementId(Long paiementId) { this.paiementId = paiementId; }

    public Long getLivraisonId() { return livraisonId; }
    public void setLivraisonId(Long livraisonId) { this.livraisonId = livraisonId; }

    public List<LineItemResponseDto> getLignes() { return lignes; }
    public void setLignes(List<LineItemResponseDto> lignes) { this.lignes = lignes; }
}