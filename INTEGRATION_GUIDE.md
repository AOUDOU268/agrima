# Guide d'intégration du Dashboard Admin - AGRIMA

## 📋 Table des matières
1. [Installation Frontend](#installation-frontend)
2. [Installation Backend](#installation-backend)
3. [Configuration des routes](#configuration-des-routes)
4. [Tests](#tests)
5. [Déploiement](#déploiement)

---

## 🖥️ Installation Frontend

### Prérequis
- Node.js 18+
- npm ou yarn
- Angular CLI 17+

### Étapes

#### 1. Vérifier les imports
```bash
cd frontend/web
```

#### 2. Vérifier que Tailwind CSS est configuré
```bash
npm run build
```

#### 3. Vérifier les dépendances
```bash
npm list @angular/common @angular/core rxjs
```

#### 4. Démarrer le serveur de développement
```bash
ng serve --open
```

L'application devrait ouvrir sur `http://localhost:4200`

#### 5. Accéder au dashboard
```
http://localhost:4200/admin
```

### Fichiers à verifier

```
frontend/web/src/app/pages/admin/
├── admin.component.ts ✓
├── admin.service.ts ✓
├── admin-moderation.component.ts ✓
├── admin-statistics.component.ts ✓
├── admin-edit-profil.component.ts ✓
└── admin-guide.md ✓
```

---

## 🔧 Installation Backend

### Prérequis
- Java 17+
- Maven 3.8+
- PostgreSQL 13+ (ou autre BD)
- Spring Boot 3.x

### Étapes

#### 1. Structure du projet
```bash
cd backend/user-service
```

#### 2. Créer les fichiers s'ils n'existent pas
```bash
# Controller
src/main/java/com/agrima/userservice/controller/AdminController.java

# Service
src/main/java/com/agrima/userservice/service/AdminService.java
src/main/java/com/agrima/userservice/service/AdminMapper.java

# DTOs
src/main/java/com/agrima/userservice/dto/AdminDTOs.java

# Repositories (à créer)
src/main/java/com/agrima/userservice/repository/UtilisateurRepository.java
src/main/java/com/agrima/userservice/repository/ActionModerationRepository.java

# Modèles (à créer)
src/main/java/com/agrima/userservice/model/Utilisateur.java
src/main/java/com/agrima/userservice/model/ActionModeration.java
```

#### 3. Ajouter les dépendances (pom.xml)
```xml
<!-- MapStruct -->
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
</dependency>

<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
        <annotationProcessorPaths>
            <path>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct-processor</artifactId>
                <version>1.5.5.Final</version>
            </path>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>1.18.30</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

#### 4. Configurer la base de données (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/agrima
    username: agrima_user
    password: secure_password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true

logging:
  level:
    com.agrima: DEBUG
```

#### 5. Build Maven
```bash
mvn clean package -DskipTests
```

#### 6. Démarrer l'application
```bash
java -jar target/user-service-1.0.0.jar
```

L'API devrait être accessible sur `http://localhost:8080`

---

## 🛣️ Configuration des routes

### Routes Frontend (app.routes.ts)

```typescript
import { Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    // À implémenter: canActivate: [AdminGuard]
    data: { title: 'Dashboard Administrateur' }
  },
  // ... autres routes
];
```

### Admin Guard (optionnel mais recommandé)

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.hasRole('ADMIN')) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}
```

---

## 🧪 Tests

### Tests Frontend

#### Test d'affichage
```bash
ng test
```

#### Test E2E
```bash
ng e2e
```

#### Test dans le navigateur
1. Aller à `http://localhost:4200/admin`
2. Vérifier:
   - [x] 3 onglets visibles (Aperçu, Modération, Statistiques)
   - [x] 6 profils d'exemple affichés
   - [x] Filtres fonctionnels
   - [x] Actions de modération disponibles
   - [x] Statistiques calculées

### Tests Backend

#### Test unitaire example
```bash
mvn test -Dtest=AdminServiceTest
```

#### Test d'endpoint avec curl
```bash
# Get all profiles
curl -X GET http://localhost:8080/api/admin/profils \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get statistics
curl -X GET http://localhost:8080/api/admin/statistiques \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Validate profile
curl -X POST http://localhost:8080/api/admin/profils/1/valider \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"raison": "Documents validés"}'
```

#### Test avec Postman
1. Importer les endpoints dans Postman
2. Configurer l'authentification
3. Tester chaque endpoint

---

## 🚀 Déploiement

### Docker (optionnel)

#### Dockerfile Frontend
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:latest
COPY --from=build /app/dist/agrima /usr/share/nginx/html
EXPOSE 80
```

#### Dockerfile Backend
```dockerfile
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk-jammy
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build:
      context: ./frontend/web
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build:
      context: ./backend/user-service
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/agrima
      SPRING_DATASOURCE_USERNAME: agrima_user
      SPRING_DATASOURCE_PASSWORD: secure_password
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      POSTGRES_DB: agrima
      POSTGRES_USER: agrima_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Build Production
```bash
# Frontend
cd frontend/web
npm run build:prod

# Backend
cd backend/user-service
mvn clean package -Pprod
```

---

## 📋 Checklist finale

### Frontend
- [ ] npm install exécuté
- [ ] ng serve sans erreurs
- [ ] Admin dashboard accessible à /admin
- [ ] 3 onglets visibles
- [ ] 6 profils d'exemple chargés
- [ ] Filtres fonctionnels
- [ ] Design responsive
- [ ] Console sans erreurs

### Backend
- [ ] Maven build réussi
- [ ] Base de données configurée
- [ ] Entités JPA créées
- [ ] Repositories implémentés
- [ ] AdminService injecté
- [ ] AdminController enregistré
- [ ] Endpoints testés
- [ ] Security configurée

### Intégration
- [ ] Frontend et Backend communiquent
- [ ] Authentification fonctionnelle
- [ ] Profils se chargent depuis l'API
- [ ] Actions de modération réussies
- [ ] Notifications envoyées
- [ ] Statistiques correctes

### Production
- [ ] Code en version control (Git)
- [ ] Tests passent
- [ ] Secrets gérés (env variables)
- [ ] Logs centralisés
- [ ] Monitoring activé
- [ ] Backup base de données configuré

---

## 🆘 Troubleshooting

### Frontend

**Erreur: "Cannot find module '@angular/...'**
```bash
npm install
```

**Port 4200 déjà utilisé**
```bash
ng serve --port 4300
```

**Tailwind CSS non appliqué**
```bash
npm run build  # Force rebuild
```

### Backend

**Erreur: "Failed to configure a DataSource"**
- Vérifier les credentials PostgreSQL
- Vérifier que la base de données existe
- Vérifier que le serveur DB est actif

**Erreur MapStruct compilation**
```bash
mvn clean compile
```

**Port 8080 déjà utilisé**
```bash
java -jar user-service.jar --server.port=8081
```

---

## 📚 Ressources utiles

- [Angular Documentation](https://angular.io)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Tailwind CSS](https://tailwindcss.com)
- [MapStruct](https://mapstruct.org)

---

## 📞 Support

Pour toute question:
1. Consultez la documentation dans chaque dossier
2. Vérifiez les logs console
3. Testez les endpoints avec Postman
4. Vérifiez l'authentification

---

**Date**: 20 avril 2026  
**Version**: 1.0  
**Statut**: ✅ Complet et prêt pour intégration
