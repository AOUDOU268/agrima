# Architecture du Dashboard Admin AGRIMA - Vue d'ensemble

## 🏗️ Vue globale de l'architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    UTILISATEUR ADMINISTRATEUR               │
└────────────────────────────┬────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  NAVIGATEUR WEB │
                    │  (Firefox, Edge)│
                    └────────┬────────┘
                             │
        ┌────────────────────▼────────────────────┐
        │        FRONTEND ANGULAR 17+             │
        │  ╔═════════════════════════════════╗   │
        │  ║   AdminComponent (Conteneur)    ║   │
        │  ║  ┌─────────────────────────────┐║   │
        │  ║  │ Onglets Navigation          ││   │
        │  ║  │ - Aperçu                    ││   │
        │  ║  │ - Modération                ││   │
        │  ║  │ - Statistiques              ││   │
        │  ║  └─────────────────────────────┘║   │
        │  ║                                 ║   │
        │  ║  ┌─────────────────────────────┐║   │
        │  ║  │ AdminModerationComponent    ││   │
        │  ║  │ - Form Suspension           ││   │
        │  ║  │ - Form Avertissement        ││   │
        │  ║  │ - Form Blocage              ││   │
        │  ║  └─────────────────────────────┘║   │
        │  ║                                 ║   │
        │  ║  ┌─────────────────────────────┐║   │
        │  ║  │ AdminStatisticsComponent    ││   │
        │  ║  │ - KPI Cards                 ││   │
        │  ║  │ - Distribution Charts       ││   │
        │  ║  └─────────────────────────────┘║   │
        │  ║                                 ║   │
        │  ║  ┌─────────────────────────────┐║   │
        │  ║  │ AdminEditProfilComponent    ││   │
        │  ║  │ - Modal Edit Form           ││   │
        │  ║  └─────────────────────────────┘║   │
        │  ╚═════════════════════════════════╝   │
        │                                        │
        │  ╔═════════════════════════════════╗   │
        │  ║     AdminService (RxJS)         ║   │
        │  ║  - BehaviorSubjects$            ║   │
        │  ║  - HTTP Requests                ║   │
        │  ║  - Observable Streams           ║   │
        │  ╚═════════════════════════════════╝   │
        │                                        │
        └────────────────────┬───────────────────┘
                             │
                 ┌───────────▼───────────┐
                 │   HTTP CLIENT         │
                 │   (HttpClientModule)  │
                 └───────────┬───────────┘
                             │
        ┌────────────────────▼────────────────────┐
        │     RÉSEAU / API GATEWAY (Port 8080)    │
        │     https://api.agrima.local/api/*      │
        └────────────────────┬───────────────────┘
                             │
        ┌────────────────────▼────────────────────┐
        │        BACKEND SPRING BOOT 3.x          │
        │  ╔═════════════════════════════════╗   │
        │  ║  AdminController               ║   │
        │  ║  ┌─────────────────────────────┐║   │
        │  ║  │ GET    /profils             ││   │
        │  ║  │ POST   /profils/:id/valider ││   │
        │  ║  │ POST   /profils/:id/bloquer ││   │
        │  ║  │ GET    /statistiques        ││   │
        │  ║  └─────────────────────────────┘║   │
        │  ╚═════════════════════════════════╝   │
        │                                        │
        │  ╔═════════════════════════════════╗   │
        │  ║  AdminService (Logique métier)  ║   │
        │  ║  ┌─────────────────────────────┐║   │
        │  ║  │ Validation profils          ││   │
        │  ║  │ Suspension/Activation       ││   │
        │  ║  │ Calcul statistiques         ││   │
        │  ║  │ Audit logging               ││   │
        │  ║  └─────────────────────────────┘║   │
        │  ╚═════════════════════════════════╝   │
        │                                        │
        │  ╔═════════════════════════════════╗   │
        │  ║  Repositories (Spring Data)     ║   │
        │  ║  ┌─────────────────────────────┐║   │
        │  ║  │ UtilisateurRepository       ││   │
        │  ║  │ ActionModerationRepository  ││   │
        │  ║  └─────────────────────────────┘║   │
        │  ╚═════════════════════════════════╝   │
        │                                        │
        └────────────────────┬───────────────────┘
                             │
        ┌────────────────────▼────────────────────┐
        │     BASE DE DONNÉES PostgreSQL          │
        │  ╔═════════════════════════════════╗   │
        │  ║ Tables:                         ║   │
        │  ║  - utilisateurs                 ║   │
        │  ║  - actions_moderation          ║   │
        │  ║  - notifications               ║   │
        │  ║  - audit_logs                  ║   │
        │  ╚═════════════════════════════════╝   │
        └─────────────────────────────────────────┘
```

---

## 📊 Flow de données - Exemple: Modération d'un profil

```
1. UTILISATEUR ADMIN
   │ Sélectionne "Bloquer profil"
   │
2. COMPOSANT FRONTEND
   ├─ admin.component.ts
   │  └─ selectionnerProfil(profil)
   │     └─ adminService.profilSelectionne$.next(profil)
   │
3. MODAL MODERATION
   ├─ admin-moderation.component.ts
   │  └─ bloquer()
   │     └─ adminService.bloquerProfil(id, raison)
   │
4. SERVICE FRONTEND
   ├─ admin.service.ts
   │  └─ bloquerProfil()
   │     └─ this.http.post('/api/admin/profils/:id/bloquer', data)
   │
5. RÉSEAU
   ├─ HTTP POST
   │  └─ http://localhost:8080/api/admin/profils/1/bloquer
   │
6. BACKEND
   ├─ AdminController
   │  └─ bloquerProfil(@PathVariable id, @RequestBody request)
   │     └─ adminService.bloquerProfil(id, reason)
   │
7. SERVICE BACKEND
   ├─ AdminService
   │  ├─ Récupère utilisateur
   │  ├─ Change statut en "Bloqué"
   │  ├─ Enregistre ActionModeration
   │  └─ Notifie l'utilisateur
   │
8. BASE DE DONNÉES
   ├─ UPDATE utilisateurs SET statut = 'Bloqué'
   ├─ INSERT INTO actions_moderation (...)
   └─ INSERT INTO notifications (...)
   │
9. RÉPONSE BACKEND
   └─ ProfilAdminDTO (mise à jour)
   │
10. FRONTEND
    ├─ Reçoit la réponse
    ├─ Met à jour l'interface
    └─ Affiche la confirmation
   │
11. UTILISATEUR ADMIN
    └─ Voit le profil bloqué
```

---

## 🔄 État du système avec RxJS

```
AdminService (État centralisé)
│
├─ profilsSubject$ (BehaviorSubject)
│  └─ Liste tous les profils
│     ├─ admin.component.ts (observe)
│     └─ Mise à jour via chargerProfils()
│
├─ profilSelectionneSubject$ (BehaviorSubject)
│  └─ Profil actuellement sélectionné
│     ├─ admin-moderation.component.ts (observe)
│     ├─ admin-edit-profil.component.ts (observe)
│     └─ Mise à jour via selectionnerProfil()
│
├─ actionsSubject$ (BehaviorSubject)
│  └─ Historique des actions du profil
│     ├─ admin-moderation.component.ts (observe)
│     └─ Mise à jour via chargerActions()
│
└─ statistiquesSubject$ (BehaviorSubject)
   └─ Statistiques globales
      ├─ admin-statistics.component.ts (observe)
      └─ Mise à jour via chargerStatistiques()

Observable Flow:
adminService.profils$
  ├─ subscribe() → admin.component.ts
  │  └─ this.profils = profils
  │
adminService.profilSelectionne$
  ├─ subscribe() → admin-moderation.component.ts
  │  └─ this.profilSelectionne = profil
  │
adminService.statistiques$
  └─ subscribe() → admin-statistics.component.ts
     └─ this.statistiques = stats
```

---

## 🎨 Hiérarchie des composants

```
AppComponent (root)
│
└─ app.routes.ts
   │
   └─ AdminComponent (route: /admin)
      │
      ├─ [Onglet: Aperçu]
      │  ├─ Profile table
      │  ├─ Filter controls
      │  └─ Quick actions
      │
      ├─ [Onglet: Modération] (modal)
      │  └─ AdminModerationComponent
      │     ├─ Form: Validation
      │     ├─ Form: Suspension
      │     ├─ Form: Avertissement
      │     ├─ Form: Contact
      │     ├─ Form: Blocage
      │     └─ History list
      │
      ├─ [Onglet: Statistiques]
      │  └─ AdminStatisticsComponent
      │     ├─ KPI cards
      │     ├─ Role distribution
      │     ├─ Confidence bands
      │     └─ Urgent actions
      │
      └─ Modal: AdminEditProfilComponent
         ├─ Email (read-only)
         ├─ Telephone
         ├─ Location
         ├─ Score
         ├─ Status
         ├─ Conditional fields
         └─ Save button
```

---

## 🔐 Flux d'authentification

```
1. Utilisateur se connecte
   │
2. Backend génère JWT Token
   │  ├─ Payload: { id, role, email, exp }
   │  └─ Role: "ADMIN"
   │
3. Frontend stocke token (localStorage/sessionStorage)
   │
4. Requête vers /api/admin/*
   │  ├─ Header: Authorization: Bearer <token>
   │  └─ Interceptor ajoute le token
   │
5. Backend reçoit requête
   │  ├─ Valide le token
   │  ├─ Vérifie hasRole('ADMIN')
   │  └─ @PreAuthorize("hasRole('ADMIN')")
   │
6. Réponse OK ou 403 Forbidden
   │
7. Frontend
   └─ OK: Affiche les données
   └─ 403: Redirection /login
```

---

## 📦 Packages et dépendances

### Frontend
```
angular/
├─ @angular/core
├─ @angular/common
├─ @angular/forms
├─ @angular/router
├─ @angular/platform-browser-dynamic
├─ @angular/platform-browser
│
rxjs/
├─ Observable
├─ BehaviorSubject
└─ operators (map, filter, etc.)

tailwindcss/
├─ Styles
└─ Responsive design
```

### Backend
```
spring-boot/
├─ spring-boot-starter-web
├─ spring-boot-starter-data-jpa
├─ spring-boot-starter-security
│
org.mapstruct/
└─ mapstruct (DTOs)

org.projectlombok/
└─ lombok (@Data, @RequiredArgsConstructor)

org.postgresql/
└─ postgresql driver
```

---

## 🔄 Cycle de vie d'un composant

### AdminComponent

```
1. Constructor
   └─ Inject AdminService

2. ngOnInit
   ├─ adminService.chargerProfils()
   ├─ adminService.chargerStatistiques()
   ├─ Subscribe to profils$
   └─ Subscribe to statistiques$

3. Render
   ├─ Affiche 3 onglets
   ├─ Affiche le tableau des profils
   └─ Affiche les statistiques

4. User interaction
   ├─ Sélection d'un profil
   ├─ Changement d'onglet
   └─ Déclenchement d'une action

5. ngOnDestroy
   └─ Unsubscribe from observables
```

---

## 📈 Performance et optimisation

### Techniques appliquées

```
Frontend:
├─ Lazy loading des composants
├─ OnPush change detection
├─ RxJS operators optimization
└─ CSS animations

Backend:
├─ Pagination des résultats (Pageable)
├─ Filtres efficaces (JPA predicates)
├─ Caching des statistiques
├─ Indexes sur les colonnes
└─ Connection pooling (HikariCP)

Database:
├─ Indexes sur id, statut, role
├─ Denormalization pour les stats
├─ Archivage des vieilles actions
└─ Replication pour HA
```

---

## 🔍 Logging et monitoring

### Frontend
```
admin.service.ts:
├─ console.log('Chargement des profils')
├─ console.error('Erreur lors de ...')
└─ Sentry integration (optionnel)

Template:
├─ Angular DevTools
└─ Chrome DevTools
```

### Backend
```
AdminService:
├─ log.info('Récupération des profils')
├─ log.error('Erreur: ...', exception)
└─ log.debug('Details: ...')

SLF4J → Logs
├─ console (développement)
├─ file (production)
└─ ELK Stack (optionnel)
```

---

## ✨ Exemple de workflow complet

### Cas: Un admin valide un producteur

```
1. L'admin accède à /admin
2. Le dashboard charge les 6 profils d'exemple
3. L'admin voit Maurice Etogo (En attente)
4. L'admin clique sur le profil
5. AdminComponent appelle selectionnerProfil()
6. AdminModerationComponent s'affiche
7. L'admin clique sur "VALIDER"
8. Formulaire de validation s'ouvre
9. L'admin saisit la raison: "Documents validés"
10. L'admin clique "CONFIRMER"
11. AdminService.validerProfil(id, raison) est appelé
12. HTTP POST /api/admin/profils/5/valider envoyé
13. Backend reçoit la requête
14. AdminService.validerProfil() exécuté:
    ├─ Statut changé en "Validé"
    ├─ ActionModeration enregistrée
    └─ Email envoyé au producteur
15. ProfilAdminDTO réponse retournée
16. Frontend met à jour l'interface
17. Tableau montre Maurice avec statut "Validé"
18. Historique affiche l'action
```

---

**Version**: 1.0  
**Date**: 20 avril 2026  
**Diagrammes créés avec**: Markdown + ASCII Art
