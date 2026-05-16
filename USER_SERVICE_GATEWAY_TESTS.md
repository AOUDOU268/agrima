# Tests du service user-service via la Gateway

Base URL de la Gateway : `http://localhost:8080`

> Le service utilisateur doit être accessible via la passerelle sur `/api/users`.

---

## 1. Vérifier que la Gateway et le service sont démarrés

- Ouvrir un navigateur ou exécuter en terminal :
```bash
curl -I http://localhost:8080/api/users
```
- Résultat attendu : code `200` ou `404` selon la présence des utilisateurs, mais pas d'erreur de connexion.

---

## 2. GET /api/users

### Objectif
Récupérer la liste de tous les utilisateurs.

### Requête
- Méthode : `GET`
- URL : `http://localhost:8080/api/users`
- En-tête : `Content-Type: application/json`

### Résultat attendu
- Code : `200`
- Body : liste JSON de users

---

## 3. GET /api/users/{id}

### Objectif
Récupérer un utilisateur précis par son identifiant.

### Requête
- Méthode : `GET`
- URL : `http://localhost:8080/api/users/1`
- En-tête : `Content-Type: application/json`

### Résultat attendu
- Code : `200` si l'utilisateur existe
- Code : `404` si l'utilisateur n'existe pas

---

## 4. POST /api/users

### Objectif
Créer un nouvel utilisateur.

### Requête
- Méthode : `POST`
- URL : `http://localhost:8080/api/users`
- En-têtes :
  - `Content-Type: application/json`

### Corps JSON exemple
```json
{
  "email": "test.user@example.com",
  "nom": "Test",
  "prenom": "User",
  "telephone": "+33612345678",
  "role": "ROLE_CONSOMMATEUR",
  "statut": "En attente"
}
```

### Résultat attendu
- Code : `200`
- Body : objet JSON du user créé avec un `id`

### Cas d'erreur
- Si l'email existe déjà : `400 Bad Request`

---

## 5. PUT /api/users/{id}

### Objectif
Mettre à jour un utilisateur existant.

### Requête
- Méthode : `PUT`
- URL : `http://localhost:8080/api/users/{id}`
- En-têtes :
  - `Content-Type: application/json`

### Corps JSON exemple
```json
{
  "telephone": "+33699999999",
  "statut": "Actif"
}
```

### Résultat attendu
- Code : `200` si l'utilisateur existe
- Code : `404` si l'utilisateur n'existe pas

---

## 6. DELETE /api/users/{id}

### Objectif
Supprimer un utilisateur.

### Requête
- Méthode : `DELETE`
- URL : `http://localhost:8080/api/users/{id}`
- En-tête : `Content-Type: application/json`

### Résultat attendu
- Code : `204` si la suppression réussit
- Code : `404` si l'utilisateur n'existe pas

---

## 7. Scénarios de test Postman

### Préparation
1. Ouvrir Postman.
2. Créer une collection `AGRIMA User Service via Gateway`.
3. Définir une variable d'environnement :
   - `{{gateway_url}} = http://localhost:8080`

### Requêtes à créer
1. `GET {{gateway_url}}/api/users`
2. `GET {{gateway_url}}/api/users/1`
3. `POST {{gateway_url}}/api/users`
4. `PUT {{gateway_url}}/api/users/{{created_user_id}}`
5. `DELETE {{gateway_url}}/api/users/{{created_user_id}}`

### Astuce Postman
- Pour le test `PUT` et `DELETE`, utiliser l'ID renvoyé par la requête `POST`.
- Si Postman supporte les tests automatisés, ajouter une assertion sur le statut HTTP attendu.

---

## 8. Points de vérification

- La Gateway doit router vers `user-service` sur `http://127.0.0.1:8082`
- Tous les appels doivent utiliser `/api/users`
- Aucune route `/api/utilisateurs` ne doit être utilisée dans ces tests
- Si l'appel échoue avec `502` ou `504`, vérifier que le service `user-service` est bien démarré sur le port `8082`
