# Rapport des Tests d'Intégration via l'API Gateway

Ce document détaille les tests API configurés pour les services **Order**, **Chat** et **Notification** via l'API Gateway (port 8080).

## Configuration de la Gateway

Les routes suivantes ont été validées et corrigées dans `backend/api-gateway/src/main/resources/application.yml` :

| Service | Préfixe Path | URL de Destination |
|---------|-------------|-------------------|
| Order | `/api/orders/**` | `http://127.0.0.1:8084` |
| Chat | `/api/chat/**` | `http://127.0.0.1:8092` |
| Notification | `/api/notifications/**` | `http://127.0.0.1:8088` |

> **Note :** Le port du service de notification a été corrigé de 8087 à 8088 pour correspondre à sa configuration réelle.

## Tests Disponibles (Collection Postman)

Une collection Postman a été créée : `postman_gateway_tests.json`.

### 1. Order Service (`/api/orders`)

| Test | Méthode | Endpoint | Description |
|------|---------|----------|-------------|
| List Orders | GET | `/api/orders` | Récupère toutes les commandes. |
| Get Order by ID | GET | `/api/orders/{id}` | Récupère une commande spécifique. |
| Create Order | POST | `/api/orders` | Crée une nouvelle commande avec ses lignes. |
| Update Order | PUT | `/api/orders/{id}` | Met à jour une commande existante. |
| Delete Order | DELETE | `/api/orders/{id}` | Supprime une commande. |

**Exemple de corps pour Création :**
```json
{
  "numero": "ORD-2023-001",
  "clientId": 1,
  "producteurId": 2,
  "adresseLivraison": "123 Rue de la Ferme, Ville",
  "modeLivraison": "DOMICILE",
  "montantTotal": 150.50,
  "fraisLivraison": 10.00,
  "lignes": [
    { "productId": 101, "quantite": 5, "prixUnitaire": 20.10 }
  ]
}
```

### 2. Chat Service (`/api/chat`)

| Test | Méthode | Endpoint | Description |
|------|---------|----------|-------------|
| Create Conversation | POST | `/api/chat/conversations` | Initialise une discussion entre deux utilisateurs. |
| Get Conversations by User | GET | `/api/chat/conversations/user/{userId}` | Liste les conversations d'un utilisateur. |
| Send Message | POST | `/api/chat/messages` | Envoie un message dans une conversation. |
| Get Messages | GET | `/api/chat/conversations/{id}/messages` | Récupère l'historique des messages. |

**Exemple de corps pour Message :**
```json
{
  "conversationId": 1,
  "senderId": 1,
  "body": "Bonjour, est-ce que les tomates sont bio ?"
}
```

### 3. Notification Service (`/api/notifications`)

| Test | Méthode | Endpoint | Description |
|------|---------|----------|-------------|
| List All | GET | `/api/notifications` | Liste toutes les notifications système. |
| Get by User | GET | `/api/notifications/user/{userId}` | Liste les notifications d'un utilisateur précis. |
| Create Notification | POST | `/api/notifications` | Crée manuellement une notification. |
| Update/Delete | PUT/DELETE | `/api/notifications/{id}` | Gestion unitaire des notifications. |

## Instructions pour Postman

1. Importer `postman_gateway_tests.json` dans Postman.
2. Utiliser la variable d'environnement `gateway_url` initialisée à `http://localhost:8080`.
3. S'assurer que la Gateway et les microservices ciblés sont démarrés.
4. Les bases de données PostgreSQL doivent être accessibles selon les configurations définies dans chaque service.

---
*Rapport généré par Jules - Ingénieur Logiciel*