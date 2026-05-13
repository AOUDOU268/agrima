# Admin Dashboard Backend - AGRIMA

## 📚 Documentation de l'API d'administration

### 🏗️ Architecture

L'implémentation backend du tableau de bord administrateur suit une architecture en couches:

```
Controller (AdminController)
    ↓
Service (AdminService)
    ↓
Repository (UtilisateurRepository, ActionModerationRepository)
    ↓
Database
```

### 📦 Composants

#### 1. **AdminController** (`AdminController.java`)
- Point d'entrée pour toutes les requêtes administrateur
- Sécurisé avec `@PreAuthorize("hasRole('ADMIN')")` 
- Routes groupées par fonctionnalité
- Gestion des erreurs via des exceptions

**Exemple d'endpoint**:
```java
@GetMapping("/profils")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Page<ProfilAdminDTO>> obtenirTousProfils(
    @RequestParam(required = false) String role,
    @RequestParam(required = false) String statut,
    Pageable pageable)
```

#### 2. **AdminService** (`AdminService.java`)
- Logique métier centralisée pour les opérations d'administration
- Gestion des transactions avec `@Transactional`
- Logging complet via SLF4J
- Communication avec les repositories et services externes

**Sections du service**:
- Gestion des profils (CRUD)
- Actions de modération (6 types)
- Gestion des rôles
- Actions en attente
- Analytics et rapports

#### 3. **DTOs** (`AdminDTOs.java`)
Ensembles de classes transfert de données:
- `ProfilAdminDTO` - Profil utilisateur complet
- `UpdateProfilRequest` - Mise à jour profil
- `ActionModerationDTO` - Action de modération
- `StatistiquesGlobalesDTO` - Statistiques globales
- `RapportModerationDTO` - Rapport complet

#### 4. **AdminMapper** (`AdminMapper.java`)
- Conversion entités ↔ DTOs
- MapStruct pour la performance
- Mappages bidirectionnels

### 🔐 Sécurité

Tous les endpoints d'administration sont protégés:

```java
@PreAuthorize("hasRole('ADMIN')")
```

**Garanties**:
- Authentification requise
- Rôle ADMIN obligatoire
- Logging de toutes les actions
- Audit complet des modifications

### 📡 Endpoints

#### Gestion des profils

**Lister les profils**
```http
GET /api/admin/profils?role=ROLE_PRODUCTEUR&statut=Actif&page=0&size=10
```

**Obtenir un profil**
```http
GET /api/admin/profils/{id}
```

**Mettre à jour un profil**
```http
PUT /api/admin/profils/{id}
Content-Type: application/json

{
  "telephone": "+237 690 110 112",
  "localisation": "Yaoundé",
  "scoreConfiance": 95,
  "statut": "Actif"
}
```

**Supprimer un profil**
```http
DELETE /api/admin/profils/{id}
```

#### Modération

**Valider un profil**
```http
POST /api/admin/profils/{id}/valider
Content-Type: application/json

{
  "raison": "Tous les documents validés"
}
```

**Suspendre un profil**
```http
POST /api/admin/profils/{id}/suspendre-temp
Content-Type: application/json

{
  "duree": 7,
  "raison": "Stock incohérent détecté"
}
```

**Avertir un profil**
```http
POST /api/admin/profils/{id}/avertir
Content-Type: application/json

{
  "raison": "Délai de livraison non respecté",
  "details": "3 retards en 2 semaines"
}
```

**Bloquer un profil**
```http
POST /api/admin/profils/{id}/bloquer
Content-Type: application/json

{
  "raison": "Activité frauduleuse confirmée"
}
```

**Envoyer un message**
```http
POST /api/admin/profils/{id}/message
Content-Type: application/json

{
  "sujet": "Correction requise",
  "contenu": "Veuillez corriger vos informations de profil..."
}
```

**Historique des actions**
```http
GET /api/admin/profils/{id}/historique-actions
```

#### Gestion des rôles

**Assigner un rôle**
```http
POST /api/admin/utilisateurs/{id}/role
Content-Type: application/json

{
  "role": "ROLE_PRODUCTEUR"
}
```

**Retirer un rôle**
```http
DELETE /api/admin/utilisateurs/{id}/role/ROLE_PRODUCTEUR
```

#### Statistiques

**Obtenir les statistiques**
```http
GET /api/admin/statistiques
```

**Générer un rapport**
```http
GET /api/admin/rapports/moderation?dateDebut=2026-04-01&dateFin=2026-04-30
```

**Exporter un profil**
```http
GET /api/admin/profils/{id}/export
```

### 🗄️ Modèles de données requis

#### Entité Utilisateur
```java
@Entity
@Table(name = "utilisateurs")
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nom;
    private String email;
    private String telephone;
    private String role;
    private String statut; // Actif, Suspendu, Bloqué, etc.
    private String localisation;
    private LocalDateTime dateInscription;
    private LocalDateTime derniereActivite;
    private Integer scoreConfiance;
    private Integer nbSignalements;
    private Double note;
    
    // Champs pour modération
    private LocalDateTime dateSuspension;
    private Integer dureeSuspension;
    private LocalDateTime dateBlocage;
    
    // Relations
    @OneToMany(mappedBy = "utilisateur")
    private List<ActionModeration> actions;
}
```

#### Entité ActionModeration
```java
@Entity
@Table(name = "actions_moderation")
public class ActionModeration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;
    
    private String type; // SUSPENSION, AVERTISSEMENT, etc.
    private String description;
    private String raison;
    private LocalDateTime dateAction;
    private Long moderateurId;
    private String statut; // EFFECTUEE, EN_ATTENTE, REJETEE
}
```

### 🔧 Configuration

#### Dependencies (pom.xml)
```xml
<!-- MapStruct -->
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
</dependency>

<!-- Lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>

<!-- Spring Data JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

#### application.yml
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        
logging:
  level:
    com.agrima.userservice: DEBUG
    org.springframework.security: DEBUG
```

### 📊 Flows de modération

#### Flow 1: Validation d'un profil
```
1. Admin clique sur "Valider"
2. POST /api/admin/profils/{id}/valider
3. AdminService.validerProfil() exécuté
4. Statut changé en "Validé"
5. ActionModeration enregistrée
6. Notification envoyée à l'utilisateur
```

#### Flow 2: Suspension temporaire
```
1. Admin sélectionne "Suspendre"
2. Saisit durée (jours) et raison
3. POST /api/admin/profils/{id}/suspendre-temp
4. AdminService.suspendreTemporairement() exécuté
5. Statut changé en "Suspendu"
6. Dates de suspension enregistrées
7. Email de notification envoyé
```

#### Flow 3: Blocage définitif
```
1. Admin sélectionne "Bloquer"
2. Confirmation requise
3. POST /api/admin/profils/{id}/bloquer
4. AdminService.bloquerProfil() exécuté
5. Statut changé en "Bloqué"
6. Date de blocage enregistrée
7. Email critique envoyé
8. Profil inactif immédiatement
```

### 🧪 Tests

#### Test unitaire exemple
```java
@SpringBootTest
@ActiveProfiles("test")
public class AdminServiceTest {

    @MockBean
    private UtilisateurRepository utilisateurRepository;

    @InjectMocks
    private AdminService adminService;

    @Test
    public void testValiderProfil() {
        // Given
        Utilisateur user = new Utilisateur();
        user.setId(1L);
        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(user));

        // When
        ProfilAdminDTO result = adminService.validerProfil(1L, "Raison test");

        // Then
        assertEquals("Validé", result.getStatut());
    }
}
```

### 🚀 Déploiement

1. **Build Maven**
   ```bash
   mvn clean package -DskipTests
   ```

2. **Run application**
   ```bash
   java -jar user-service-1.0.0.jar
   ```

3. **Vérifier les endpoints**
   ```bash
   curl http://localhost:8080/api/admin/statistiques \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

### 📝 Checklist d'implémentation

- [ ] Entités Utilisateur et ActionModeration créées
- [ ] Repositories implémentés
- [ ] AdminService codé
- [ ] AdminController créé
- [ ] DTOs définis
- [ ] Mapper MapStruct configuré
- [ ] Security configurée
- [ ] Endpoints testés
- [ ] Logging ajouté
- [ ] Documentation rédigée

### 🔗 Intégration Frontend

Le frontend s'attend aux endpoints suivants:

```typescript
// Exemple d'appel HTTP depuis AdminService frontend
this.http.get<ProfilAdmin[]>('/api/admin/profils')
  .subscribe(profils => this.profilsSubject.next(profils));
```

**Base URL**: `http://localhost:8080` (en développement)

### 📞 Support

Pour toute question ou problème:
1. Vérifiez les logs: `logs/user-service.log`
2. Testez les endpoints avec Postman
3. Confirmez l'authentification
4. Vérifiez les permissions (rôle ADMIN)

---

**Version**: 1.0  
**Last Updated**: 20 avril 2026
