# 🚀 Guide de Déploiement - AGRIMA

Ce guide vous aide à déployer la plateforme AGRIMA en production.

## 📋 Prérequis

- Node.js 18+ et npm 9+
- Angular CLI 19+
- Accès au serveur
- Certificat SSL/TLS

## 🔧 Préparation pour Production

### 1. Vérification du Code

```bash
# Linter
npm run lint

# Tests
npm run test

# Build de test
npm run build:test
```

### 2. Variables d'Environnement

Créez un fichier `.env.production`:

```env
# API Endpoints
API_URL=https://api.agrima.com
PRODUCT_SERVICE=https://api.agrima.com/products
ORDER_SERVICE=https://api.agrima.com/orders
AUTH_SERVICE=https://api.agrima.com/auth

# Analytics
GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X

# Support
SUPPORT_EMAIL=support@agrima.com
SUPPORT_PHONE=+33612345678
```

### 3. Build Production

```bash
# Build optimisé
npm run build:prod

# Le dossier dist/ contient les fichiers prêts pour production
```

## 🌐 Déploiement

### Option 1: Netlify

```bash
# Installation
npm install -g netlify-cli

# Déploiement
netlify deploy --prod --dir=dist/agrima/browser
```

### Option 2: Vercel

```bash
# Installation
npm install -g vercel

# Déploiement
vercel --prod
```

### Option 3: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/agrima/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build
docker build -t agrima:latest .

# Run
docker run -p 80:80 agrima:latest
```

## 🔐 Configuration Sécurité

### Content Security Policy

```html
<!-- Dans index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;">
```

### CORS

```typescript
// Backend configuration
app.use(cors({
  origin: 'https://agrima.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
```

## 📊 Configuration Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name agrima.com www.agrima.com;

    ssl_certificate /etc/letsencrypt/live/agrima.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/agrima.com/privkey.pem;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Angular app
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://api.agrima.local/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🚨 Monitoring & Logging

### Application Insights (Azure)

```typescript
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: 'YOUR_INSTRUMENTATION_KEY'
  }
});
appInsights.loadAppInsights();
```

### Error Tracking (Sentry)

```typescript
import * as Sentry from "@sentry/angular";

Sentry.init({
  dsn: "https://xxx@xxx.ingest.sentry.io/xxx",
  environment: 'production'
});
```

## 📈 Performance

### Lighthouse Audits

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse https://agrima.com --view
```

### Web Vitals

- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      - run: npm install
      - run: npm run lint
      - run: npm run test
      - run: npm run build:prod
      - name: Deploy
        run: npm run deploy:prod
```

## ✅ Post-Déploiement

- [ ] Vérifier que l'app charge
- [ ] Tester tous les flux utilisateur
- [ ] Vérifier les APIs de backend
- [ ] Tester sur différents navigateurs
- [ ] Vérifier les performances
- [ ] Monitor les erreurs
- [ ] Configurer les alertes

## 🆘 Rollback

```bash
# En cas de problème
vercel rollback

# Ou redéployer la version précédente
npm run deploy:prod --version=1.0.0
```

---

Pour toute question, consultez la documentation ou contactez le support.
