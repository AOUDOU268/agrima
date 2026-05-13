# Commandes cURL Rapides - Service Utilisateur

## Setup rapide

```bash
# Définir l'URL de base (Windows PowerShell)
$base_url = "http://localhost:8082"
```

---

## 1️⃣ GET - Récupérer tous les utilisateurs

```bash
curl -X GET http://localhost:8082/api/utilisateurs \
  -H "Content-Type: application/json"
```

**PowerShell:**
```powershell
$base_url = "http://localhost:8082"
Invoke-WebRequest -Uri "$base_url/api/utilisateurs" -Method GET -UseBasicParsing | ConvertFrom-Json
```

**Réponse attendue:** `200 OK` avec liste des utilisateurs

---

## 2️⃣ GET - Récupérer un utilisateur par ID

```bash
curl -X GET http://localhost:8082/api/utilisateurs/1 \
  -H "Content-Type: application/json"
```

**PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://localhost:8082/api/utilisateurs/1" -Method GET -UseBasicParsing | ConvertFrom-Json
```

**Réponse attendue:** `200 OK` avec données utilisateur ou `404 NOT FOUND`

---

## 3️⃣ POST - Créer un nouvel utilisateur

### Exemple simple

```bash
curl -X POST http://localhost:8082/api/utilisateurs \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean.dupont@example.com",
    "nom": "Dupont",
    "prenom": "Jean",
    "telephone": "+33612345678",
    "role": "USER",
    "statut": "ACTIF"
  }'
```

### Exemple avec variables PowerShell

```powershell
$body = @{
    email = "alice.martin@example.com"
    nom = "Martin"
    prenom = "Alice"
    telephone = "+33687654321"
    role = "USER"
    statut = "ACTIF"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8082/api/utilisateurs" `
  -Method POST `
  -Body $body `
  -ContentType "application/json" `
  -UseBasicParsing | ConvertFrom-Json
```

### Créer avec timestamp (email unique automatique)

```bash
timestamp=$(date +%s)
curl -X POST http://localhost:8082/api/utilisateurs \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"test.$timestamp@example.com\",
    \"nom\": \"TestNom\",
    \"prenom\": \"TestPrenom\",
    \"role\": \"USER\"
  }"
```

**PowerShell (email unique):**
```powershell
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$body = @{
    email = "test.$timestamp@example.com"
    nom = "Test"
    prenom = "User"
    role = "USER"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8082/api/utilisateurs" `
  -Method POST `
  -Body $body `
  -ContentType "application/json" `
  -UseBasicParsing
```

**Réponse attendue:** `201 CREATED` avec l'utilisateur créé

---

## 4️⃣ PUT - Mettre à jour un utilisateur

### Mise à jour partielle (certains champs)

```bash
curl -X PUT http://localhost:8082/api/utilisateurs/1 \
  -H "Content-Type: application/json" \
  -d '{
    "telephone": "+33699999999",
    "statut": "INACTIF"
  }'
```

**PowerShell:**
```powershell
$body = @{
    telephone = "+33699999999"
    statut = "INACTIF"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8082/api/utilisateurs/1" `
  -Method PUT `
  -Body $body `
  -ContentType "application/json" `
  -UseBasicParsing | ConvertFrom-Json
```

### Mise à jour complète (tous les champs)

```bash
curl -X PUT http://localhost:8082/api/utilisateurs/1 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newemail@example.com",
    "nom": "NouveauNom",
    "prenom": "NouveauPrenom",
    "telephone": "+33712345678",
    "role": "ADMIN",
    "statut": "ACTIF"
  }'
```

**Réponse attendue:** `200 OK` avec utilisateur mis à jour

---

## 5️⃣ DELETE - Supprimer un utilisateur

```bash
curl -X DELETE http://localhost:8082/api/utilisateurs/1 \
  -H "Content-Type: application/json"
```

**PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://localhost:8082/api/utilisateurs/1" `
  -Method DELETE `
  -Headers @{"Content-Type" = "application/json"} `
  -UseBasicParsing

Write-Host "Utilisateur supprimé (HTTP 204)"
```

**Réponse attendue:** `204 NO CONTENT`

---

## 🔍 Vérifier la santé du service

```bash
curl -X GET http://localhost:8082/actuator/health \
  -H "Content-Type: application/json"
```

**PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://localhost:8082/actuator/health" `
  -Method GET `
  -UseBasicParsing | ConvertFrom-Json
```

---

## ⚠️ Codes de réponse courants

| Code | Signification | Cause |
|------|---------------|-------|
| **200 OK** | Succès | GET/PUT réussis |
| **201 CREATED** | Créé | POST réussi |
| **204 NO CONTENT** | Suppression réussie | DELETE réussi |
| **400 BAD REQUEST** | Requête invalide | Email invalide, champs manquants |
| **404 NOT FOUND** | Non trouvé | ID utilisateur inexistant |
| **409 CONFLICT** | Conflit | Email déjà existant |
| **500 INTERNAL SERVER ERROR** | Erreur serveur | Problème base de données |

---

## 🗄️ Utilitaires Base de Données

### Se connecter à PostgreSQL

```bash
# Windows avec psql
psql -h localhost -U postgres -d user_db

# Ou via PowerShell
psql -h localhost -U postgres -d user_db
```

### Supprimer tous les utilisateurs (ATTENTION!)

```sql
-- Supprimer tous les utilisateurs
DELETE FROM utilisateurs;

-- Réinitialiser l'ID auto-increment
ALTER SEQUENCE utilisateurs_id_seq RESTART WITH 1;

-- Vérifier
SELECT COUNT(*) FROM utilisateurs;
```

### Voir tous les utilisateurs

```sql
SELECT * FROM utilisateurs;
```

### Voir un utilisateur spécifique

```sql
SELECT * FROM utilisateurs WHERE id = 1;
```

### Compter les utilisateurs

```sql
SELECT COUNT(*) as total FROM utilisateurs;
```

### Supprimer un utilisateur spécifique

```sql
DELETE FROM utilisateurs WHERE id = 5;
```

---

## 📝 Exemples de contenu JSON valide

### Minimal (champs obligatoires seulement)

```json
{
  "email": "user@example.com",
  "nom": "Dupont",
  "prenom": "Jean",
  "role": "USER"
}
```

### Complet (tous les champs)

```json
{
  "email": "user@example.com",
  "nom": "Dupont",
  "prenom": "Jean",
  "telephone": "+33612345678",
  "role": "ADMIN",
  "statut": "ACTIF"
}
```

### Pour PUT (tous les champs optionnels)

```json
{
  "email": "newemail@example.com",
  "telephone": "+33699999999",
  "statut": "INACTIF"
}
```

---

## 🎯 Checkliste de test

- [ ] **GET /api/utilisateurs** - Récupère la liste (200 OK)
- [ ] **POST /api/utilisateurs** - Crée un utilisateur (201 CREATED)
- [ ] **GET /api/utilisateurs/{id}** - Récupère par ID (200 OK)
- [ ] **PUT /api/utilisateurs/{id}** - Met à jour (200 OK)
- [ ] **DELETE /api/utilisateurs/{id}** - Supprime (204 NO CONTENT)
- [ ] **POST duplicate email** - Retourne 409 CONFLICT
- [ ] **POST invalid email** - Retourne 400 BAD REQUEST
- [ ] **GET non-existent ID** - Retourne 404 NOT FOUND
- [ ] **Health check** - /actuator/health retourne UP

---

## 💡 Conseils

1. **Email unique**: Utilisez un timestamp ou Random pour tester POST plusieurs fois
   ```powershell
   $email = "test.$(Get-Random)@example.com"
   ```

2. **Sauvegarder l'ID créé**: Gardez l'ID du POST pour tester PUT/DELETE
   ```powershell
   $userId = ($response.Content | ConvertFrom-Json).id
   ```

3. **Nettoyer la BD avant tests**: Récupérez un ID valide avant PUT/DELETE
   ```sql
   SELECT id FROM utilisateurs LIMIT 1;
   ```

4. **Vérifier les erreurs**: Consultez le contenu de la réponse d'erreur
   ```powershell
   $_.Exception.Response.Content
   ```

5. **Tester avec Postman**: Importez `postman_collection.json` pour interface graphique

---

## 🚀 Démarrer rapidement

```powershell
# 1. Vérifier que le service est up
curl http://localhost:8082/actuator/health

# 2. Créer un utilisateur
$body = @{
    email = "test.$(Get-Random)@example.com"
    nom = "Test"
    prenom = "User"
    role = "USER"
} | ConvertTo-Json
Invoke-WebRequest "http://localhost:8082/api/utilisateurs" -Method POST -Body $body -ContentType "application/json"

# 3. Récupérer tous les utilisateurs
curl http://localhost:8082/api/utilisateurs

# 4. Exécuter les tests complets
powershell -ExecutionPolicy Bypass -File test_api_complete.ps1
```

---

**Dernière mise à jour:** 25 avril 2026
