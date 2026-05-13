package com.agrima.delivery.dto;

import java.time.LocalDateTime;

public class DeliveryResponseDto {
    private Long id;
    private String numeroSuivi;
    private String statut;
    private Long commandeId;
    private Long livreurId;
    private LocalDateTime dateEstimee;
    private LocalDateTime dateLivraison;
    private String signature;
    private String adresse;

    public DeliveryResponseDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroSuivi() {
        return numeroSuivi;
    }

    public void setNumeroSuivi(String numeroSuivi) {
        this.numeroSuivi = numeroSuivi;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public Long getCommandeId() {
        return commandeId;
    }

    public void setCommandeId(Long commandeId) {
        this.commandeId = commandeId;
    }

    public Long getLivreurId() {
        return livreurId;
    }

    public void setLivreurId(Long livreurId) {
        this.livreurId = livreurId;
    }

    public LocalDateTime getDateEstimee() {
        return dateEstimee;
    }

    public void setDateEstimee(LocalDateTime dateEstimee) {
        this.dateEstimee = dateEstimee;
    }

    public LocalDateTime getDateLivraison() {
        return dateLivraison;
    }

    public void setDateLivraison(LocalDateTime dateLivraison) {
        this.dateLivraison = dateLivraison;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }
}
