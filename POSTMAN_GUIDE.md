# Guide Postman - Tests Order Service

## 🚀 Démarrage Rapide

### 1. Importer la Collection
1. Ouvrir Postman
2. Cliquer sur **Import** (en haut à gauche)
3. Sélectionner le fichier `ORDER_SERVICE_POSTMAN_COLLECTION.json`
4. La collection "Order Service API Gateway Tests" apparaît

### 2. Configuration de l'Environnement (Optionnel)

Créer un environnement Postman avec variables:
```
BASE_URL: http://127.0.0.1:8080
API_VERSION: v1
SERVICE: order
```

Puis utiliser dans les requêtes:
```
{{BASE_URL}}/api/{{SERVICE}}s
```

---

## 📊 Tests Disponibles

### Test 1: GET - List All Orders
**Endpoint**: `GET http://127.0.0.1:8080/api/orders`  
**Description**: Récupère toutes les commandes existantes  
**Status Attendu**: 200 OK  
**Utilité**: 
- Vérifier que la gateway fonctionne
- Voir le nombre et le contenu des commandes
- Valider la structure des données

**Exemple de Réponse**:
```json
[
  {
    "id": 1,
    "numero": "cmd202",
    "statut": "PENDING",
    "clientId": null,
    "producteurId": null,
    "adresseLivraison": null,
    "modeLivraison": null,
    "montantTotal": null,
    "fraisLivraison": null,
    "dateCommande": null,
    "dateLivraisonEstimee": null,
    "paiementId": null,
    "livraisonId": null,
    "lignes": []
  }
]
```

---

### Test 2: POST - Create New Order
**Endpoint**: `POST http://127.0.0.1:8080/api/orders`  
**Description**: Crée une nouvelle commande  
**Status Attendu**: 200 OK  
**Body**:
```json
{
  "numero": "ORD-2025-NEW",
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

**Utilité**:
- Tester la création de données
- Vérifier la persistance en base de données
- Valider les règles de validation

**Points à Modifier**:
- `numero`: Utiliser un numéro unique à chaque test
- `clientId`, `producteurId`: IDs valides
- `montantTotal`, `fraisLivraison`: Valeurs testées
- `adresseLivraison`: Adresse de test

**Post-Test**:
- Copier l'ID retourné pour les tests suivants
- Vérifier avec le Test 1 que la commande a été créée

---

### Test 3: GET - Get Order By ID
**Endpoint**: `GET http://127.0.0.1:8080/api/orders/{id}`  
**Description**: Récupère une commande spécifique  
**Status Attendu**: 200 OK (ou 500 ERROR actuellement)  
**⚠️ STATUT ACTUEL**: ERREUR 500  

**Comment Tester**:
1. Exécuter d'abord le Test 2 (création)
2. Copier l'ID retourné (ex: 17)
3. Remplacer `1` par cet ID dans l'URL
4. Exécuter

**URL d'Exemple**:
```
http://127.0.0.1:8080/api/orders/17
```

**Utilité**:
- Récupérer les détails d'une commande spécifique
- Vérifier les données persistées

---

### Test 4: PUT - Update Order
**Endpoint**: `PUT http://127.0.0.1:8080/api/orders/{id}`  
**Description**: Met à jour une commande existante  
**Status Attendu**: 200 OK (ou 500 ERROR actuellement)  
**⚠️ STATUT ACTUEL**: ERREUR 500  

**Body**:
```json
{
  "numero": "ORD-2025-UPDATE",
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

**Comment Tester**:
1. Exécuter Test 2 pour créer une commande
2. Copier l'ID retourné
3. Remplacer `1` par cet ID
4. Modifier les données du body
5. Exécuter

**Points à Modifier**:
- Changer l'adresse, le mode de livraison, le montant
- Vérifier que les modifications sont appliquées

---

### Test 5: DELETE - Delete Order
**Endpoint**: `DELETE http://127.0.0.1:8080/api/orders/{id}`  
**Description**: Supprime une commande  
**Status Attendu**: 204 No Content (ou 500 ERROR actuellement)  
**⚠️ STATUT ACTUEL**: ERREUR 500  

**Comment Tester**:
1. Exécuter Test 2 deux fois (pour créer 2 commandes)
2. Utiliser l'ID de la deuxième pour la suppression
3. Remplacer `1` par cet ID
4. Exécuter

**Verification Post-Delete**:
- Exécuter Test 3 avec l'ID supprimé
- Devrait retourner 404 ou erreur

---

### Test 6: GET - Invalid Order ID
**Endpoint**: `GET http://127.0.0.1:8080/api/orders/999999`  
**Description**: Tente de récupérer une commande inexistante  
**Status Attendu**: 404 Not Found (ou erreur)  
**Status Actuel**: ✅ CORRECT - Retourne une erreur

**Utilité**:
- Vérifier la gestion des erreurs
- S'assurer que le système ne retourne pas de fausses données

---

## 🔄 Workflow de Test Recommandé

### Scénario 1: Test Complet (Pas d'Erreurs)
```
1. GET List All Orders
2. POST Create Order 1
3. GET List All Orders (vérifier qu'elle est créée)
4. POST Create Order 2
5. GET Order by ID (Test Order 2)
6. PUT Update Order 2
7. GET Order by ID (vérifier la modification)
8. DELETE Order 1
9. GET List All Orders (vérifier la suppression)
```

### Scénario 2: Cycle CRUD Simple
```
1. POST Create → Copier l'ID
2. GET by ID → Vérifier les données
3. PUT Update → Modifier les données
4. GET by ID → Confirmer les modifications
5. DELETE → Supprimer
6. GET by ID → Confirmer la suppression (404)
```

### Scénario 3: Test d'Erreurs
```
1. GET /api/orders/999999 → Devrait retourner 404
2. GET /api/orders/abc → Devrait retourner erreur
3. POST avec données invalides → Devrait valider
```

---

## 💡 Conseils d'Utilisation Postman

### 1. Utiliser les Scripts de Test
Ajouter des tests dans l'onglet "Tests":
```javascript
pm.test("Status code is 200", function() {
    pm.response.to.have.status(200);
});

pm.test("Response has id", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
});
```

### 2. Pré-requête (Pre-request Script)
Utiliser pour générer des données dynamiques:
```javascript
pm.environment.set("current_time", new Date().toISOString());
pm.environment.set("order_number", "ORD-" + Math.random().toString(36).substr(2, 9));
```

### 3. Utiliser des Variables d'Environnement
Créer un environnement "Development":
```
BASE_URL: http://127.0.0.1:8080
ORDER_ID: (à mettre à jour manuellement)
```

Puis utiliser dans les requêtes:
```
{{BASE_URL}}/api/orders/{{ORDER_ID}}
```

### 4. Runner pour Exécuter en Batch
- Cliquer sur "Runner" (ou Collection Runner)
- Sélectionner la collection
- Cliquer "Run" pour exécuter tous les tests

---

## 🐛 Dépannage

### Erreur: Connection refused
**Cause**: Gateway ou service not started  
**Solution**:
```bash
# Vérifier que la gateway est active
curl http://127.0.0.1:8080/api/orders

# Vérifier le service directement
curl http://127.0.0.1:8084/api/orders
```

### Erreur: 500 Internal Server Error
**Cause**: Voir le rapport ORDER_SERVICE_TEST_REPORT.md  
**Problèmes Connus**:
- GET /api/orders/{id} - Erreur 500
- PUT /api/orders/{id} - Erreur 500
- DELETE /api/orders/{id} - Erreur 500

### Erreur: 404 Not Found
**Cause**: Endpoint n'existe pas  
**Vérifier**:
- L'URL est correcte
- La gateway route correctement vers le service

### Timeout
**Cause**: Service trop lent ou pas de réponse  
**Solution**:
- Augmenter le timeout dans Postman
- Cliquer Settings → Général → "Decrease request timeout"

---

## 📋 Checklist de Test

- [ ] Test 1: List All Orders - PASS
- [ ] Test 2: Create Order - PASS
- [ ] Test 3: Get Order by ID - (ERROR 500)
- [ ] Test 4: Update Order - (ERROR 500)
- [ ] Test 5: Delete Order - (ERROR 500)
- [ ] Test 6: Invalid ID - PASS

---

## 📞 Support

Pour plus d'informations:
- Voir `ORDER_SERVICE_TEST_REPORT.md` pour le rapport détaillé
- Voir `test_order_service.ps1` pour le script PowerShell
- Vérifier les logs du service order-service pour les erreurs 500

---

**Dernière mise à jour**: 17 Mai 2026
