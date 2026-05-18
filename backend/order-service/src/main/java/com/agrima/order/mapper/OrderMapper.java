package com.agrima.order.mapper;

import com.agrima.order.dto.LineItemRequestDto;
import com.agrima.order.dto.LineItemResponseDto;
import com.agrima.order.dto.OrderRequestDto;
import com.agrima.order.dto.OrderResponseDto;
import com.agrima.order.model.LineItem;
import com.agrima.order.model.OrderEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;
import java.math.BigDecimal;

@Component
public class OrderMapper {

    public OrderEntity toEntity(OrderRequestDto dto) {
        OrderEntity entity = new OrderEntity();
        entity.setNumero(dto.getNumero());
        entity.setClientId(dto.getClientId());
        entity.setProducteurId(dto.getProducteurId());
        entity.setAdresseLivraison(dto.getAdresseLivraison());
        entity.setModeLivraison(dto.getModeLivraison());
        entity.setMontantTotal(dto.getMontantTotal() == null ? null : BigDecimal.valueOf(dto.getMontantTotal()));
        entity.setFraisLivraison(dto.getFraisLivraison() == null ? null : BigDecimal.valueOf(dto.getFraisLivraison()));
        entity.setDateCommande(dto.getDateCommande());
        entity.setDateLivraisonEstimee(dto.getDateLivraisonEstimee());
        if (dto.getLignes() != null) {
            List<LineItem> lines = dto.getLignes().stream()
                .map(this::toLineItemEntity)
                .collect(Collectors.toList());
            lines.forEach(line -> line.setOrder(entity));
            entity.setLignes(lines);
        }
        return entity;
    }

    public OrderResponseDto toResponseDto(OrderEntity entity) {
        OrderResponseDto dto = new OrderResponseDto();
        dto.setId(entity.getId());
        dto.setNumero(entity.getNumero());
        dto.setStatut(entity.getStatut());
        dto.setClientId(entity.getClientId());
        dto.setProducteurId(entity.getProducteurId());
        dto.setAdresseLivraison(entity.getAdresseLivraison());
        dto.setModeLivraison(entity.getModeLivraison());
        dto.setMontantTotal(entity.getMontantTotal() == null ? null : entity.getMontantTotal().doubleValue());
        dto.setFraisLivraison(entity.getFraisLivraison() == null ? null : entity.getFraisLivraison().doubleValue());
        dto.setDateCommande(entity.getDateCommande());
        dto.setDateLivraisonEstimee(entity.getDateLivraisonEstimee());
        dto.setPaiementId(entity.getPaiementId());
        dto.setLivraisonId(entity.getLivraisonId());
        if (entity.getLignes() != null) {
            dto.setLignes(entity.getLignes().stream()
                .map(this::toLineItemResponseDto)
                .collect(Collectors.toList()));
        }
        return dto;
    }

    public LineItem toLineItemEntity(LineItemRequestDto dto) {
        LineItem entity = new LineItem();
        entity.setProduitId(dto.getProductId());
        entity.setQuantite(dto.getQuantite());
        entity.setPrixUnitaire(dto.getPrixUnitaire() == null ? null : BigDecimal.valueOf(dto.getPrixUnitaire()));
        return entity;
    }

    public LineItemResponseDto toLineItemResponseDto(LineItem entity) {
        LineItemResponseDto dto = new LineItemResponseDto();
        dto.setId(entity.getId());
        dto.setProductId(entity.getProduitId());
        dto.setQuantite(entity.getQuantite());
        dto.setPrixUnitaire(entity.getPrixUnitaire() == null ? null : entity.getPrixUnitaire().doubleValue());
        dto.setSousTotal(entity.calculerSousTotal() == null ? null : entity.calculerSousTotal().doubleValue());
        return dto;
    }

    public List<OrderResponseDto> toResponseDtoList(List<OrderEntity> entities) {
        return entities.stream()
            .map(this::toResponseDto)
            .collect(Collectors.toList());
    }
}