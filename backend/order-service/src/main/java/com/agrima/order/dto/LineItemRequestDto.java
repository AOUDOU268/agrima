package com.agrima.order.dto;

public class LineItemRequestDto {
    private Long productId;
    private Integer quantite;
    private Double prixUnitaire;

    // Constructors
    public LineItemRequestDto() {}

    // Getters and setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Integer getQuantite() { return quantite; }
    public void setQuantite(Integer quantite) { this.quantite = quantite; }

    public Double getPrixUnitaire() { return prixUnitaire; }
    public void setPrixUnitaire(Double prixUnitaire) { this.prixUnitaire = prixUnitaire; }
}