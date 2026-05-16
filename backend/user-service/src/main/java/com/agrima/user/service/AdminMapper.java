package com.agrima.user.service;

import com.agrima.user.dto.ActionModerationDTO;
import com.agrima.user.dto.ProfilAdminDTO;
import com.agrima.user.model.ActionModeration;
import com.agrima.user.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

/**
 * Mapper pour convertir les entités vers les DTOs d'administration
 */
@Mapper(componentModel = "spring")
public interface AdminMapper {

    AdminMapper INSTANCE = Mappers.getMapper(AdminMapper.class);

    /**
     * Mappe une entité User vers ProfilAdminDTO
     */
    ProfilAdminDTO toProfilAdminDTO(User user);

    /**
     * Mappe une entité User vers ProfilAdminDTO (inverse)
     */
    User toUser(ProfilAdminDTO dto);

    /**
     * Mappe une entité ActionModeration vers ActionModerationDTO
     */
    ActionModerationDTO toActionModerationDTO(ActionModeration action);

    /**
     * Mappe une entité ActionModeration vers ActionModerationDTO (inverse)
     */
    ActionModeration toActionModeration(ActionModerationDTO dto);
}
