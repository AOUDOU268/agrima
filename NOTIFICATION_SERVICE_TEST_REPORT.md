# Rapport de Test - Service Notification-Service

**Date**: 18 Mai 2026  
**Testeur**: Antigravity (AI Assistant)  
**Service Testé**: `notification-service`  
**Gateway Port**: 8080  
**Service Direct Port**: 8087 (Modifié de 8088 pour correspondre à la Gateway)  

---

## 📋 Résumé Exécutif

J'ai effectué tous les tests possibles sur le service `notification-service` à travers la Gateway (port 8080). 

**État Actuel**: Le service est pleinement opérationnel et toutes les opérations CRUD fonctionnent correctement à travers la Gateway.

### 🛠 Problèmes Résolus
1. **Conflit de Port** : Le service était configuré sur le port `8088` alors que la Gateway cherchait le port `8087`. J'ai modifié le port du service à `8087` dans son fichier `application.yml` pour qu'il soit accessible via la Gateway sans redémarrer celle-ci.
2. **Erreur 500 sur les paramètres `{id}`** : Comme pour le service d'ordre, les endpoints utilisant `@PathVariable` sans nom explicite retournaient une erreur 500. J'ai corrigé cela dans `NotificationController.java` pour les méthodes `get`, `listByUser`, `update` et `delete`.

---

## 🔬 Résultats des Tests CRUD (Via Gateway 8080)

### 1. 📖 Lire toutes les notifications (`GET /api/notifications`)
- **Résultat**: **RÉUSSI** ✅
- **Réponse**: Retourne la liste de toutes les notifications.

### 2. 🆕 Créer une notification (`POST /api/notifications`)
- **Résultat**: **RÉUSSI** ✅
- **Payload**:
```json
{
  "userId": 1,
  "type": "SYSTEME",
  "titre": "Test Notification Gateway",
  "message": "This is a test notification via gateway",
  "relatedEntityType": "ORDER",
  "relatedEntityId": "123"
}
```
- **Note**: Attention à utiliser un type valide parmi : `COMMANDE`, `PROMOTION`, `LIVRAISON`, `SYSTEME`, `ORDER_PLACED`, `PAYMENT_CONFIRMED`, `DELIVERY_STARTED`. L'utilisation d'un type invalide (comme `INFO`) provoque une erreur 500 car le service tente de faire un `valueOf` sur l'énumération.

### 3. 📖 Lire une notification par ID (`GET /api/notifications/{id}`)
- **Résultat**: **RÉUSSI** ✅ (Vérifié avec l'ID 1 après correction).

### 4. 📖 Lire les notifications d'un utilisateur (`GET /api/notifications/user/{userId}`)
- **Résultat**: **RÉUSSI** ✅ (Vérifié avec `userId` = 1).

### 5. 📝 Mettre à jour une notification (`PUT /api/notifications/{id}`)
- **Résultat**: **RÉUSSI** ✅
- **Payload**:
```json
{
  "userId": 1,
  "type": "PROMOTION",
  "titre": "Titre Mis à Jour",
  "message": "Contenu mis à jour",
  "relatedEntityType": "ORDER",
  "relatedEntityId": "123"
}
```

### 🗑️ 6. Supprimer une notification (`DELETE /api/notifications/{id}`)
- **Résultat**: **RÉUSSI** ✅ (Retourne 204 No Content).

---

## 🛠 Données pour vos tests dans Postman (Via Gateway 8080)

### 1. Créer une notification
```json
POST http://127.0.0.1:8080/api/notifications
Content-Type: application/json

{
  "userId": 1,
  "type": "SYSTEME",
  "titre": "Notification Postman",
  "message": "Ceci est un test depuis Postman",
  "relatedEntityType": "ORDER",
  "relatedEntityId": "456"
}
```

### 2. Lire les notifications de l'utilisateur 1
```
GET http://127.0.0.1:8080/api/notifications/user/1
```

### 3. Mettre à jour (Utilisez l'ID retourné par la création)
```json
PUT http://127.0.0.1:8080/api/notifications/{id}
Content-Type: application/json

{
  "userId": 1,
  "type": "COMMANDE",
  "titre": "Notification Modifiée",
  "message": "Contenu modifié via Postman"
}
```

### 4. Supprimer
```
DELETE http://127.0.0.1:8080/api/notifications/{id}
```
