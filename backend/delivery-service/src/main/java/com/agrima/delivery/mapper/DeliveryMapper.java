package com.agrima.delivery.mapper;

import com.agrima.delivery.dto.DeliveryRequestDto;
import com.agrima.delivery.dto.DeliveryResponseDto;
import com.agrima.delivery.model.Delivery;
import org.springframework.stereotype.Component;

@Component
public class DeliveryMapper {

    public Delivery toEntity(DeliveryRequestDto dto) {
        Delivery delivery = new Delivery();
        delivery.setCommandeId(dto.getCommandeId());
        delivery.setLivreurId(dto.getLivreurId());
        delivery.setAdresse(dto.getAdresse());
        delivery.setStatut("READY");
        return delivery;
    }

    public DeliveryResponseDto toResponseDto(Delivery entity) {
        DeliveryResponseDto dto = new DeliveryResponseDto();
        dto.setId(entity.getId());
        dto.setNumeroSuivi(entity.getNumeroSuivi());
        dto.setStatut(entity.getStatut());
        dto.setCommandeId(entity.getCommandeId());
        dto.setLivreurId(entity.getLivreurId());
        dto.setDateEstimee(entity.getDateEstimee());
        dto.setDateLivraison(entity.getDateLivraison());
        dto.setSignature(entity.getSignature());
        dto.setAdresse(entity.getAdresse());
        return dto;
    }
}
