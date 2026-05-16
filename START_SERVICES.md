# 🚀 Commandes pour Lancer les Services AGRIMA

## 📋 Vue d'ensemble

Votre architecture comporte **11 services** qui doivent être lancés:

| Service | Port | Description |
|---------|------|-------------|
| **discovery-server** | 8761 | Eureka Service Discovery |
| **config-server** | 8888 | Configuration Server |
| **api-gateway** | 8080 | API Gateway |
| **auth-service** | 8081 | Service d'Authentification |
| **user-service** | 8082 | Service Utilisateurs |
| **product-service** | 8083 | Service Produits |
| **order-service** | 8084 | Service Commandes |
| **payment-service** | 8085 | Service Paiements |
| **delivery-service** | 8086 | Service Livraisons |
| **notification-service** | 8087 | Service Notifications |
| **chat-service** | 8088 | Service Chat |

---

## 🟢 Option 1: Lancer TOUS les services automatiquement (RECOMMANDÉ)

### Windows (PowerShell)

```powershell
# Lancement automatique avec construction
powershell -ExecutionPolicy Bypass -File start_all_services.ps1

# Ou sans construction (si déjà builté)
powershell -ExecutionPolicy Bypass -File start_all_services.ps1 -SkipBuild

# Avec mode verbose pour voir plus de détails
powershell -ExecutionPolicy Bypass -File start_all_services.ps1 -Verbose
```

### Linux/Mac/WSL

```bash
# Lancement automatique avec construction
bash start_all_services.sh

# Ou sans construction
SKIP_BUILD=true bash start_all_services.sh

# Avec mode verbose
VERBOSE=true bash start_all_services.sh
```

**Ce que le script fait:**
✅ Compile tout le projet Maven (`clean install`)
✅ Vérifie les ports disponibles
✅ Lance les services dans l'ordre correct
✅ Attend les services (délai de 2s entre chaque)
✅ Affiche un résumé avec PID et ports
✅ Maintient les services actifs

---

## 🟡 Option 2: Lancer les services individuellement

### Service Discovery (OBLIGATOIRE - à lancer en premier)

```bash
# Windows
cd C:\Stage_L5_MIT\Applications\agrima\backend\discovery-server
mvn spring-boot:run

# Ou avec JAR
java -jar target/discovery-server-0.0.1-SNAPSHOT.jar

# Linux/Mac
cd ~/Stage_L5_MIT/Applications/agrima/backend/discovery-server
mvn spring-boot:run
```

**URL:** http://localhost:8761

---

### Configuration Server (RECOMMANDÉ - à lancer en 2ème)

```bash
# Windows
cd C:\Stage_L5_MIT\Applications\agrima\backend\config-server
mvn spring-boot:run

# Linux/Mac
cd ~/Stage_L5_MIT/Applications/agrima/backend/config-server
mvn spring-boot:run
```

**URL:** http://localhost:8888

---

### API Gateway

```bash
# Windows
cd C:\Stage_L5_MIT\Applications\agrima\backend\api-gateway
mvn spring-boot:run

# Linux/Mac
cd ~/Stage_L5_MIT/Applications\agrima\backend\api-gateway
mvn spring-boot:run
```

**URL:** http://localhost:8080

---

### Service Utilisateurs

```bash
# Windows
cd C:\Stage_L5_MIT\Applications\agrima\backend\user-service
mvn spring-boot:run

# Linux/Mac
cd ~/Stage_L5_MIT/Applications/agrima/backend/user-service
mvn spring-boot:run
```

**URL:** http://localhost:8082
**API:** http://localhost:8082/api/users

---

### Autres services (même pattern)

```bash
# Product Service
cd C:\Stage_L5_MIT\Applications\agrima\backend\product-service
mvn spring-boot:run

# Order Service
cd C:\Stage_L5_MIT\Applications\agrima\backend\order-service
mvn spring-boot:run

# Payment Service
cd C:\Stage_L5_MIT\Applications\agrima\backend\payment-service
mvn spring-boot:run

# Delivery Service
cd C:\Stage_L5_MIT\Applications\agrima\backend\delivery-service
mvn spring-boot:run

# Notification Service
cd C:\Stage_L5_MIT\Applications\agrima\backend\notification-service
mvn spring-boot:run

# Chat Service
cd C:\Stage_L5_MIT\Applications\agrima\backend\chat-service
mvn spring-boot:run

# Auth Service
cd C:\Stage_L5_MIT\Applications\agrima\backend\auth-service
mvn spring-boot:run
```

---

## 🔵 Option 3: Utiliser les JAR directement (plus rapide)

**D'abord, compiler une seule fois:**
```powershell
cd C:\Stage_L5_MIT\Applications\agrima\backend
mvn clean package -DskipTests -q
```

**Puis lancer les services avec Java:**
```bash
# En parallèle dans des terminaux séparés:
java -jar C:\Stage_L5_MIT\Applications\agrima\backend\discovery-server\target\discovery-server-0.0.1-SNAPSHOT.jar
java -jar C:\Stage_L5_MIT\Applications\agrima\backend\config-server\target\config-server-0.0.1-SNAPSHOT.jar
java -jar C:\Stage_L5_MIT\Applications\agrima\backend\api-gateway\target\api-gateway-0.0.1-SNAPSHOT.jar
java -jar C:\Stage_L5_MIT\Applications\agrima\backend\auth-service\target\auth-service-0.0.1-SNAPSHOT.jar
java -jar C:\Stage_L5_MIT\Applications\agrima\backend\user-service\target\user-service-0.0.1-SNAPSHOT.jar
java -jar C:\Stage_L5_MIT\Applications\agrima\backend\product-service\target\product-service-0.0.1-SNAPSHOT.jar
java -jar C:\Stage_L5_MIT\Applications\agrima\backend\order-service\target\order-service-0.0.1-SNAPSHOT.jar
java -jar C:\Stage_L5_MIT\Applications\agrima\backend\payment-service\target\payment-service-0.0.1-SNAPSHOT.jar
java -jar C:\Stage_L5_MIT\Applications\agrima\backend\delivery-service\target\delivery-service-0.0.1-SNAPSHOT.jar
java -jar C:\Stage_L5_MIT\Applications\agrima\backend\notification-service\target\notification-service-0.0.1-SNAPSHOT.jar
java -jar C:\Stage_L5_MIT\Applications\agrima\backend\chat-service\target\chat-service-0.0.1-SNAPSHOT.jar
```

---

## 📊 Vérifier le statut des services

### Vérifier les ports actifs (PowerShell)

```powershell
# Voir tous les services Java actifs
Get-Process java | Select-Object Name, Id

# Vérifier un port spécifique
Get-NetTcpConnection -LocalPort 8082 -ErrorAction SilentlyContinue | Select-Object State, OwningProcess

# Vérifier plusieurs ports
8761, 8888, 8080, 8082, 8083, 8084, 8085, 8086, 8087, 8088 | ForEach-Object {
    $port = $_
    $conn = Get-NetTcpConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conn) {
        Write-Host "Port $port: ACTIF" -ForegroundColor Green
    } else {
        Write-Host "Port $port: INACTIF" -ForegroundColor Red
    }
}
```

### Vérifier les ports actifs (Linux/Mac)

```bash
# Voir tous les services Java actifs
ps aux | grep java

# Vérifier un port spécifique
lsof -i :8082

# Vérifier plusieurs ports
for port in 8761 8888 8080 8082 8083 8084 8085 8086 8087 8088; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null; then
        echo "Port $port: ACTIF ✓"
    else
        echo "Port $port: INACTIF ✗"
    fi
done
```

---

## 🌐 Tester les services

### Health Check (à faire après le lancement)

```bash
# Health check général
curl http://localhost:8080/actuator/health

# Service Utilisateur
curl http://localhost:8082/actuator/health

# API Utilisateurs
curl http://localhost:8082/api/users
```

### Test complet avec script

```powershell
# Lancer le script de test complet
powershell -ExecutionPolicy Bypass -File test_api_complete.ps1
```

### Via Postman

```bash
# Importer la collection
postman_collection.json
```

---

## 🛑 Arrêter les services

### Windows (PowerShell)

```powershell
# Arrêter TOUS les services Java
taskkill /F /IM java.exe

# Ou tuer un processus spécifique par PID
taskkill /F /PID 12345

# Ou arrêter par port
Get-Process | Where-Object { $_.Name -eq "java" } | Stop-Process -Force
```

### Linux/Mac

```bash
# Arrêter TOUS les services Java
killall java

# Ou utiliser pkill
pkill -f "java.*jar"

# Ou tuer un processus spécifique par PID
kill -9 12345
```

---

## 🔄 Redémarrer les services

### Option rapide (récompilation + redémarrage)

```powershell
# Windows
taskkill /F /IM java.exe
powershell -ExecutionPolicy Bypass -File start_all_services.ps1
```

```bash
# Linux/Mac
killall java
bash start_all_services.sh
```

---

## ⚙️ Dépannage

### Port déjà en utilisation

```powershell
# Trouver le processus utilisant le port
Get-NetTcpConnection -LocalPort 8082

# Arrêter ce processus
taskkill /F /PID <PID>

# Ou arrêter tous les Java
taskkill /F /IM java.exe
```

### Maven build échoue

```powershell
# Nettoyer le cache Maven
mvn clean

# Recompiler
mvn install -DskipTests -q

# En cas de problème de dépendances
mvn dependency:resolve
```

### Service ne démarre pas

```bash
# Vérifier les logs
# (Cherchez les erreurs dans la sortie console)

# Vérifier que la base de données est accessible
# PostgreSQL doit tourner sur localhost:5432

# Vérifier les ports
netstat -ano | findstr :8082  # Windows
lsof -i :8082                 # Linux/Mac
```

---

## 📝 Ordre de lancement recommandé

Si vous lancez manuellement, respectez cet ordre:

1. **discovery-server** (port 8761) - Eureka
2. **config-server** (port 8888) - Configuration centralisée
3. **api-gateway** (port 8080) - Point d'entrée
4. **Autres services** (8081-8088) - Dans n'importe quel ordre

**Attendre 5-10 secondes entre chaque pour que la découverte fonctionne.**

---

## 📱 Frontend

### Web Frontend

```bash
cd C:\Stage_L5_MIT\Applications\agrima\frontend\web

# Installer les dépendances
npm install

# Lancer en développement
npm start

# URL: http://localhost:4200
```

### Mobile (si disponible)

```bash
cd C:\Stage_L5_MIT\Applications\agrima\frontend\mobile

# Installer les dépendances
npm install

# Lancer
npm start
```

---

## 🎯 Commande rapide - Copier-coller

### Windows - Tout d'un coup
```powershell
cd C:\Stage_L5_MIT\Applications\agrima
powershell -ExecutionPolicy Bypass -File start_all_services.ps1
```

### Linux/Mac - Tout d'un coup
```bash
cd ~/Stage_L5_MIT/Applications/agrima
bash start_all_services.sh
```

---

## 📊 Monitoring

### Voir les services Java actifs

```powershell
# Windows
Get-Process java

# Linux/Mac
ps aux | grep java
```

### Voir l'utilisation des ressources

```powershell
# Windows
Get-Process java | Format-Table Name, Id, Memory, CPU, Handles

# Linux/Mac
top -p $(pgrep -d, java)
```

---

**Dernière mise à jour:** 25 avril 2026

