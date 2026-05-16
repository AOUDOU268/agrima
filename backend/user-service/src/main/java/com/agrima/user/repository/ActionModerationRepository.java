package com.agrima.user.repository;

import com.agrima.user.model.ActionModeration;
import com.agrima.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository pour l'entité ActionModeration.
 * Fournit les requêtes pour l'historique et le suivi des actions de modération.
 */
@Repository
public interface ActionModerationRepository extends JpaRepository<ActionModeration, Long> {

    List<ActionModeration> findByUser(User user);

    List<ActionModeration> findByStatut(String statut);

    Long countByDateActionBetween(LocalDateTime debut, LocalDateTime fin);

    List<ActionModeration> findByUserIdOrderByDateActionDesc(Long userId);
}
