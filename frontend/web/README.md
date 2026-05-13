# AGRIMA - Plateforme E-commerce Agricole

Plateforme e-commerce moderne inspirée d'Alibaba pour la vente de produits agricoles locaux.

## 🎯 Fonctionnalités

- ✅ **Catalogue de produits** avec recherche et filtrage avancé
- ✅ **Gestion des catégories** avec sous-catégories
- ✅ **Fiche produit détaillée** avec images, avis, vendeur
- ✅ **Panier dynamique** avec calcul automatique des totaux
- ✅ **Système de commande** avec adresse de livraison et modes de paiement
- ✅ **Avis clients** avec note et vérification d'achat
- ✅ **Système de réduction** et codes promo
- ✅ **Interface responsive** Tailwind CSS + Angular Material
- ✅ **Tous les attributs en français** (noms, libellés, messages)

## 🛠️ Technologies

- **Frontend Framework**: Angular 19
- **Styling**: Tailwind CSS 3
- **UI Library**: Angular Material 19
- **State Management**: RxJS
- **Language**: TypeScript 5.6

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm start

# Accéder à l'application
http://localhost:4200
```

## 📁 Structure du Projet

```
src/
├── app/
│   ├── layouts/
│   │   ├── header/              # En-tête avec navigation et panier
│   │   └── footer/              # Pied de page
│   ├── pages/
│   │   ├── accueil/             # Page d'accueil
│   │   ├── catalogue/           # Catalogue de produits
│   │   ├── detail-produit/      # Détail produit
│   │   ├── panier/              # Gestion du panier
│   │   └── commande/            # Passage de commande
│   ├── services/
│   │   ├── produit.service.ts   # Gestion des produits
│   │   ├── panier.service.ts    # Gestion du panier
│   │   ├── commande.service.ts  # Gestion des commandes
│   │   └── auth.service.ts      # Authentification
│   ├── models/
│   │   └── index.ts             # Interfaces et types
│   ├── app.component.ts         # Composant racine
│   └── app.routes.ts            # Routes
├── styles.css                   # Styles globaux
├── index.html                   # Page HTML principale
└── main.ts                      # Point d'entrée
```

## 🎨 Attributs en Français

Tous les attributs de la plateforme sont en français :

```typescript
// Produit
interface Produit {
  nom: string;
  description: string;
  prix: number;
  categorie: string;
  vendeur: string;
  ...
}

// Panier
interface Article {
  nom: string;
  quantite: number;
  prix: number;
  ...
}

// Commande
interface Commande {
  numero: string;
  dateCommande: Date;
  adresseLivraison: string;
  modeLivraison: string;
  ...
}
```

## 🔗 Intégration Backend

L'application est configurée pour se connecter à :

- **Product Service**: `http://localhost:8081`
- **Order Service**: `http://localhost:8084`
- **Auth Service**: `http://localhost:8083`

Modifiez les URLs dans les fichiers `services/` si vos services tournent sur d'autres ports.

## 📱 Pages Principales

### Accueil
- Bannière promo
- Catégories rapides
- Produits en réduction
- Produits populaires

### Catalogue
- Filtrage avancé (catégorie, prix, bio, saison)
- Recherche en temps réel
- Tri (pertinence, prix, note)
- Grille de produits responsive

### Détail Produit
- Images du produit
- Informations complètes
- Avis clients avec vérification d'achat
- Infos vendeur
- Ajout au panier

### Panier
- Liste des articles
- Modification des quantités
- Calcul automatique des totaux
- Supprimer articles

### Commande
- Adresse de livraison
- Modes de livraison (Standard, Express, Urgente)
- Méthodes de paiement
- Résumé complet

## 🎯 Fonctionnalités Futures

- [ ] Système d'authentification complet
- [ ] Compte utilisateur et historique commandes
- [ ] Favoris/wishlist
- [ ] Comparateur de produits
- [ ] Live chat vendeur
- [ ] Notifications en temps réel
- [ ] Intégration paiement

## 📝 Notes

- Les données de produits sont actuellement fictives (en mémoire)
- Le panier est stocké dans `localStorage`
- L'authentification est simulée

## 🤝 Support

Pour toute question ou problème, consultez la documentation ou contactez le support.

---

**Développé avec ❤️ sur Angular 19**
