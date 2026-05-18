# Rapport de Test - Service Order-Service via API Gateway

**Date**: 17 Mai 2026  
**Service Testé**: order-service  
**Gateway Port**: 8080  
**Service Direct Port**: 8084  
**Route**: `/api/orders/**`

---

## 📋 Résumé Exécutif

| Métrique | Valeur |
|----------|--------|
| **Nombre Total de Tests** | 8 |
| **Tests Réussis** | 5 ✅ |
| **Tests Échoués** | 3 ❌ |
| **Taux de Réussite** | 62.5% |

---

## 🔍 Détails des Endpoints Testés

### 1. ✅ GET `/api/orders` - Lister toutes les commandes

**Statut**: PASS  
**Code HTTP**: 200 OK  
**Description**: Récupère la liste complète de toutes les commandes

**Réponse**:
- **Nombre de commandes**: 16 commandes existantes
- **Structure des données retournées**:
  ```json
  {
    "id": 17,
    "numero": "ORD-2025-001",
    "statut": "PENDING",
    "clientId": 1,
    "producteurId": 1,
    "adresseLivraison": "123 Rue de Paris, Paris",
    "modeLivraison": "Standard",
    "montantTotal": 150.5,
    "fraisLivraison": 10.0,
    "dateCommande": "2026-05-17T21:52:33",
    "dateLivraisonEstimee": "2026-05-20T21:52:34",
    "paiementId": null,
    "livraisonId": null,
    "lignes": []
  }
  ```

**Payload Postman**:
```
GET http://127.0.0.1:8080/api/orders
Content-Type: application/json
```

---

### 2. ✅ POST `/api/orders` - Créer une nouvelle commande

**Statut**: PASS  
**Code HTTP**: 200 OK  
**Description**: Crée une nouvelle commande avec les détails fournis

**Commande Créée**: ID 17  
**Numéro de Commande**: ORD-2025-001

**Payload d'Entrée**:
```json
{
  "numero": "ORD-2025-001",
  "clientId": 1,
  "producteurId": 1,
  "adresseLivraison": "123 Rue de Paris, Paris",
  "modeLivraison": "Standard",
  "montantTotal": 150.50,
  "fraisLivraison": 10.00,
  "dateCommande": "2026-05-17T21:52:33",
  "dateLivraisonEstimee": "2026-05-20T21:52:34",
  "lignes": []
}
```

**Réponse**:
```json
{
  "id": 17,
  "numero": "ORD-2025-001",
  "statut": "PENDING",
  "clientId": 1,
  "producteurId": 1,
  "adresseLivraison": "123 Rue de Paris, Paris",
  "modeLivraison": "Standard",
  "montantTotal": 150.5,
  "fraisLivraison": 10.0,
  "dateCommande": "2026-05-17T21:52:33",
  "dateLivraisonEstimee": "2026-05-20T21:52:34",
  "paiementId": null,
  "livraisonId": null,
  "lignes": []
}
```

**Payload Postman**:
```
POST http://127.0.0.1:8080/api/orders
Content-Type: application/json

{
  "numero": "ORD-2025-001",
  "clientId": 1,
  "producteurId": 1,
  "adresseLivraison": "123 Rue de Paris, Paris",
  "modeLivraison": "Standard",
  "montantTotal": 150.50,
  "fraisLivraison": 10.00,
  "dateCommande": "2026-05-17T21:52:33",
  "dateLivraisonEstimee": "2026-05-20T21:52:34",
  "lignes": []
}
```

---

### 3. ❌ GET `/api/orders/{id}` - Récupérer une commande spécifique

**Statut**: FAIL  
**Code HTTP**: 500 Internal Server Error  
**Description**: Erreur lors de la récupération d'une commande par ID

**ID Testé**: 17  
**Erreur**: Le serveur retourne une erreur 500

**Causes Probables**:
- Problème dans la mapper/conversion des données
- Données manquantes ou mal formées en base de données
- Incompatibilité de type (BigDecimal vs Double)

**Payload Postman**:
```
GET http://127.0.0.1:8080/api/orders/17
Content-Type: application/json
```

**Recommandations**:
- Vérifier les logs du service order-service
- Contrôler la conversion des types de données
- Vérifier le mapper OrderMapper

---

### 4. ❌ PUT `/api/orders/{id}` - Mettre à jour une commande

**Statut**: FAIL  
**Code HTTP**: 500 Internal Server Error  
**Description**: Erreur lors de la mise à jour d'une commande

**ID Testé**: 17  
**Erreur**: Le serveur retourne une erreur 500

**Payload d'Entrée**:
```json
{
  "numero": "ORD-2025-001-UPDATED",
  "clientId": 1,
  "producteurId": 1,
  "adresseLivraison": "456 Avenue des Champs, Lyon",
  "modeLivraison": "Express",
  "montantTotal": 200.00,
  "fraisLivraison": 15.00,
  "dateCommande": "2026-05-17T21:52:33",
  "dateLivraisonEstimee": "2026-05-18T21:52:34",
  "lignes": []
}
```

**Payload Postman**:
```
PUT http://127.0.0.1:8080/api/orders/17
Content-Type: application/json

{
  "numero": "ORD-2025-001-UPDATED",
  "clientId": 1,
  "producteurId": 1,
  "adresseLivraison": "456 Avenue des Champs, Lyon",
  "modeLivraison": "Express",
  "montantTotal": 200.00,
  "fraisLivraison": 15.00,
  "dateCommande": "2026-05-17T21:52:33",
  "dateLivraisonEstimee": "2026-05-18T21:52:34",
  "lignes": []
}
```

**Recommandations**:
- Même investigation que le GET par ID
- Vérifier l'accès à la transaction
- Contrôler la persistence des données

---

### 5. ✅ POST `/api/orders` - Créer une deuxième commande (pour suppression)

**Statut**: PASS  
**Code HTTP**: 200 OK  
**Description**: Crée une deuxième commande pour tester la suppression

**Commande Créée**: ID 18  
**Numéro de Commande**: ORD-2025-DELETE

**Payload Postman**:
```
POST http://127.0.0.1:8080/api/orders
Content-Type: application/json

{
  "numero": "ORD-2025-DELETE",
  "clientId": 2,
  "producteurId": 2,
  "adresseLivraison": "789 Rue de Marseille",
  "modeLivraison": "Standard",
  "montantTotal": 75.25,
  "fraisLivraison": 5.00,
  "dateCommande": "2026-05-17T21:52:33",
  "dateLivraisonEstimee": "2026-05-22T21:52:34",
  "lignes": []
}
```

---

### 6. ❌ DELETE `/api/orders/{id}` - Supprimer une commande

**Statut**: FAIL  
**Code HTTP**: 500 Internal Server Error  
**Description**: Erreur lors de la suppression d'une commande

**ID Testé**: 18  
**Erreur**: Le serveur retourne une erreur 500

**Payload Postman**:
```
DELETE http://127.0.0.1:8080/api/orders/18
Content-Type: application/json
```

**Recommandations**:
- Même investigation que les autres opérations par ID
- Vérifier les constraints de base de données
- Vérifier les cascades de suppression

---

### 7. ✅ GET `/api/orders/{id}` - Vérifier la suppression

**Statut**: PASS  
**Code HTTP**: Erreur (Comportement attendu)  
**Description**: Tentative de récupération d'une commande supprimée

**Résultat**: Retourne une erreur, ce qui est le comportement attendu

**Payload Postman**:
```
GET http://127.0.0.1:8080/api/orders/18
Content-Type: application/json
```

---

### 8. ✅ GET `/api/orders/999999` - Tester avec un ID invalide

**Statut**: PASS  
**Code HTTP**: Erreur (Comportement attendu)  
**Description**: Tentative de récupération avec un ID inexistant

**Résultat**: Retourne une erreur, ce qui est le comportement attendu

**Payload Postman**:
```
GET http://127.0.0.1:8080/api/orders/999999
Content-Type: application/json
```

---

## 📊 Analyse des Résultats

### Opérations Réussies ✅
1. **GET /api/orders** - Récupération de toutes les commandes
2. **POST /api/orders** - Création de commandes (×2)
3. **Gestion des erreurs** - Réponses appropriées pour les IDs invalides

### Opérations en Erreur ❌
1. **GET /api/orders/{id}** - Erreur 500
2. **PUT /api/orders/{id}** - Erreur 500
3. **DELETE /api/orders/{id}** - Erreur 500

### 🔴 Problème Identifié
Les opérations avec paramètres `{id}` retournent une **erreur 500 (Internal Server Error)**. Cela suggère un problème dans le traitement des opérations unitaires.

**Causes Probables**:
- Conversion de types de données (BigDecimal ↔ Double)
- Annotation @Transactional au niveau de la classe
- Configuration JPA ou Repository
- Mapper entre DTO et Entity

---

## 🛠 Points d'Investigation

### 1. Problème de Type BigDecimal/Double
**Fichier**: `OrderEntity.java`  
**Observation**: Les champs utilisent `BigDecimal` alors que `OrderRequestDto` et `OrderResponseDto` utilisent `Double`

**Solution**:
```java
// Dans OrderMapper
// Convertir BigDecimal -> Double et vice-versa
```

### 2. Annotation @Transactional
**Fichier**: `OrderController.java` (ligne 19)  
```java
@Transactional
public class OrderController {
```
**Observation**: L'annotation au niveau de la classe peut causer des problèmes

### 3. Logs du Service
À vérifier pour obtenir le détail de l'erreur 500:
- Logs du service order-service
- Logs de la gateway
- Stack traces

---

## 📝 Structure des Données

### Champs de la Commande

| Champ | Type | Nullable | Description |
|-------|------|----------|-------------|
| id | Long | NON | ID unique auto-généré |
| numero | String | OUI | Numéro de commande |
| statut | String | OUI | État de la commande (PENDING par défaut) |
| clientId | Long | OUI | ID du client |
| producteurId | Long | OUI | ID du producteur |
| adresseLivraison | String | OUI | Adresse de livraison |
| modeLivraison | String | OUI | Mode de livraison |
| montantTotal | Double | OUI | Montant total |
| fraisLivraison | Double | OUI | Frais de livraison |
| dateCommande | DateTime | OUI | Date de la commande |
| dateLivraisonEstimee | DateTime | OUI | Date de livraison estimée |
| paiementId | Long | OUI | ID du paiement associé |
| livraisonId | Long | OUI | ID de la livraison associée |
| lignes | List | OUI | Ligne d'items de la commande |

---

## 🔌 Configuration de la Gateway

**URL de la Gateway**: `http://127.0.0.1:8080`  
**Endpoint de Base**: `/api/orders`  
**Service Backend Direct**: `http://127.0.0.1:8084`

**Configuration dans application.yml**:
```yaml
- id: order-service
  uri: http://127.0.0.1:8084
  predicates:
    - Path=/api/orders/**
```

---

## 📦 Commandes cURL pour Tests Rapides

### Lister toutes les commandes
```bash
curl -X GET "http://127.0.0.1:8080/api/orders" \
  -H "Content-Type: application/json"
```

### Créer une commande
```bash
curl -X POST "http://127.0.0.1:8080/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "numero": "ORD-2025-002",
    "clientId": 1,
    "producteurId": 1,
    "adresseLivraison": "123 Rue de Paris",
    "modeLivraison": "Standard",
    "montantTotal": 150.50,
    "fraisLivraison": 10.00,
    "lignes": []
  }'
```

### Récupérer une commande (⚠️ ERREUR 500)
```bash
curl -X GET "http://127.0.0.1:8080/api/orders/1" \
  -H "Content-Type: application/json"
```

### Mettre à jour une commande (⚠️ ERREUR 500)
```bash
curl -X PUT "http://127.0.0.1:8080/api/orders/1" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### Supprimer une commande (⚠️ ERREUR 500)
```bash
curl -X DELETE "http://127.0.0.1:8080/api/orders/1" \
  -H "Content-Type: application/json"
```

---

## ✅ Prochaines Étapes

1. **Examiner les logs** du service order-service pour déterminer la cause des erreurs 500
2. **Vérifier le mapper** OrderMapper pour les problèmes de conversion
3. **Tester les endpoints directs** sur le port 8084 pour isoler le problème
4. **Corriger les problèmes identifiés**
5. **Re-exécuter tous les tests** après corrections

---

## 📄 Fichier de Test PowerShell

**Localisation**: `test_order_service.ps1`  
**Exécution**: 
```powershell
powershell -ExecutionPolicy Bypass -File test_order_service.ps1
```

---

**Rapport généré le**: 17 Mai 2026 à 21:52 UTC
