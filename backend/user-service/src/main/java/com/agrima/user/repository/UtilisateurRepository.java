package com.agrima.user.repository;

import com.agrima.user.model.Utilisateur;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité Utilisateur.
 * Fournit les requêtes nécessaires pour l'administration et la modération.
 */
@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByEmail(String email);

    // Filtrage par rôle et statut
    @Query("SELECT u FROM Utilisateur u WHERE u.role = :role AND u.statut = :statut")
    Page<Utilisateur> findByRoleAndStatut(@Param("role") String role, @Param("statut") String statut, Pageable pageable);

    @Query("SELECT u FROM Utilisateur u WHERE u.role = :role")
    Page<Utilisateur> findByRole(@Param("role") String role, Pageable pageable);

    @Query("SELECT u FROM Utilisateur u WHERE u.statut = :statut")
    Page<Utilisateur> findByStatut(@Param("statut") String statut, Pageable pageable);

    // Profils urgents: signalements > seuil ou statut "Signalé"
    @Query("SELECT u FROM Utilisateur u WHERE u.nbSignalements > :seuil OR u.statut = :statut")
    List<Utilisateur> findByNbSignalementsGreaterThanOrStatut(@Param("seuil") int seuil, @Param("statut") String statut);

    // Statistiques
    Long countByStatut(String statut);

    @Query("SELECT AVG(u.scoreConfiance) FROM Utilisateur u WHERE u.scoreConfiance IS NOT NULL")
    Double getScoreConfiantMoyen();

    @Query("SELECT COALESCE(SUM(u.nbSignalements), 0) FROM Utilisateur u")
    Long countSignalements();
}
