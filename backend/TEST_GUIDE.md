# Guide de Test des Services Backend (Postman / cURL)

Ce document fournit des exemples de requêtes pour tester les services **Order**, **Chat** et **Notification** via l'API Gateway (port **8080**).

---

## 1. Service de Commande (Order Service)
**Base URL:** `http://localhost:8080/api/orders`

### A. Créer une commande
**POST** `/api/orders`
```json
{
  "numero": "CMD-2024-001",
  "clientId": 1,
  "producteurId": 2,
  "adresseLivraison": "Garoua, Quartier Plateau",
  "modeLivraison": "LIVRAISON_MOTO",
  "montantTotal": 15500.0,
  "fraisLivraison": 500.0,
  "lignes": [
    {
      "produitId": 1,
      "quantite": 10,
      "prixUnitaire": 1500.0
    }
  ]
}
```

### B. Lister toutes les commandes
**GET** `/api/orders`

### C. Obtenir une commande par ID
**GET** `/api/orders/1`

### D. Supprimer une commande
**DELETE** `/api/orders/1`

---

## 2. Service de Chat (Chat Service)
**Base URL:** `http://localhost:8080/api/chat`

### A. Créer une conversation
**POST** `/api/chat/conversations`
```json
{
  "consumerId": 1,
  "producerId": 2,
  "type": "PRODUIT"
}
```

### B. Envoyer un message
**POST** `/api/chat/messages`
```json
{
  "conversationId": 1,
  "senderId": 1,
  "contenu": "Bonjour, le maïs est-il disponible ?"
}
```

### C. Récupérer les messages d'une conversation
**GET** `/api/chat/conversations/1/messages`

---

## 3. Service de Notification (Notification Service)
**Base URL:** `http://localhost:8080/api/notifications`

### A. Créer une notification
**POST** `/api/notifications`
```json
{
  "userId": 1,
  "type": "INFO",
  "titre": "Commande validée",
  "message": "Votre commande CMD-2024-001 a été acceptée par le producteur.",
  "relatedEntityType": "COMMANDE",
  "relatedEntityId": 1
}
```

### B. Lister les notifications d'un utilisateur
**GET** `/api/notifications/user/1`

### C. Supprimer une notification
**DELETE** `/api/notifications/1`

---

## Note sur l'Architecture
- Toutes les requêtes pointent vers le port **8080** (Gateway).
- La Gateway redirige automatiquement vers les services internes (8084 pour Order, 8088 pour Chat, 8087 pour Notification).
- Les services utilisent actuellement une base H2 en mémoire pour les tests sandbox, mais sont configurés pour supporter PostgreSQL en local via les drivers inclus.
