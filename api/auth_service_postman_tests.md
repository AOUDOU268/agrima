# 🧪 Guide de Tests Postman — Auth Service (AGRIMA)

**Base URL :** `http://localhost:8083`

> [!NOTE]
> L'auth-service expose **3 endpoints** sous `/api/auth` et un endpoint Actuator.
> Tous les endpoints sous `/api/auth/**` et `/actuator/**` sont publics (pas besoin de token).

---

## 📋 Résumé des endpoints

| # | Méthode | URL | Description |
|---|---------|-----|-------------|
| 1 | `GET` | `/api/auth/test` | Vérifier que le service est accessible |
| 2 | `POST` | `/api/auth/register` | Inscription d'un nouvel utilisateur |
| 3 | `POST` | `/api/auth/login` | Connexion et obtention d'un token JWT |
| 4 | `GET` | `/actuator/health` | Vérifier la santé du service |

---

## 1️⃣ Test de connectivité

### ✅ GET — Vérifier que le service est accessible

```
GET http://localhost:8083/api/auth/test
```

**Headers :** Aucun requis

**Réponse attendue (200 OK) :**
```json
{
    "message": "Auth-Service is reachable via GET"
}
```

---

## 2️⃣ Inscription (Register)

### ✅ POST — Inscription réussie

```
POST http://localhost:8083/api/auth/register
```

**Headers :**
| Clé | Valeur |
|-----|--------|
| `Content-Type` | `application/json` |

**Body (raw JSON) :**
```json
{
    "email": "test@agrima.com",
    "password": "MonMotDePasse123"
}
```

**Réponse attendue (200 OK) :**
```json
{
    "message": "User registered successfully"
}
```

> [!TIP]
> Le rôle `ROLE_CONSOMMATEUR` est attribué automatiquement à tout nouvel utilisateur.

---

### ❌ POST — Inscription avec email déjà existant

```
POST http://localhost:8083/api/auth/register
```

**Body (raw JSON) :**
```json
{
    "email": "test@agrima.com",
    "password": "AutreMotDePasse"
}
```

**Réponse attendue (400 Bad Request) :**
```json
{
    "message": "Email already exists"
}
```

---

### ❌ POST — Inscription avec email invalide

```
POST http://localhost:8083/api/auth/register
```

**Body (raw JSON) :**
```json
{
    "email": "pas-un-email",
    "password": "MonMotDePasse123"
}
```

**Réponse attendue (400/500) :** Erreur de validation — "Email should be valid"

---

### ❌ POST — Inscription sans mot de passe

```
POST http://localhost:8083/api/auth/register
```

**Body (raw JSON) :**
```json
{
    "email": "test2@agrima.com",
    "password": ""
}
```

**Réponse attendue (400/500) :** Erreur de validation — "Password is required"

---

### ❌ POST — Inscription avec body vide

```
POST http://localhost:8083/api/auth/register
```

**Body (raw JSON) :**
```json
{}
```

**Réponse attendue (400/500) :** Erreur de validation

---

## 3️⃣ Connexion (Login)

### ✅ POST — Connexion réussie

> [!IMPORTANT]
> Vous devez d'abord avoir créé un compte via `/api/auth/register` avant de pouvoir vous connecter.

```
POST http://localhost:8083/api/auth/login
```

**Headers :**
| Clé | Valeur |
|-----|--------|
| `Content-Type` | `application/json` |

**Body (raw JSON) :**
```json
{
    "email": "test@agrima.com",
    "password": "MonMotDePasse123"
}
```

**Réponse attendue (200 OK) :**
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGFncmltYS5jb20iLCJpYXQiOjE3NDczNTk...",
    "email": "test@agrima.com"
}
```

> [!TIP]
> Le token JWT est valide **1 heure** (3 600 000 ms). Copiez-le pour l'utiliser dans les autres microservices en ajoutant le header : `Authorization: Bearer <votre_token>`

---

### ❌ POST — Connexion avec mauvais mot de passe

```
POST http://localhost:8083/api/auth/login
```

**Body (raw JSON) :**
```json
{
    "email": "test@agrima.com",
    "password": "MauvaisMotDePasse"
}
```

**Réponse attendue (500) :**
```json
{
    "error": "BadCredentialsException",
    "message": "Bad credentials"
}
```

---

### ❌ POST — Connexion avec un email non inscrit

```
POST http://localhost:8083/api/auth/login
```

**Body (raw JSON) :**
```json
{
    "email": "inconnu@agrima.com",
    "password": "nimportequoi"
}
```

**Réponse attendue (500) :**
```json
{
    "error": "InternalAuthenticationServiceException",
    "message": "..."
}
```

---

### ❌ POST — Connexion avec email invalide

```
POST http://localhost:8083/api/auth/login
```

**Body (raw JSON) :**
```json
{
    "email": "pas-un-email",
    "password": "MonMotDePasse123"
}
```

**Réponse attendue (400/500) :** Erreur de validation — "Email should be valid"

---

## 4️⃣ Health Check (Actuator)

### ✅ GET — Vérifier la santé du service

```
GET http://localhost:8083/actuator/health
```

**Headers :** Aucun requis

**Réponse attendue (200 OK) :**
```json
{
    "status": "UP"
}
```

---

## 📌 Ordre recommandé des tests dans Postman

Pour un scénario de test complet, suivez cet ordre :

```
1. GET  /api/auth/test              → Vérifier la connectivité
2. GET  /actuator/health            → Vérifier la santé
3. POST /api/auth/register          → Créer un compte (succès)
4. POST /api/auth/register          → Même email (erreur: déjà existant)
5. POST /api/auth/register          → Email invalide (erreur: validation)
6. POST /api/auth/register          → Mot de passe vide (erreur: validation)
7. POST /api/auth/login             → Connexion réussie → récupérer le token
8. POST /api/auth/login             → Mauvais mot de passe (erreur)
9. POST /api/auth/login             → Email inconnu (erreur)
```

---

## 🔑 Rôles disponibles dans le système

| Rôle | Description |
|------|-------------|
| `ROLE_CONSOMMATEUR` | Acheteur / Client (attribué par défaut) |
| `ROLE_PRODUCTEUR` | Vendeur / Producteur agricole |
| `ROLE_ADMIN` | Administrateur |
| `ROLE_LIVREUR` | Livreur |
| `ROLE_MODERATEUR` | Modérateur |

---

## 💡 Utiliser le token JWT dans les autres services

Après un login réussi, copiez le token et ajoutez-le comme header dans vos requêtes vers les autres microservices :

```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGFncm...
```

Dans Postman, allez dans l'onglet **Authorization** → Type **Bearer Token** → collez votre token.
