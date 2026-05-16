# Guide de Test API - Service Utilisateur

Ce document contient des exemples de tests pour tous les endpoints REST du service utilisateur (CRUD).

**Base URL:** `http://localhost:8082`

---

## 📋 Table des matières

1. [GET - Récupérer les utilisateurs](#get---récupérer-les-utilisateurs)
2. [GET - Récupérer un utilisateur par ID](#get---récupérer-un-utilisateur-par-id)
3. [POST - Créer un nouvel utilisateur](#post---créer-un-nouvel-utilisateur)
4. [PUT - Mettre à jour un utilisateur](#put---mettre-à-jour-un-utilisateur)
5. [DELETE - Supprimer un utilisateur](#delete---supprimer-un-utilisateur)
6. [Tests avec Postman](#tests-avec-postman)
7. [Codes de réponse](#codes-de-réponse)

---

## GET - Récupérer les utilisateurs

### Tous les utilisateurs

#### cURL
```bash
curl -X GET http://localhost:8082/api/users \
  -H "Content-Type: application/json"
```

#### PowerShell
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:8082/api/users" `
  -Method GET `
  -Headers @{"Content-Type" = "application/json"} `
  -UseBasicParsing

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

#### JavaScript (Fetch API)
```javascript
fetch('http://localhost:8082/api/users', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

#### HTTPie
```bash
http GET http://localhost:8082/api/users
```

#### Réponse attendue (200 OK)
```json
[
  {
    "id": 1,
    "email": "john@example.com",
    "nom": "Dupont",
    "prenom": "Jean",
    "telephone": "+33612345678",
    "role": "ADMIN",
    "statut": "ACTIF"
  },
  {
    "id": 2,
    "email": "marie@example.com",
    "nom": "Martin",
    "prenom": "Marie",
    "telephone": "+33687654321",
    "role": "USER",
    "statut": "ACTIF"
  }
]
```

---

## GET - Récupérer un utilisateur par ID

### Récupérer l'utilisateur avec ID = 1

#### cURL
```bash
curl -X GET http://localhost:8082/api/users/1 \
  -H "Content-Type: application/json"
```

#### PowerShell
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:8082/api/users/1" `
  -Method GET `
  -Headers @{"Content-Type" = "application/json"} `
  -UseBasicParsing

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

#### JavaScript (Fetch API)
```javascript
fetch('http://localhost:8082/api/users/1', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => {
  if (response.ok) {
    return response.json();
  } else if (response.status === 404) {
    throw new Error('Utilisateur non trouvé');
  }
  throw new Error('Erreur serveur');
})
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

#### HTTPie
```bash
http GET http://localhost:8082/api/users/1
```

#### Réponse attendue (200 OK)
```json
{
  "id": 1,
  "email": "john@example.com",
  "nom": "Dupont",
  "prenom": "Jean",
  "telephone": "+33612345678",
  "role": "ADMIN",
  "statut": "ACTIF"
}
```

#### Erreur attendue si l'ID n'existe pas (404 NOT FOUND)
```json
{
  "status": 404,
  "message": "Utilisateur non trouvé",
  "error": "Not Found"
}
```

---

## POST - Créer un nouvel utilisateur

### Créer un utilisateur

#### cURL
```bash
curl -X POST http://localhost:8082/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "nom": "Durand",
    "prenom": "Alice",
    "telephone": "+33712345678",
    "role": "USER",
    "statut": "ACTIF"
  }'
```

#### PowerShell
```powershell
$body = @{
    email = "alice@example.com"
    nom = "Durand"
    prenom = "Alice"
    telephone = "+33712345678"
    role = "USER"
    statut = "ACTIF"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8082/api/users" `
  -Method POST `
  -Body $body `
  -ContentType "application/json" `
  -UseBasicParsing

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

#### JavaScript (Fetch API)
```javascript
const userData = {
  email: "alice@example.com",
  nom: "Durand",
  prenom: "Alice",
  telephone: "+33712345678",
  role: "USER",
  statut: "ACTIF"
};

fetch('http://localhost:8082/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(userData)
})
.then(response => {
  if (response.status === 201) {
    return response.json();
  } else if (response.status === 400) {
    throw new Error('Données invalides');
  } else if (response.status === 409) {
    throw new Error('Email déjà existant');
  }
  throw new Error('Erreur serveur');
})
.then(data => console.log('Utilisateur créé:', data))
.catch(error => console.error('Error:', error));
```

#### HTTPie
```bash
http POST http://localhost:8082/api/users \
  email="alice@example.com" \
  nom="Durand" \
  prenom="Alice" \
  telephone="+33712345678" \
  role="USER" \
  statut="ACTIF"
```

#### Réponse attendue (201 CREATED)
```json
{
  "id": 3,
  "email": "alice@example.com",
  "nom": "Durand",
  "prenom": "Alice",
  "telephone": "+33712345678",
  "role": "USER",
  "statut": "ACTIF"
}
```

#### Erreur - Email invalide (400 BAD REQUEST)
```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "must be a well-formed email address"
    }
  ],
  "error": "Bad Request"
}
```

#### Erreur - Email déjà existant (409 CONFLICT)
```json
{
  "status": 409,
  "message": "Email already exists",
  "field": "email",
  "error": "DataIntegrityViolation"
}
```

#### Erreur - Champ obligatoire manquant (400 BAD REQUEST)
```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "nom",
      "message": "must not be blank"
    }
  ],
  "error": "Bad Request"
}
```

---

## PUT - Mettre à jour un utilisateur

### Mettre à jour l'utilisateur avec ID = 1

#### cURL - Mise à jour partielle
```bash
curl -X PUT http://localhost:8082/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "telephone": "+33699999999",
    "statut": "INACTIF"
  }'
```

#### cURL - Mise à jour complète
```bash
curl -X PUT http://localhost:8082/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.updated@example.com",
    "nom": "Dupont",
    "prenom": "Jean",
    "telephone": "+33699999999",
    "role": "ADMIN",
    "statut": "INACTIF"
  }'
```

#### PowerShell - Mise à jour partielle
```powershell
$body = @{
    telephone = "+33699999999"
    statut = "INACTIF"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8082/api/users/1" `
  -Method PUT `
  -Body $body `
  -ContentType "application/json" `
  -UseBasicParsing

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

#### JavaScript (Fetch API)
```javascript
const updateData = {
  telephone: "+33699999999",
  statut: "INACTIF"
};

fetch('http://localhost:8082/api/users/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(updateData)
})
.then(response => {
  if (response.ok) {
    return response.json();
  } else if (response.status === 404) {
    throw new Error('Utilisateur non trouvé');
  } else if (response.status === 400) {
    throw new Error('Données invalides');
  }
  throw new Error('Erreur serveur');
})
.then(data => console.log('Utilisateur mis à jour:', data))
.catch(error => console.error('Error:', error));
```

#### HTTPie
```bash
http PUT http://localhost:8082/api/users/1 \
  telephone="+33699999999" \
  statut="INACTIF"
```

#### Réponse attendue (200 OK)
```json
{
  "id": 1,
  "email": "john@example.com",
  "nom": "Dupont",
  "prenom": "Jean",
  "telephone": "+33699999999",
  "role": "ADMIN",
  "statut": "INACTIF"
}
```

#### Erreur - Utilisateur non trouvé (404 NOT FOUND)
```json
{
  "status": 404,
  "message": "Utilisateur non trouvé",
  "error": "Not Found"
}
```

---

## DELETE - Supprimer un utilisateur

### Supprimer l'utilisateur avec ID = 1

#### cURL
```bash
curl -X DELETE http://localhost:8082/api/users/1 \
  -H "Content-Type: application/json"
```

#### PowerShell
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:8082/api/users/1" `
  -Method DELETE `
  -Headers @{"Content-Type" = "application/json"} `
  -UseBasicParsing

Write-Host "Status: $($response.StatusCode)"
Write-Host "Message: Utilisateur supprimé avec succès"
```

#### JavaScript (Fetch API)
```javascript
fetch('http://localhost:8082/api/users/1', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => {
  if (response.status === 204) {
    console.log('Utilisateur supprimé avec succès');
  } else if (response.status === 404) {
    throw new Error('Utilisateur non trouvé');
  } else {
    throw new Error('Erreur serveur');
  }
})
.catch(error => console.error('Error:', error));
```

#### HTTPie
```bash
http DELETE http://localhost:8082/api/users/1
```

#### Réponse attendue (204 NO CONTENT)
```
Pas de contenu - Suppression réussie
```

#### Erreur - Utilisateur non trouvé (404 NOT FOUND)
```json
{
  "status": 404,
  "message": "Utilisateur non trouvé",
  "error": "Not Found"
}
```

---

## Tests avec Postman

### Importer une collection Postman

Créez un fichier `postman_collection.json` avec le contenu suivant:

```json
{
  "info": {
    "name": "Service Utilisateur - Tests API",
    "description": "Collection de tests pour l'API REST du service utilisateur",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "GET - Tous les utilisateurs",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:8082/api/users",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8082",
          "path": ["api", "utilisateurs"]
        }
      }
    },
    {
      "name": "GET - Utilisateur par ID",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:8082/api/users/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8082",
          "path": ["api", "utilisateurs", "1"]
        }
      }
    },
    {
      "name": "POST - Créer utilisateur",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"nom\": \"Test\",\n  \"prenom\": \"User\",\n  \"telephone\": \"+33612345678\",\n  \"role\": \"USER\",\n  \"statut\": \"ACTIF\"\n}"
        },
        "url": {
          "raw": "http://localhost:8082/api/users",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8082",
          "path": ["api", "utilisateurs"]
        }
      }
    },
    {
      "name": "PUT - Mettre à jour utilisateur",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"telephone\": \"+33699999999\",\n  \"statut\": \"INACTIF\"\n}"
        },
        "url": {
          "raw": "http://localhost:8082/api/users/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8082",
          "path": ["api", "utilisateurs", "1"]
        }
      }
    },
    {
      "name": "DELETE - Supprimer utilisateur",
      "request": {
        "method": "DELETE",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:8082/api/users/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8082",
          "path": ["api", "utilisateurs", "1"]
        }
      }
    }
  ]
}
```

Puis, dans Postman:
1. Cliquez sur **Import**
2. Collez le JSON ou sélectionnez le fichier
3. La collection sera importée avec tous les tests

---

## Codes de réponse

| Code | Signification | Cas d'utilisation |
|------|---------------|-------------------|
| **200 OK** | Succès - Données retournées | GET, PUT réussis |
| **201 CREATED** | Créé - Ressource créée | POST réussi |
| **204 NO CONTENT** | Pas de contenu - Suppression réussie | DELETE réussi |
| **400 BAD REQUEST** | Requête invalide | Validation échouée, données manquantes |
| **404 NOT FOUND** | Non trouvé | ID utilisateur inexistant |
| **409 CONFLICT** | Conflit | Email déjà existant |
| **500 INTERNAL SERVER ERROR** | Erreur serveur | Problème dans la base de données |

---

## Format de validation des requêtes

### Champs obligatoires pour POST
```json
{
  "email": "user@example.com",     // OBLIGATOIRE - Format email valide
  "nom": "Dupont",                 // OBLIGATOIRE - Non vide
  "prenom": "Jean",                // OBLIGATOIRE - Non vide
  "role": "USER"                   // OBLIGATOIRE - Non vide
}
```

### Champs optionnels
```json
{
  "telephone": "+33612345678",     // OPTIONNEL
  "statut": "ACTIF"                // OPTIONNEL
}
```

### Champs optionnels pour PUT
```json
{
  "email": "new@example.com",      // OPTIONNEL
  "nom": "Nouveau nom",            // OPTIONNEL
  "prenom": "Nouveau prenom",      // OPTIONNEL
  "telephone": "+33699999999",     // OPTIONNEL
  "role": "ADMIN",                 // OPTIONNEL
  "statut": "INACTIF"              // OPTIONNEL
}
```

---

## Scripts de test automatisés

### Script PowerShell - Test complet
```powershell
$baseUrl = "http://localhost:8082"

# Test 1: GET tous les utilisateurs
Write-Host "=== TEST 1: GET /api/users ===" -ForegroundColor Green
$response = Invoke-WebRequest -Uri "$baseUrl/api/users" -Method GET -UseBasicParsing
Write-Host "Status: $($response.StatusCode)"
$response.Content | ConvertFrom-Json | ConvertTo-Json

# Test 2: POST - Créer utilisateur
Write-Host "\n=== TEST 2: POST /api/users ===" -ForegroundColor Green
$body = @{
    email = "test$(Get-Random)@example.com"
    nom = "Test"
    prenom = "User"
    role = "USER"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/users" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)"
    $userId = ($response.Content | ConvertFrom-Json).id
    Write-Host "Utilisateur créé avec ID: $userId"
    $response.Content | ConvertFrom-Json | ConvertTo-Json
} catch {
    Write-Host "Erreur: $($_.Exception.Response.StatusCode.Value__)"
    $_.Exception.Response.Content | ConvertFrom-Json | ConvertTo-Json
}

# Test 3: GET utilisateur par ID
Write-Host "\n=== TEST 3: GET /api/users/{id} ===" -ForegroundColor Green
$response = Invoke-WebRequest -Uri "$baseUrl/api/users/$userId" -Method GET -UseBasicParsing
Write-Host "Status: $($response.StatusCode)"
$response.Content | ConvertFrom-Json | ConvertTo-Json

# Test 4: PUT - Mettre à jour
Write-Host "\n=== TEST 4: PUT /api/users/{id} ===" -ForegroundColor Green
$updateBody = @{
    telephone = "+33699999999"
    statut = "INACTIF"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$baseUrl/api/users/$userId" -Method PUT -Body $updateBody -ContentType "application/json" -UseBasicParsing
Write-Host "Status: $($response.StatusCode)"
$response.Content | ConvertFrom-Json | ConvertTo-Json

# Test 5: DELETE
Write-Host "\n=== TEST 5: DELETE /api/users/{id} ===" -ForegroundColor Green
$response = Invoke-WebRequest -Uri "$baseUrl/api/users/$userId" -Method DELETE -UseBasicParsing
Write-Host "Status: $($response.StatusCode)"
Write-Host "Utilisateur supprimé avec succès"
```

### Exécuter le script
```powershell
powershell -ExecutionPolicy Bypass -File test_api.ps1
```

---

## Conseils pour les tests

1. **Testez dans cet ordre**: GET → POST → GET (ID) → PUT → DELETE
2. **Utilisez des emails uniques** lors des tests POST (ex: `test123456@example.com`)
3. **Vérifiez les codes HTTP** pour chaque réponse
4. **Inspectez les messages d'erreur** pour comprendre les problèmes de validation
5. **Utilisez Postman** pour une meilleure interface de test avec historique
6. **Nettoyez la BD** régulièrement avec: `DELETE FROM utilisateurs;`

---

**Dernière mise à jour:** 25 avril 2026

