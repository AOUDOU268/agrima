# Guide de Configuration Local (PostgreSQL & RabbitMQ) - AGRIMA Backend

Ce document explique comment configurer votre environnement local pour tester le backend complet avec PostgreSQL et RabbitMQ.

## 1. Prérequis
- **Java 17** ou supérieur.
- **Maven** 3.8+.
- **PostgreSQL** installé et démarré.
- **RabbitMQ** installé et démarré (optionnel pour le CRUD simple, requis pour les flux inter-services).

## 2. Préparation de la Base de Données
Créez les bases de données suivantes dans votre instance PostgreSQL :

```sql
CREATE DATABASE auth_db;
CREATE DATABASE user_db;
CREATE DATABASE product_db;
CREATE DATABASE order_db;
CREATE DATABASE payment_db;
CREATE DATABASE delivery_db;
CREATE DATABASE notification_db;
CREATE DATABASE chat_db;
```

## 3. Configuration des Microservices
Dans chaque dossier de service (ex: `user-service/src/main/resources/`), modifiez le fichier `application.yml` :

### Exemple de configuration PostgreSQL
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/nom_de_la_base_db
    username: votre_utilisateur
    password: votre_password
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
```

### Activation de la Communication (RabbitMQ)
Si vous avez RabbitMQ localement, assurez-vous que la section `cloud.stream` est configurée (elle l'est par défaut sur le port 5672).

## 4. Lancement de l'Infrastructure (Ordre recommandé)
Pour un fonctionnement optimal, lancez les services dans cet ordre :

1.  **user-service** (Port 8082)
2.  **product-service** (Port 8081)
3.  **auth-service** (Port 8083)
4.  **api-gateway** (Port 8080) - **Point d'entrée unique**

*Note : Les autres services (order, payment, etc.) peuvent être lancés ensuite selon les besoins de vos tests.*

## 5. Test du Backend via la Gateway
Toutes les requêtes doivent passer par le port **8080**.

### Exemples de tests avec cURL :

**Créer un utilisateur :**
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "user@test.com", "nom": "Nom", "prenom": "Prenom", "role": "ROLE_CONSOMMATEUR"}'
```

**Lister les produits :**
```bash
curl http://localhost:8080/api/products
```

**Vérifier la santé de la Gateway :**
```bash
curl http://localhost:8080/gateway-health
```

## 6. Dépannage
- **Erreur de connexion DB** : Vérifiez que PostgreSQL écoute bien sur le port 5432 et que les identifiants sont corrects.
- **Service non trouvé** : Assurez-vous que le microservice cible est bien démarré avant de l'appeler via la Gateway.
- **Conflit de port** : Si le port 8080 est déjà utilisé, changez `server.port` dans le `application.yml` de l'API Gateway.

