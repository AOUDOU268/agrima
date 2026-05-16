package com.agrima.user.repository;

import com.agrima.user.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository unifié pour l'entité User.
 * Fournit les requêtes pour le CRUD, l'administration et la modération.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByAuthUserId(Long authUserId);

    // Filtrage par rôle et statut
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.statut = :statut")
    Page<User> findByRoleAndStatut(@Param("role") String role, @Param("statut") String statut, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = :role")
    Page<User> findByRole(@Param("role") String role, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.statut = :statut")
    Page<User> findByStatut(@Param("statut") String statut, Pageable pageable);

    // Profils urgents: signalements > seuil ou statut "Signalé"
    @Query("SELECT u FROM User u WHERE u.nbSignalements > :seuil OR u.statut = :statut")
    List<User> findByNbSignalementsGreaterThanOrStatut(@Param("seuil") int seuil, @Param("statut") String statut);

    // Statistiques
    Long countByStatut(String statut);

    @Query("SELECT AVG(u.scoreConfiance) FROM User u WHERE u.scoreConfiance IS NOT NULL")
    Double getScoreConfiantMoyen();

    @Query("SELECT COALESCE(SUM(u.nbSignalements), 0) FROM User u")
    Long countSignalements();
}
