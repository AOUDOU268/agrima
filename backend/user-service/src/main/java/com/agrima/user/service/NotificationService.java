package com.agrima.user.service;

import com.agrima.user.model.User;
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

    public void notifierValidation(User user) {
        log.info("Notification de validation envoyée à {} ({})", user.getNom(), user.getEmail());
        // TODO: Envoyer via le notification-service (email + in-app)
    }

    public void notifierSuspension(User user, Integer duree, String raison) {
        log.info("Notification de suspension envoyée à {} ({}) - durée: {} jours, raison: {}",
                user.getNom(), user.getEmail(), duree, raison);
        // TODO: Envoyer via le notification-service
    }

    public void notifierReactivation(User user) {
        log.info("Notification de réactivation envoyée à {} ({})", user.getNom(), user.getEmail());
        // TODO: Envoyer via le notification-service
    }

    public void notifierAvertissement(User user, String raison) {
        log.info("Notification d'avertissement envoyée à {} ({}) - raison: {}",
                user.getNom(), user.getEmail(), raison);
        // TODO: Envoyer via le notification-service
    }

    public void notifierBlocage(User user, String raison) {
        log.info("Notification de blocage envoyée à {} ({}) - raison: {}",
                user.getNom(), user.getEmail(), raison);
        // TODO: Envoyer via le notification-service
    }

    public void envoyerMessage(User user, String sujet, String contenu) {
        log.info("Message envoyé à {} ({}) - sujet: {}", user.getNom(), user.getEmail(), sujet);
        // TODO: Envoyer via le notification-service ou chat-service
    }
}
