# 🌾 AGRIMA - Plateforme E-commerce Agricole
## 📋 Documentation Complète

### 🎯 Aperçu du Projet

AGRIMA est une plateforme e-commerce moderne inspirée d'Alibaba, dédiée à la vente de produits agricoles en ligne. Construite avec:
- **Frontend:** Angular 19 + Tailwind CSS + Angular Material
- **Backend:** Java/Spring Boot microservices
- **Base de données:** PostgreSQL + RabbitMQ

---

## 📂 Structure du Projet

```
agrima/
├── backend/                          # Services Java/Spring Boot
│   ├── product-service/              # Gestion des produits
│   ├── order-service/                # Gestion des commandes
│   ├── payment-service/              # Paiements
│   ├── delivery-service/             # Livraisons
│   ├── auth-service/                 # Authentification
│   ├── notification-service/         # Notifications
│   ├── vendor-service/               # Vendeurs
│   └── gateway/                      # API Gateway
│
└── frontend/
    └── web/                          # Application Angular 19
        ├── src/
        │   ├── app/
        │   │   ├── pages/           # Pages principales
        │   │   ├── layouts/         # En-tête et pied de page
        │   │   ├── services/        # Services métier
        │   │   ├── models/          # Interfaces TypeScript
        │   │   ├── components/      # Composants réutilisables
        │   │   ├── interceptors/    # HTTP interceptors
        │   │   ├── state/           # Gestion d'état
        │   │   ├── app.component.ts # Composant racine
        │   │   ├── app.routes.ts    # Routes
        │   │   └── app.config.ts    # Configuration
        │   ├── environments/        # Configs env
        │   ├── styles.css           # Styles globaux
        │   ├── index.html           # HTML principal
        │   └── main.ts              # Point d'entrée
        ├── angular.json             # Config Angular
        ├── tsconfig.json            # Config TypeScript
        ├── tailwind.config.js       # Config Tailwind
        ├── package.json             # Dépendances npm
        ├── README.md                # Documentation
        ├── QUICKSTART.md            # Démarrage rapide
        ├── TESTING.md               # Guide de test
        ├── DEPLOYMENT.md            # Guide de déploiement
        └── CONTRIBUTING.md          # Guide de contribution
```

---

## 📑 Pages Implémentées

### 1. 🏠 **Accueil** (`/`)
- Bannière promo avec CTA
- Catégories rapides (grille)
- Produits en réduction
- Produits populaires
- Section avantages
- Footer avec liens

**Fichiers:**
- `src/app/pages/accueil/accueil.component.ts`

### 2. 🔍 **Catalogue** (`/catalogue`)
- Barre de recherche en temps réel
- Filtres avancés (catégorie, prix, bio, saison, note)
- Options de tri (pertinence, prix, note, nouveauté)
- Grille de produits responsive
- Pagination

**Fichiers:**
- `src/app/pages/catalogue/catalogue.component.ts`

### 3. 📦 **Détail Produit** (`/produit/:id`)
- Images du produit (galerie)
- Titre avec badges (bio, saison)
- Prix avec réduction
- Sélecteur de quantité
- Infos vendeur
- Section avis clients (5 avis exemple)
- Boutons "Ajouter au panier" et "Favoris"

**Fichiers:**
- `src/app/pages/detail-produit/detail-produit.component.ts`

### 4. 🛒 **Panier** (`/panier`)
- Liste des articles avec images
- Modification des quantités
- Suppression d'articles
- Calculs automatiques:
  - Sous-total
  - Taxes (20%)
  - Total
- Champ code promo
- Bouton "Passer la commande"

**Fichiers:**
- `src/app/pages/panier/panier.component.ts`
- `src/app/services/panier.service.ts`

### 5. 📝 **Commande** (`/commande`)
- Formulaire adresse de livraison
- Sélection mode livraison (Standard/Express/Urgent)
- Sélection méthode paiement (5 options)
- Textarea notes spéciales
- Résumé de commande en sidebar
- Calculs avec frais de livraison
- Bouton "Confirmer"

**Fichiers:**
- `src/app/pages/commande/commande.component.ts`
- `src/app/services/commande.service.ts`

### 6. 🔐 **Connexion/Inscription** (`/connexion`)
- Onglets Connexion/Inscription
- Formulaires avec validation
- Gestion d'erreurs
- Messages de succès
- Redirection après authentification

**Fichiers:**
- `src/app/pages/connexion/connexion.component.ts`
- `src/app/services/auth.service.ts`

### 7. 👤 **Profil Utilisateur** (`/profil`)
- Menu latéral (5 sections)
  - Infos personnelles (éditable)
  - Mes commandes
  - Mes adresses
  - Moyens de paiement
  - Favoris
- Bouton Déconnexion

**Fichiers:**
- `src/app/pages/profil/profil.component.ts`

### 8. 📦 **Suivi de Commande** (`/suivi-commande`)
- Recherche par numéro de commande
- Timeline du suivi (5 étapes)
- Détails livraison et paiement
- Liste articles commandés
- Actions (contact, relancer)

**Fichiers:**
- `src/app/pages/suivi-commande/suivi-commande.component.ts`

---

## 🔧 Services Implémentés

### PanierService (`panier.service.ts`)
```typescript
Méthodes clés:
- ajouterArticle(produit, quantite)
- supprimerArticle(id)
- modifierQuantite(id, quantite)
- obtenirTotal()
- obtenirSousTotal()
- obtenirTaxes()
- clearPanier()

Observables:
- articles$: BehaviorSubject<Article[]>
- total$: Observable<number>
```

### AuthService (`auth.service.ts`)
```typescript
Méthodes clés:
- login(email, password)
- register(userData)
- logout()
- getUtilisateur()
- seConnecter(user)
- seDeconnecter()

Observables:
- utilisateur$: BehaviorSubject<User | null>
```

### ProduitService (`produit.service.ts`)
```typescript
Méthodes clés:
- chargerProduits()
- obtenirParId(id)
- filtrerParCategorie(category)
- rechercherParNom(term)
- obtenirPopulaires()
- obtenirEnReduction()

Observables:
- produits$: BehaviorSubject<Produit[]>
```

### CommandeService (`commande.service.ts`)
```typescript
Méthodes clés:
- creerCommande(commandeData)
- getCommandes()
- getCommande(id)
- updateStatut(id, statut)

Observables:
- commandes$: Observable<Commande[]>
```

### NotificationService (`notification.service.ts`)
```typescript
Méthodes:
- success(message, duration?)
- error(message, duration?)
- warning(message, duration?)
- info(message, duration?)
- remove(id)
```

---

## 📊 Modèles de Données

```typescript
// Produit
{
  id: number
  nom: string
  description: string
  prix: number
  prixOriginal: number
  reduction: number
  categorie: string
  image: string
  vendeur: Vendeur
  note: number
  nombreAvis: number
  stock: number
  unite: string
  estBio: boolean
  estDeSaison: boolean
  dateRecolte: Date
}

// Article (Panier)
{
  id: number
  produitId: number
  nom: string
  prix: number
  quantite: number
  image: string
}

// Commande
{
  id: number
  numero: string
  dateCommande: Date
  statut: string
  montantTotal: number
  fraisLivraison: number
  articles: Article[]
  adresseLivraison: string
  modeLivraison: string
  clientId: number
  producteurId: number
}

// Utilisateur
{
  id: number
  nom: string
  email: string
  telephone: string
  adresse: string
  role: string
}

// Vendeur
{
  id: number
  nom: string
  description: string
  logo: string
  note: number
  nombreEvaluations: number
}
```

---

## 🎨 Design System

### Couleurs
```css
--alibaba-red: #E82222 (Principal)
--white: #FFFFFF
--black: #000000
--gray-50: #F9FAFB
--gray-100: #F3F4F6
--gray-500: #6B7280
--gray-700: #374151
--gray-900: #111828
```

### Typographie
```css
Titres: Font-size 24-48px, Font-weight 700
Sous-titres: Font-size 18-24px, Font-weight 600
Texte: Font-size 14-16px, Font-weight 400
Labels: Font-size 12-14px, Font-weight 500
```

### Espacements (Tailwind)
```
p-2, p-4, p-6, p-8  (Padding)
m-2, m-4, m-6, m-8  (Margin)
gap-4, gap-6, gap-8 (Gap)
```

---

## 📦 Dépendances Principales

```json
{
  "dependencies": {
    "@angular/animations": "^19.0.0",
    "@angular/common": "^19.0.0",
    "@angular/compiler": "^19.0.0",
    "@angular/core": "^19.0.0",
    "@angular/forms": "^19.0.0",
    "@angular/platform-browser": "^19.0.0",
    "@angular/platform-browser-dynamic": "^19.0.0",
    "@angular/router": "^19.0.0",
    "@angular/material": "^19.0.0",
    "tailwindcss": "^3.4.0",
    "rxjs": "^7.8.0",
    "tslib": "^2.6.0",
    "zone.js": "^0.14.0"
  }
}
```

---

## 🚀 Commande npm Disponibles

```bash
# Démarrage
npm start                 # Dev server sur port 4200
npm run dev              # Mode développement

# Building
npm run build            # Build simple
npm run build:prod       # Build production optimisé

# Testing
npm test                # Run tests
npm run test:watch     # Tests en mode watch
npm run test:coverage  # Coverage report

# Code Quality
npm run lint            # Run linter
npm run lint:fix        # Fix linter issues

# Cleanup
npm run clean           # Nettoyer dist/
npm run clean:node      # Supprimer node_modules
```

---

## 📞 Support & Documentation

| Document | Lien |
|----------|------|
| Quick Start | [QUICKSTART.md](./QUICKSTART.md) |
| README Principal | [README.md](./README.md) |
| Testing Guide | [TESTING.md](./TESTING.md) |
| Deployment Guide | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| Contributing Guide | [CONTRIBUTING.md](./CONTRIBUTING.md) |

---

## ✅ Checklist de Configuration

- [ ] `npm install` - Dépendances instalées
- [ ] `npm start` - Serveur lancé sur port 4200
- [ ] Accueil page chargée
- [ ] Catalogue fonctionnelle
- [ ] Panier stocke les items
- [ ] Authentification mock fonctionnelle
- [ ] Profil utilisateur accessible
- [ ] Tous les liens de navigation actifs

---

## 🎯 Prochaines Étapes

1. **Installation Backend**
   ```bash
   cd backend
   mvn clean install
   ```

2. **Démarrer les Services**
   ```bash
   # Product Service sur 8081
   # Order Service sur 8084
   # Auth Service sur 8083
   # Gateway sur 8080
   ```

3. **Intégration API**
   - Remplacer les URLs mock dans les services
   - Configurer les interceptors
   - Tester l'intégration

4. **Déploiement**
   - Voir [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📝 Notes Importantes

- **Tous les attributs sont en français** comme demandé
- **Composants standalone** - Architecture moderne Angular 19
- **RxJS Observables** - Gestion d'état réactive
- **Tailwind CSS** - Styling utilitaire responsive
- **localStorage** - Persistence du panier
- **Mock data** - Services retournent des données fictives pour le test

---

## 🔐 Sécurité

- Mots de passe masqués en inputs
- Tokens stockés (actuellement en localStorage - à migrer en httpOnly cookies)
- CSRF protection (à implémenter)
- Validations côté client et backend recommandées

---

## 🎉 Prêt à Commencer?

1. Exécutez: `npm install`
2. Lancez: `npm start`
3. Ouvrez: http://localhost:4200
4. Explorez la plateforme!

Consultez [QUICKSTART.md](./QUICKSTART.md) pour un guide pas à pas.

---

**Développé avec ❤️ pour AGRIMA**  
*Plateforme E-commerce Agricole - Made with Angular 19*
