# ⚡ Quick Start - Admin Dashboard AGRIMA

> **Pour les développeurs pressés**: 5-10 minutes pour démarrer

---

## 🚀 Démarrage en 5 minutes

### Frontend

```bash
cd frontend/web
npm install
ng serve --open
```

**Résultat**: http://localhost:4200/admin

### Backend

```bash
cd backend/user-service
mvn clean install
mvn spring-boot:run
```

**Résultat**: http://localhost:8080/api/admin/*

### Docker (tout d'un coup)

```bash
docker-compose up -d
```

**Services**: Frontend + Backend + PostgreSQL

---

## 📋 Fichiers essentiels

### Frontend
```
frontend/web/
├─ src/app/pages/admin/
│  ├─ admin.component.ts          ← Conteneur principal
│  ├─ admin.service.ts             ← État centralisé
│  └─ admin-*-component.ts         ← Sous-composants
└─ ADMIN_GUIDE.md                  ← Guide utilisateur
```

### Backend
```
backend/user-service/
├─ src/main/java/com/agrima/userservice/
│  ├─ controller/AdminController.java    ← Routes API
│  ├─ service/AdminService.java          ← Logique métier
│  └─ dto/AdminDTOs.java                 ← Structures données
└─ BACKEND_ADMIN_README.md               ← API docs
```

---

## 🎯 3 choses à faire en premier

1. **Lire le guide**
   - Beginners: [README_INDEX.md](README_INDEX.md)
   - Frontend devs: [frontend/web/ADMIN_GUIDE.md](frontend/web/ADMIN_GUIDE.md)
   - Backend devs: [backend/user-service/BACKEND_ADMIN_README.md](backend/user-service/BACKEND_ADMIN_README.md)

2. **Démarrer le code**
   ```bash
   npm install && ng serve  # Frontend
   mvn spring-boot:run       # Backend
   ```

3. **Explorer les données d'exemple**
   - 6 profils d'exemple
   - 6 types d'actions
   - Toutes les statistiques calculées

---

## ❓ Questions fréquentes

### "Comment accéder au dashboard ?"
```
http://localhost:4200/admin
```

### "Quels sont les endpoints API ?"
Voir `BACKEND_ADMIN_README.md` section "📡 Endpoints"

### "Où sont les modèles de données ?"
- À créer: `Utilisateur.java`, `ActionModeration.java`
- À implémenter: `UtilisateurRepository.java`, `ActionModerationRepository.java`

### "Comment se connecter ?"
Frontend: Données en mémoire (mock)  
Backend: Authentification OAuth2/JWT requise

### "Comment les données sont-elles persistées ?"
- Frontend: BehaviorSubjects en mémoire
- Backend: PostgreSQL (à configurer)

---

## 📊 Statut rapide

| Composant | Statut | Qui travaille dessus |
|-----------|--------|----------------------|
| Frontend | ✅ Complet | Utilisez-le directement |
| Backend API | ✅ Définie | À implémenter |
| BD Models | 🟡 À créer | À faire (30 min) |
| Repositories | 🟡 À créer | À faire (30 min) |
| Tests | 🟡 À écrire | À faire (2-3h) |

---

## 🔗 Liens importants

- **Documentation complète**: [README_INDEX.md](README_INDEX.md)
- **Guide intégration**: [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
- **Diagrammes**: [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)
- **Tracker progress**: [PROGRESS_TRACKER.md](PROGRESS_TRACKER.md)
- **Scripts bash**: [scripts.sh](scripts.sh)

---

## ⌨️ Commandes rapides

```bash
# Frontend
ng serve --open                          # Démarrer dev
ng build                                 # Build prod
ng test                                  # Tests

# Backend
mvn spring-boot:run                      # Démarrer dev
mvn clean package                        # Build JAR
mvn test                                 # Tests

# Docker
docker-compose up                        # Tout démarrer
docker-compose down                      # Tout arrêter
docker-compose logs -f                   # Voir logs

# Database
psql -U agrima_user agrima               # Connexion
npm run db:create                        # Créer BD
npm run db:reset                         # Réinitialiser
```

---

## 🎨 Fonctionnalités principales

✅ **Listing** - Voir tous les profils  
✅ **Filtres** - Par rôle et statut  
✅ **Modération** - 6 types d'actions  
✅ **Statistiques** - KPIs et rapports  
✅ **Historique** - Audit complet  
✅ **Modal édition** - Mettre à jour les profils  

---

## 📊 Technologies

**Frontend**: Angular 17, RxJS, Tailwind CSS  
**Backend**: Spring Boot 3, Spring Security, JPA  
**DB**: PostgreSQL  
**DevOps**: Docker, Docker Compose  

---

## 💡 Tips

💡 Les données de démonstration sont auto-générées - pas besoin de BD  
💡 Le frontend fonctionne standalone - idéal pour le design  
💡 Tous les endpoints sont dans AdminController  
💡 Le service AgmindService gère tout l'état  
💡 Docs complètes: lisez les 5 fichiers MD principaux  

---

## 🆘 Aide rapide

**Port occupé ?**
```bash
ng serve --port 4300
java -jar app.jar --server.port=8081
```

**Pas de BD ?**
```bash
docker run -d --name postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 postgres:13
```

**Besoin de données réelles ?**
Lire: `INTEGRATION_GUIDE.md` → Backend → Modèles JPA

---

## 🎯 Prochaines étapes

1. ✅ Frontend + Backend fonctionnent
2. 🟡 Implémenter les modèles JPA (30 min)
3. 🟡 Créer les repositories (30 min)
4. 🟡 Écrire les tests (2-3h)
5. ✅ Déployer en production

---

## 📞 Besoin de plus ?

Voir **README_INDEX.md** pour:
- Index complet de toute la documentation
- Guides spécifiques par rôle
- Ressources d'apprentissage
- Checklist d'intégration complète

---

**Prêt ?** Tapez: `cd frontend/web && npm install && ng serve`

Bon développement ! 🚀
