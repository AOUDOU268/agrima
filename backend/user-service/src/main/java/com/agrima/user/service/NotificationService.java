package com.agrima.user.service;

import com.agrima.user.model.Utilisateur;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service de notifications pour les actions d'administration.
 * Envoie des notifications aux utilisateurs suite aux actions de modération.
 * 
 * TODO: Intégrer avec le notification-service via messaging (RabbitMQ/Kafka)
 * pour une communication inter-services en production.
 */
@Service
@Slf4j
public class NotificationService {

    public void notifierValidation(Utilisateur utilisateur) {
        log.info("Notification de validation envoyée à {} ({})", utilisateur.getNom(), utilisateur.getEmail());
        // TODO: Envoyer via le notification-service (email + in-app)
    }

    public void notifierSuspension(Utilisateur utilisateur, Integer duree, String raison) {
        log.info("Notification de suspension envoyée à {} ({}) - durée: {} jours, raison: {}",
                utilisateur.getNom(), utilisateur.getEmail(), duree, raison);
        // TODO: Envoyer via le notification-service
    }

    public void notifierReactivation(Utilisateur utilisateur) {
        log.info("Notification de réactivation envoyée à {} ({})", utilisateur.getNom(), utilisateur.getEmail());
        // TODO: Envoyer via le notification-service
    }

    public void notifierAvertissement(Utilisateur utilisateur, String raison) {
        log.info("Notification d'avertissement envoyée à {} ({}) - raison: {}",
                utilisateur.getNom(), utilisateur.getEmail(), raison);
        // TODO: Envoyer via le notification-service
    }

    public void notifierBlocage(Utilisateur utilisateur, String raison) {
        log.info("Notification de blocage envoyée à {} ({}) - raison: {}",
                utilisateur.getNom(), utilisateur.getEmail(), raison);
        // TODO: Envoyer via le notification-service
    }

    public void envoyerMessage(Utilisateur utilisateur, String sujet, String contenu) {
        log.info("Message envoyé à {} ({}) - sujet: {}", utilisateur.getNom(), utilisateur.getEmail(), sujet);
        // TODO: Envoyer via le notification-service ou chat-service
    }
}
