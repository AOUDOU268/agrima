# 🤝 Guide de Contribution - AGRIMA

Merci de votre intérêt pour contribuer au projet AGRIMA! Ce guide présente les standards et conventions du projet.

## 📋 Code de Conduite

Nous nous engageons à maintenir une communauté accueillante et respectueuse. Tout comportement hautement offensant ou discriminatoire est inacceptable.

## 🎯 Conventions de Nommage

### Fichiers
```
- Components: kebab-case + .component.ts
  ✅ accueil.component.ts
  ❌ AccueilComponent.ts
  
- Services: kebab-case + .service.ts
  ✅ panier.service.ts
  ❌ panierService.ts
  
- Models: kebab-case + .ts
  ✅ produit.model.ts
  ❌ Produit.ts

- Dossiers: kebab-case
  ✅ src/app/pages/detail-produit/
  ❌ src/app/pages/DetailProduit/
```

### TypeScript/Angular
```typescript
// Classes
export class ProduitService { }  // PascalCase

// Interfaces
export interface Produit { }  // PascalCase

// Types
export type ProduitFilter = { };  // PascalCase

// Constantes
export const DELIVERY_MODES = [];  // UPPER_SNAKE_CASE

// Variables/Propriétés
private searchTerm = '';  // camelCase

// Méthodes
private calculateTotal(): number { }  // camelCase

// Booléens
isLoading = false;  // is/has/can prefix
canAddToCart = true;
hasError = false;
```

### HTML
```html
<!-- Attributs directives -->
[property]="value"     <!-- Property binding -->
(event)="handler()"     <!-- Event binding -->
[(ngModel)]="value"     <!-- Two-way binding -->
*ngIf="condition"       <!-- Structural directives -->

<!-- Classe CSS kebab-case -->
class="text-alibaba-red bg-gray-50"

<!-- ID et data attributes kebab-case -->
id="product-list"
data-test-id="add-to-cart-button"
```

## 🏗️ Architecture

### Structure des Dossiers
```
src/app/
├── components/          # Composants réutilisables (notifications, etc.)
├── pages/              # Pages/Routed components
│   ├── accueil/
│   ├── catalogue/
│   ├── detail-produit/
│   ├── panier/
│   ├── commande/
│   ├── connexion/
│   ├── profil/
│   └── suivi-commande/
├── layouts/            # Layout components (header, footer)
├── services/           # Services (logique métier)
├── models/             # Interfaces et types
├── interceptors/       # HTTP interceptors
├── state/              # État global (signals, etc.)
├── app.routes.ts       # Routes principales
├── app.component.ts    # Composant racine
└── app.config.ts       # Configuration app
```

### Service Pattern
```typescript
@Injectable({ providedIn: 'root' })
export class ProduitService {
  // Observables publiques
  private produitsSubject = new BehaviorSubject<Produit[]>([]);
  public produits$ = this.produitsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Getters pour les données actuelles
  getProduits(): Produit[] {
    return this.produitsSubject.value;
  }

  // Méthodes publiques
  chargerProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>('/api/produits').pipe(
      tap(data => this.produitsSubject.next(data))
    );
  }

  // Méthodes privées pour la logique
  private filterByCategory(produits: Produit[], category: string): Produit[] {
    return produits.filter(p => p.categorie === category);
  }
}
```

### Component Pattern
```typescript
@Component({
  selector: 'app-produit-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `...`,
  styleUrl: './produit-card.component.css'
})
export class ProduitCardComponent implements OnInit, OnDestroy {
  @Input() produit!: Produit;
  @Output() ajouterAuPanier = new EventEmitter<Produit>();
  
  private destroy$ = new Subject<void>();

  constructor(private service: ProduitService) {}

  ngOnInit(): void {
    // Initialization logic
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClick(): void {
    this.ajouterAuPanier.emit(this.produit);
  }
}
```

## 🎨 Styles et CSS

### Tailwind Classes
```html
<!-- Spacing -->
<div class="p-4 m-2 gap-4">
  
<!-- Colors - utiliser les couleurs AGRIMA -->
<button class="bg-alibaba-red text-white">

<!-- Responsive -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

<!-- Animations -->
<div class="hover:shadow-md transition-shadow">
```

### Variables CSS
```css
:root {
  --alibaba-red: #E82222;
  --primary: #E82222;
  --secondary: #666;
  --success: #4CAF50;
  --error: #F44336;
  --warning: #FF9800;
}
```

## ✅ Standards de Code

### TypeScript
```typescript
// ✅ BON
export class UserService {
  private users$ = new BehaviorSubject<User[]>([]);
  
  getUsers(): Observable<User[]> {
    return this.users$.asObservable();
  }
}

// ❌ MAUVAIS
export class UserService {
  users: User[] = [];
  getUsers() { return this.users; }
}

// ✅ BON - Méthodologie type-safe
const user = users.find(u => u.id === id);

// ❌ MAUVAIS
const user = users[0];
```

### RxJS Patterns
```typescript
// ✅ BON - Unsubscribe management
private destroy$ = new Subject<void>();

ngOnInit() {
  this.service.items$
    .pipe(takeUntil(this.destroy$))
    .subscribe(items => this.items = items);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}

// ✅ BON - Composable streams
const filtered$ = this.items$.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.search(term))
);
```

## 🧪 Tests

### Structure
```typescript
describe('ProduitService', () => {
  let service: ProduitService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProduitService]
    });
    service = TestBed.inject(ProduitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch produits', () => {
    service.chargerProduits().subscribe(data => {
      expect(data.length).toBe(2);
    });

    const req = httpMock.expectOne('/api/produits');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1 }, { id: 2 }]);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
```

## 🔄 Git Workflow

### Branches
```
main              # Production
├── develop       # Integration branch
├── feature/*     # Nouvelles fonctionnalités
├── fix/*         # Bug fixes
├── docs/*        # Documentation
└── ci/*          # CI/CD
```

### Commit Messages
```
git commit -m "feat: add shopping cart functionality"
git commit -m "fix: resolve navigation bug"
git commit -m "docs: update API documentation"
git commit -m "style: format code with prettier"
git commit -m "test: add unit tests for panier service"
git commit -m "refactor: restructure component hierarchy"
git commit -m "perf: optimize image loading"
```

Format: `<type>: <subject>`

Types:
- `feat` - Nouvelle fonctionnalité
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatage
- `test` - Tests
- `refactor` - Refactorisation
- `perf` - Performance
- `ci` - CI/CD

## 📝 Pull Request Process

1. Fork le repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request avec:
   - Description claire des changements
   - Reference aux issues (#123)
   - Screenshots/GIFs si applicable
   - Liste de checklist:
     ```
     - [ ] Code follows style guidelines
     - [ ] Tests added/updated
     - [ ] Documentation updated
     - [ ] No console errors/warnings
     ```

## 🐛 Reporting Issues

Template pour les issues:

```markdown
**Titre:** [Bug/Feature] Courte description

**Description:**
Description détaillée du problème

**Étapes pour reproduire:**
1. ...
2. ...
3. ...

**Résultat attendu:**
...

**Résultat réel:**
...

**Environnement:**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Angular Version: [e.g. 19.0.0]

**Screenshots:**
[Si applicable]
```

## 📚 Documentation

Tous les fichiers doivent avoir:

```typescript
/**
 * Services pour gérer les produits
 * 
 * @example
 * ```
 * const produits = await produitService.chargerProduits();
 * ```
 */
export class ProduitService {
  /**
   * Charge tous les produits
   * @returns Observable des produits
   */
  chargerProduits(): Observable<Produit[]> {
    // ...
  }
}
```

## ⚙️ Setup Local Development

```bash
# Clone
git clone https://github.com/agrima/agrima-ecommerce.git
cd agrima-ecommerce/frontend/web

# Install
npm install

# Development server
npm start

# Run tests
npm test

# Run linter
npm run lint

# Build
npm run build
```

## 🚀 Performance Guidelines

- Lazy load les routes
- Utilise `trackBy` dans `*ngFor`
- Désubscribe des Observables
- Optimise les images
- Utilise `ChangeDetectionStrategy.OnPush`
- Minimise les change detection

## 🔐 Sécurité

- Valide toujours les inputs
- Utilise DomSanitizer pour HTML dynamique
- Store tokens en `httpOnly` cookies, pas localStorage
- Implémente CSRF protection
- Utilise HTTPS en production

## 📞 Support

- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions
- **Discord:** [Lien Discord]
- **Email:** dev@agrima.com

---

Merci de contribuer à AGRIMA! 🌾
