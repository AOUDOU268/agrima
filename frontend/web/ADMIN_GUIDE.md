# Interface Administrateur - Guide Complet

## 📋 Vue d'ensemble

L'interface administrateur (Admin Dashboard) permet de gérer l'ensemble des profils utilisateurs sur la plateforme AGRIMA. Elle offre des fonctionnalités de gestion, modération et analytics pour les profils suivants:

- **Consommateurs**: Acheteurs de produits agricoles
- **Producteurs**: Vendeurs de produits
- **Livreurs**: Prestataires de livraison
- **Modérateurs**: Équipe de support/modération

---

## 🎯 Fonctionnalités principales

### 1. **Vue d'ensemble (Overview)**
- Affichage du nombre total de profils
- Compteur des actions urgentes
- Statistiques en temps réel:
  - Comptes actifs
  - Vérifications en cours (KYC)
  - Profils suspendus
  - Score de confiance moyen

### 2. **Liste des profils**
- Affichage tabulaire de tous les profils
- Filtrage par rôle (consommateur, producteur, livreur, modérateur)
- Filtrage par statut (Actif, En attente, Suspendu)
- Affichage des indicateurs de risque
- Actions rapides (Voir détails, Éditer)

### 3. **Gestion des détails**
- Fiche profil détaillée du profil sélectionné
- Affichage des informations clés:
  - Téléphone
  - Score de confiance
  - Niveau de risque (Faible/Modéré/Élevé)
  - Statut
  - Localisation

### 4. **Centre de modération**
Onglet dédié pour les actions de modération:

#### Actions disponibles:
- **✓ Valider le profil**: Approuver un compte en attente
- **⏸ Suspendre temporairement**: Mettre en suspension temporaire avec durée personnalisée
- **↻ Réactiver le profil**: Restaurer un compte suspendu
- **⚠ Avertissement**: Envoyer un avertissement avec détails
- **✉ Contacter ce profil**: Envoyer un message au compte
- **🚫 Bloquer définitivement**: Blocage permanent (irréversible)

#### Historique des actions:
- Log complet de toutes les actions effectuées
- Statut de chaque action (Effectuée, En attente, Rejetée)
- Dates et raisons

### 5. **Tableau de bord analytique**
Onglet statistiques avec:
- Distribution par rôle (graphiques)
- Distribution des scores de confiance
- Bandes de confiance (Excellent/Bon/Moyen/Faible)
- Score moyen global
- Liste des actions prioritaires du jour

---

## 🛠️ Workflow type de modération

### Étape 1: Identification
1. Accéder au menu **Vue d'ensemble**
2. Consulter les **Actions urgentes**
3. Cliquer sur un profil pour le sélectionner

### Étape 2: Analyse
1. Examiner les **Détails du profil**
2. Vérifier le **Score de confiance**
3. Évaluer le **Niveau de risque**
4. Consulter les **Signalements** (si applicable)

### Étape 3: Action
1. Aller à l'onglet **Modération**
2. Choisir l'action appropriée:
   - **Validation**: Si tous les documents sont OK
   - **Avertissement**: En cas d'activité suspecte
   - **Suspension**: Pour problèmes graves
   - **Blocage**: Cas extrêmes seulement
3. Remplir les détails de l'action
4. Confirmer

### Étape 4: Suivi
1. Consulter l'**Historique des actions**
2. Générer un **Rapport de modération** si nécessaire

---

## 👥 Gestion par type de profil

### Consommateurs (ROLE_CONSOMMATEUR)
- **Vérifient**: Email, adresse, moyens de paiement
- **Valident**: Après KYC complet
- **Surveillent**: Fraude, non-paiement, harcèlement

### Producteurs (ROLE_PRODUCTEUR)
- **Vérifient**: SIRET, documents légaux, certifications
- **Valident**: Documents et localisation confirmés
- **Surveillent**: Stock incohérent, Prix inappropriés, Produits dangereux

### Livreurs (ROLE_LIVREUR)
- **Vérifient**: Permis, assurance, véhicule
- **Valident**: Documents de transport
- **Surveillent**: Incidents, retards, clients non satisfaits

### Modérateurs (ROLE_MODERATEUR)
- **Accès**: Aperçu général
- **Permissions**: Modération de contenu, résolution de litiges
- **Restrictions**: Pas de suppression de profils

---

## 📊 Interprétation des scores

### Score de confiance (0-100%)
| Plage | Niveau | Signification |
|-------|--------|-------------|
| 85-100% | 🟢 Excellent | Profil fiable et actif |
| 70-84% | 🟡 Bon | Profil normal, quelques vérifications OK |
| 50-69% | 🟠 Moyen | Profil nouveau ou quelques problèmes mineurs |
| 0-49% | 🔴 Risqué | À vérifier, plusieurs signalements |

### Niveau de risque
- **🟢 Faible**: Score ≥ 85% ET 0 signalement
- **🟡 Modéré**: Score ≥ 60% ET ≤ 2 signalements
- **🔴 Élevé**: Score < 60% OU > 2 signalements

---

## 🔌 API de support

Le service `AdminService` fournit les méthodes suivantes:

```typescript
// Gestion des profils
chargerProfils(): void
obtenirProfil(id: number): Observable<ProfilAdmin>
obtenirProfilsFiltres(role?, statut?): Observable<ProfilAdmin[]>
mettreAJourProfil(id, donnees): Observable<ProfilAdmin>

// Actions de modération
validerProfil(id, raison): Observable<ProfilAdmin>
suspendreTemporairement(id, duree, raison): Observable<ProfilAdmin>
reactiverProfil(id): Observable<ProfilAdmin>
ajouterAvertissement(id, raison, details): Observable<ActionModeration>
bloquerProfil(id, raison): Observable<ProfilAdmin>
envoyerMessage(id, sujet, contenu): Observable<any>

// Gestion des rôles
assignerRole(userId, role): Observable<ProfilAdmin>
retirerRole(userId, role): Observable<ProfilAdmin>

// Rapports
genererRapportModeration(dateDebut, dateFin): Observable<RapportModeration>
obtenirStatistiques(): Observable<any>
```

---

## 🎨 Composants utilisés

### Composants principaux
1. **AdminComponent**: Conteneur principal avec onglets
2. **AdminModerationComponent**: Gestion des actions de modération
3. **AdminStatisticsComponent**: Tableau de bord analytique
4. **AdminEditProfilComponent**: Modal d'édition de profil

### Fichiers
```
admin/
├── admin.component.ts              # Composant principal
├── admin-moderation.component.ts   # Modération
├── admin-statistics.component.ts   # Statistiques
├── admin-edit-profil.component.ts  # Édition
└── admin.service.ts                # Service API
```

---

## 🚀 Configuration API backend requise

Les endpoints API suivants doivent être implémentés:

```
GET    /api/admin/profils                          # Lister tous
GET    /api/admin/profils/:id                      # Détail
GET    /api/admin/profils/urgents                  # Urgents
PUT    /api/admin/profils/:id                      # Mettre à jour
POST   /api/admin/profils/:id/valider              # Valider
POST   /api/admin/profils/:id/suspendre-temp       # Suspendre
POST   /api/admin/profils/:id/reactiver            # Réactiver
POST   /api/admin/profils/:id/avertir              # Avertir
POST   /api/admin/profils/:id/bloquer              # Bloquer
POST   /api/admin/profils/:id/message              # Envoyer message
GET    /api/admin/profils/:id/historique-actions   # Historique
POST   /api/admin/rapports/moderation              # Rapport
```

---

## 📱 Responsive Design

L'interface est entièrement responsive:
- **Desktop** (≥1280px): Vue complète avec colonnes
- **Tablet** (768px-1279px): Layout adapté avec 1 colonne
- **Mobile** (<768px): Vue mobile optimisée

---

## 🔐 Permissions et accès

**Seul l'administrateur (ROLE_ADMIN) doit accéder à cette interface.**

Ajouter un guard dans les routes:
```typescript
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [AdminGuard]  // À implémenter
}
```

---

## 💡 Bonnes pratiques

1. **Documentation**: Toujours noter la raison des actions
2. **Prudence**: Le blocage est irréversible
3. **Vérification**: Vérifier les documents avant validation
4. **Escalade**: Contactez l'utilisateur avant blocage
5. **Rapports**: Générer régulièrement des rapports

---

## 🐛 Troubleshooting

| Problème | Solution |
|----------|----------|
| Profils ne se chargent pas | Vérifier la connexion API |
| Boutons désactivés | Vérifier le rôle de l'utilisateur |
| Modal d'édition ne s'ouvre pas | Sélectionner d'abord un profil |
| Historique vide | Pas encore d'actions enregistrées |

---

**Dernière mise à jour**: 20 avril 2026
