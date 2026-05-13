package com.agrima.user.service;

import com.agrima.user.dto.ActionModerationDTO;
import com.agrima.user.dto.ProfilAdminDTO;
import com.agrima.user.model.ActionModeration;
import com.agrima.user.model.Utilisateur;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

/**
 * Mapper pour convertir les entités vers les DTOs d'administration
 */
@Mapper(componentModel = "spring")
public interface AdminMapper {

    AdminMapper INSTANCE = Mappers.getMapper(AdminMapper.class);

    /**
     * Mappe une entité Utilisateur vers ProfilAdminDTO
     */
    ProfilAdminDTO toProfilAdminDTO(Utilisateur utilisateur);

    /**
     * Mappe une entité Utilisateur vers ProfilAdminDTO (inverse)
     */
    Utilisateur toUtilisateur(ProfilAdminDTO dto);

    /**
     * Mappe une entité ActionModeration vers ActionModerationDTO
     */
    ActionModerationDTO toActionModerationDTO(ActionModeration action);

    /**
     * Mappe une entité ActionModeration vers ActionModerationDTO (inverse)
     */
    ActionModeration toActionModeration(ActionModerationDTO dto);
}
