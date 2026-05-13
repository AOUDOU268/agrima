# Configuration Admin Dashboard - AGRIMA

## 📋 Installation et intégration

### 1. Configuration dans `app.config.ts`

Assurez-vous que `HttpClientModule` est importé dans la configuration:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
```

### 2. Mise à jour des routes (`app.routes.ts`)

```typescript
import { Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  // ... autres routes
  {
    path: 'admin',
    component: AdminComponent,
    // À protéger avec un guard
    // canActivate: [AdminGuard]
  },
  // ...
];
```

### 3. Import du service dans les composants

Le service est fourni automatiquement au niveau root via `providedIn: 'root'` dans le décorateur `@Injectable`.

---

## 🔌 API Backend requis

### Structure des endpoints

Tous les endpoints doivent être préfixés par `/api/admin/`.

#### Profils
```bash
GET    /api/admin/profils
GET    /api/admin/profils?role=ROLE_CONSOMMATEUR&statut=Actif
GET    /api/admin/profils/:id
GET    /api/admin/profils/urgents
PUT    /api/admin/profils/:id
DELETE /api/admin/profils/:id
```

#### Actions de modération
```bash
POST   /api/admin/profils/:id/valider
POST   /api/admin/profils/:id/suspendre-temp
POST   /api/admin/profils/:id/reactiver
POST   /api/admin/profils/:id/avertir
POST   /api/admin/profils/:id/bloquer
POST   /api/admin/profils/:id/message
GET    /api/admin/profils/:id/historique-actions
```

#### Rapports
```bash
GET    /api/admin/statistiques
GET    /api/admin/rapports/moderation?dateDebut=2024-01-01&dateFin=2024-12-31
```

---

## 📦 Format des données

### Profil Admin
```json
{
  "id": 1,
  "nom": "Aline Mvondo",
  "email": "aline.mvondo@agrima.cm",
  "telephone": "+237 690 110 112",
  "role": "ROLE_CONSOMMATEUR",
  "statut": "Actif",
  "localisation": "Yaoundé",
  "dateInscription": "2026-03-12",
  "derniereActivite": "2026-04-20T10:30:00",
  "scoreConfiance": 94,
  "nbSignalements": 0,
  "note": 4.8,
  "portefeuille": "Wallet Premium",
  "tags": ["client fidèle", "paiement validé"],
  "siret": "12345678901234",
  "nomExploitation": "Horizon Verte",
  "vehicule": "Suzuki Carry",
  "plaqueImmatriculation": "CM-ND-2024"
}
```

### Action Moderation
```json
{
  "id": 1,
  "profilId": 5,
  "type": "SUSPENSION",
  "description": "Suspension temporaire suite à stock incohérent",
  "raison": "Problèmes de stock",
  "dateAction": "2026-04-20T14:30:00",
  "moderateurId": 4,
  "statut": "EFFECTUEE"
}
```

### Rapport Moderation
```json
{
  "dateDebut": "2026-04-01",
  "dateFin": "2026-04-30",
  "totalProfils": 6,
  "actifs": 4,
  "suspendus": 1,
  "enAttente": 1,
  "scoreConfiantMoyen": 75.67,
  "signalementsTotaux": 6,
  "actionsEffectuees": 12
}
```

---

## 🎨 Personnalisation des styles

Les styles sont définis dans les fichiers des composants. Pour modifier la couleur principale:

1. **Couleur verte primaire**: `#10b981` (émeraude)
2. **Couleur secondaire**: `#047857` (émeraude foncée)
3. **Couleur de fond**: `#f8fafc` (gris très clair)

Pour personnaliser, recherchez ces codes dans les fichiers `*.component.ts` et modifiez les valeurs dans les `styles`.

---

## 🚀 Déploiement

### Build pour production
```bash
npm run build
```

### Optimisations recommandées
1. Lazy loading des composants admin
2. Cache HTTP pour les profils
3. Pagination pour les grandes listes
4. Compression des images d'avatar

---

## 🧪 Tests

### Mock Service pour tests
```typescript
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { AdminService, ProfilAdmin } from './admin.service';

@Injectable()
export class AdminServiceMock extends AdminService {
  override chargerProfils(): void {
    this.profilsSubject.next([
      {
        id: 1,
        nom: 'Test User',
        email: 'test@example.com',
        // ... autres propriétés
      }
    ]);
  }
}
```

---

## 📝 Checklist d'intégration

- [ ] `AdminService` importé et injecté
- [ ] Routes configurées
- [ ] Endpoints API implémentés
- [ ] HttpClient configuré
- [ ] Guards d'authentification ajoutés
- [ ] Styles Tailwind appliqués
- [ ] Tests unitaires écrit
- [ ] Documentation mise à jour

---

## 🆘 Support

Pour des questions ou problèmes:
1. Consultez `ADMIN_GUIDE.md` pour l'utilisation
2. Vérifiez les logs de la console
3. Testez les endpoints API avec Postman
4. Vérifiez l'authentification et les permissions

---

**Version**: 1.0  
**Dernière mise à jour**: 20 avril 2026
