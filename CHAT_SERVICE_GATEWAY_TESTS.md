# Guide de Test Postman - Service de Chat AGRIMA

Ce guide fournit des exemples de requêtes Postman pour tester le service de chat via l'API Gateway (`http://localhost:8080`).

Le service a été généralisé pour permettre des conversations entre n'importe quels rôles (PRODUCTEUR, CONSOMMATEUR, ADMIN, LIVREUR).

## 1. Créer des utilisateurs de test (via user-service)

Avant de tester le chat, créez des utilisateurs avec différents rôles.

- **Méthode**: `POST`
- **URL**: `http://localhost:8080/api/users`
- **Body (JSON)**:
```json
{
  "email": "agriculteur@example.com",
  "nom": "Dupont",
  "prenom": "Jean",
  "role": "PRODUCTEUR",
  "statut": "Actif"
}
```
*Note: Répétez l'opération pour un CONSOMMATEUR, un LIVREUR, etc. Notez bien les `id` retournés.*

---

## 2. Créer une Conversation (Généralisé)

- **Méthode**: `POST`
- **URL**: `http://localhost:8080/api/chat/conversations`
- **Body (JSON)**:
```json
{
  "participant1Id": 1,
  "participant2Id": 2,
  "sujet": "Demande d'information sur les carottes"
}
```
*Ici, l'ID 1 peut être un Producteur et l'ID 2 un Consommateur, ou n'importe quelle autre combinaison.*

---

## 3. Envoyer un Message

- **Méthode**: `POST`
- **URL**: `http://localhost:8080/api/chat/messages`
- **Body (JSON)**:
```json
{
  "conversationId": 1,
  "senderId": 1,
  "body": "Bonjour, est-ce que vos carottes sont bio ?"
}
```

---

## 4. Récupérer toutes les Conversations d'un Utilisateur

Remplacez `{userId}` par l'ID de l'utilisateur (Producteur, Consommateur, Admin ou Livreur).

- **Méthode**: `GET`
- **URL**: `http://localhost:8080/api/chat/conversations/user/{userId}`

---

## 5. Récupérer les Messages d'une Conversation

- **Méthode**: `GET`
- **URL**: `http://localhost:8080/api/chat/conversations/{conversationId}/messages`

---

## 6. Récupérer une Conversation par ID

- **Méthode**: `GET`
- **URL**: `http://localhost:8080/api/chat/conversations/{id}`

---

## Résumé des Rôles Supportés
Les conversations peuvent maintenant être créées entre :
- **CONSOMMATEUR** <-> **PRODUCTEUR**
- **PRODUCTEUR** <-> **LIVREUR**
- **ADMIN** <-> **PRODUCTEUR**
- **LIVREUR** <-> **CONSOMMATEUR**
- etc.
