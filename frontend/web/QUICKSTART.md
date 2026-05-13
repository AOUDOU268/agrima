# 📚 QUICK START GUIDE

## ⚡ Démarrage en 5 minutes

### Étape 1: Installation
```bash
cd frontend/web
npm install
```

### Étape 2: Lancer l'app
```bash
npm start
```

### Étape 3: Accéder à l'app
Ouvrez votre navigateur: **http://localhost:4200**

## 🎯 Première utilisation

### Créer un compte
1. Cliquez sur "👤 Connexion" dans le header
2. Allez à l'onglet "Inscription"
3. Remplissez le formulaire
4. Acceptez les conditions
5. Cliquez "S'inscrire"

### Parcourir les produits
1. Home: Voyez les catégories et produits en vedette
2. Catalogue: Filtrez et triez par vos préférences
3. Détail produit: Découvrez les avis et infos

### Faire une commande
1. Ajoutez des produits au panier
2. Allez au panier (icône 🛒)
3. Cliquez "Passer la commande"
4. Choisissez adresse, livraison, paiement
5. Confirmez la commande

### Suivre une commande
1. Menu "📦 Suivi"
2. Entrez le numéro de commande
3. Voyez l'état du suivi

## 📊 URL Utiles

| Page | URL |
|------|-----|
| Accueil | http://localhost:4200 |
| Catalogue | http://localhost:4200/catalogue |
| Panier | http://localhost:4200/panier |
| Connexion | http://localhost:4200/connexion |
| Profil | http://localhost:4200/profil |
| Suivi | http://localhost:4200/suivi-commande |

## 🛠️ Commandes Utiles

```bash
# Development
npm start              # Lancer le serveur
npm run dev            # Mode développement

# Building
npm run build          # Build production
npm run build:prod     # Build productionoptimisé

# Testing
npm test              # Run tests
npm run test:watch   # Tests en mode watch
npm run test:coverage # Coverage report

# Code Quality
npm run lint          # Run linter
npm run lint:fix      # Fix linter issues
npm run format        # Format code

# Cleanup
npm run clean         # Nettoyer dist/
npm run clean:node    # Supprimer node_modules
```

## 📁 Structure Clé

```
src/app/
├── pages/                    # Pages principales
│   ├── accueil/             # Home
│   ├── catalogue/           # Products listing
│   ├── detail-produit/      # Product detail
│   ├── panier/              # Shopping cart
│   ├── commande/            # Checkout
│   ├── connexion/           # Login/Register
│   ├── profil/              # User profile
│   └── suivi-commande/      # Order tracking
├── services/                 # Business logic
│   ├── produit.service.ts   # Products
│   ├── panier.service.ts    # Cart
│   ├── auth.service.ts      # Auth
│   └── commande.service.ts  # Orders
├── models/index.ts          # Interfaces
└── layouts/                 # Shared layouts
    ├── header/
    └── footer/
```

## 🧪 Données de Test

### Comptes Test
```
Email: test@agrima.com
Mot de passe: Test123!
```

### Produits Exemple
```
1. Tomates Bio - 5.99 EUR
2. Lait fermier - 3.49 EUR
3. Miel artisanal - 12.99 EUR
4. Œufs de poule - 4.99 EUR
```

## 🐛 Troubleshooting

### Port 4200 déjà utilisé
```bash
# Utiliser un autre port
ng serve --port 4300
```

### Module not found
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreurs de cache
```bash
# Clear cache Angular
ng cache clean
# ou
npm run clean
```

### Connexion à l'API
Vérifiez que les services backend sont actifs:
- Product Service: http://localhost:8081
- Order Service: http://localhost:8084
- Auth Service: http://localhost:8083

## 🎨 Personnalisation

### Changer la couleur principale
1. Ouvrez `tailwind.config.js`
2. Modifiez `alibaba-red: '#E82222'`
3. Sauvegardez et l'app se recharge automatiquement

### Ajouter un nouveau produit
1. Ouvrez `src/app/services/produit.service.ts`
2. Ajoutez au tableau `produitsInitiaux`
3. L'app rechargera automatiquement

## 📞 Help & Support

- 📖 [Documentation](./README.md)
- 🧪 [Guide de Test](./TESTING.md)
- 🚀 [Guide de Déploiement](./DEPLOYMENT.md)
- 🤝 [Contribuer](./CONTRIBUTING.md)

## 🎉 Prêt?

Voilà! Vous êtes maintenant prêt à explorer AGRIMA. Amusez-vous! 🌾

---

**Questions?** Consultez la documentation ou ouvrez une issue GitHub.
