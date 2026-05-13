# 🧪 Guide de Test - AGRIMA

Bienvenue dans le guide de test pour la plateforme AGRIMA. Ce document vous aidera à valider toutes les fonctionnalités de l'application.

## 📋 Checklist de Test

### 1. 🏠 Page d'Accueil (Home)
- [ ] Bannière promo visible
- [ ] Catégories affichées correctement
- [ ] Produits en réduction chargés
- [ ] Produits populaires affichés
- [ ] Section avantages visible
- [ ] Footer affiche correctement

### 2. 🔍 Catalogue
#### Recherche
- [ ] Barre de recherche fonctionne
- [ ] Les résultats se filtrent en temps réel
- [ ] Les produits s'affichent en grille

#### Filtres
- [ ] Filtre par catégorie
- [ ] Filtre par gamme de prix
- [ ] Filtre "Bio"
- [ ] Filtre "De saison"
- [ ] Filtre par note (rating)

#### Tri
- [ ] Tri par pertinence
- [ ] Tri par prix croissant
- [ ] Tri par prix décroissant
- [ ] Tri par note
- [ ] Tri par nouveauté

### 3. 📦 Détails Produit
- [ ] Page charge correctement
- [ ] Images du produit visibles
- [ ] Prix et prix original affichés
- [ ] Pourcentage de réduction calculé
- [ ] Badge "Bio" visible si applicable
- [ ] Infos vendeur affichées
- [ ] Section avis clients visible
- [ ] Bouton "Ajouter au panier" fonctionne
- [ ] Sélecteur de quantité fonctionne
- [ ] Bouton "Ajouter aux favoris" (placeholder)

### 4. 🛒 Panier
- [ ] Les articles s'ajoutent correctement
- [ ] La quantité peut être modifiée
- [ ] Les articles peuvent être supprimés
- [ ] Sous-total calculé correctement
- [ ] Taxes (20%) calculées correctement
- [ ] Total global calculé correctement
- [ ] Le badge panier dans le header se met à jour
- [ ] Le panier persiste (localStorage)
- [ ] Bouton "Commander" navigue vers checkout

### 5. 📝 Page de Commande (Checkout)
- [ ] Formule adresse fonctionne
- [ ] Sélection mode livraison fonctionne
  - [ ] Standard (5 EUR)
  - [ ] Express (10 EUR)
  - [ ] Urgent (20 EUR)
- [ ] Sélection méthode paiement fonctionne
  - [ ] Carte bancaire
  - [ ] Virement bancaire
  - [ ] Portefeuille électronique
  - [ ] Paiement à la livraison
  - [ ] Apple Pay
- [ ] Textarea notes fonctionne
- [ ] Résumé commande s'affiche
- [ ] Total recalculé avec frais de livraison
- [ ] Bouton "Confirmer" fonctionne

### 6. 👤 Authentification
#### Connexion
- [ ] Page connexion s'affiche correctement
- [ ] Formulaire de connexion valide les champs
- [ ] Message d'erreur s'affiche (credentials invalides)
- [ ] Message de succès s'affiche
- [ ] Redirection vers accueil après connexion

#### Inscription
- [ ] Page inscription s'affiche correctement
- [ ] Tous les champs sont visibles
- [ ] Validation des champs fonctionne
- [ ] Vérification mot de passe fonctionne
- [ ] Message d'acceptation conditions
- [ ] Inscription réussit
- [ ] Redirection vers accueil

### 7. 👤 Profil Utilisateur
- [ ] Page se charge correctement
- [ ] Onglet Infos personnelles fonctionne
- [ ] Les infos peuvent être modifiées
- [ ] Onglet Commandes affiche les commandes
- [ ] Onglet Adresses fonctionne
- [ ] Onglet Moyens de paiement fonctionne
- [ ] Onglet Favoris fonctionne
- [ ] Bouton "Déconnexion" fonctionne
- [ ] L'utilisateur est déconnecté et redirigé

### 8. 📦 Suivi de Commande
- [ ] Page de suivi s'affiche
- [ ] Recherche par numéro fonctionne
- [ ] Timeline du suivi s'affiche
- [ ] Statuts des étapes visibles
- [ ] Détails de livraison affichés
- [ ] Infos de paiement affichées
- [ ] Articles commandés listés

### 9. 🎨 Design & UX
- [ ] Couleurs Alibaba-red cohérentes
- [ ] Layout responsive (mobile/desktop)
- [ ] Images chargent rapidement
- [ ] Pas de texte coupé
- [ ] Icônes emoji affichent correctement
- [ ] Transitions fluides
- [ ] Espacements cohérents

### 10. 🔧 Fonctionnalités Techniques
- [ ] Pas d'erreurs console
- [ ] Pas de warnings Angular
- [ ] localStorage fonctionne
- [ ] Observables RxJS fonctionnent
- [ ] Navigation router fonctionne
- [ ] Imports modulaires corrects
- [ ] Composants standalone chargent correctement

### 11. 🔐 Sécurité & Accessibilité
- [ ] Mots de passe masqués en input password
- [ ] Forms et inputs accessibles
- [ ] Contraste des couleurs suffisant
- [ ] ARIA labels sur les boutons (si applicable)

### 12. 📱 Responsive Design
#### Mobile (375px)
- [ ] Header responsive
- [ ] Navigation mobile (si applicable)
- [ ] Grille produits 1 col
- [ ] Formulaires adaptés

#### Tablet (768px)
- [ ] Grille produits 2-3 cols
- [ ] Sidebar filtres affichée
- [ ] Layout fluide

#### Desktop (1920px)
- [ ] Grille produits 4+ cols
- [ ] Tous les éléments visibles
- [ ] Espaces appropriés

## 🧮 Calculs à Vérifier

### Exemple 1: Produit Simple
```
Produit: 100 EUR
Quantité: 2
Sous-total: 200 EUR
Taxes (20%): 40 EUR
Mode livraison: Express (10 EUR)
TOTAL: 250 EUR
```

### Exemple 2: Avec Réduction
```
Prix original: 100 EUR
Réduction: -20%
Prix final: 80 EUR
Quantité: 3
Sous-total: 240 EUR
Taxes (20%): 48 EUR
Mode livraison: Standard (5 EUR)
TOTAL: 293 EUR
```

## 📊 Données de Test

### Utilisateurs de Test
```
Email: test@agrima.com
Mot de passe: Test123!

Email: user@example.com
Mot de passe: User123!
```

### Numéros de Commande
```
CMD-001
CMD-002
CMD-003
CMD-004
CMD-005
```

### Adresses de Livraison
```
123 Rue de la Paix, 75000 Paris, France
45 Avenue de la République, 13000 Marseille, France
```

## 🐛 Rapport de Bugs

Lors de la découverte de bugs:

1. Note le titre du bug
2. Décris les étapes pour reproduire
3. Décris le comportement attendu
4. Décris le comportement réel
5. Prends une capture d'écran si applicable
6. Note la version du navigateur

### Template de Bug Report
```
**Titre:** [Type] Description du bug

**Étapes pour reproduire:**
1. ...
2. ...
3. ...

**Comportement attendu:**
...

**Comportement réel:**
...

**Navigateur/OS:**
Chrome 120 / Windows 11

**Capture d'écran:**
[Insérer ici]
```

## ✅ Conclusion du Test

Après avoir testé tous les points:

- [ ] Tous les tests passent
- [ ] Pas de bugs critiques
- [ ] Performance acceptable
- [ ] Design approuvé
- [ ] Ready for production

---

**Tester:** _______________________  
**Date:** _______________________  
**Signature:** _______________________
