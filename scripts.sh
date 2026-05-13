#!/bin/bash

# ============================================================
# AGRIMA Admin Dashboard - Commandes utiles
# ============================================================
# Ce script fournit les commandes courantes pour développer
# et déployer le dashboard administrateur AGRIMA
# ============================================================

# ============================================================
# 🖥️ FRONTEND - Angular
# ============================================================

echo "📦 INSTALLATION FRONTEND"
install_frontend() {
    cd frontend/web
    npm install
    npm update
    cd ../..
    echo "✅ Frontend installé"
}

echo "🚀 DÉMARRAGE FRONTEND"
start_frontend() {
    cd frontend/web
    ng serve --open
}

echo "🔨 BUILD FRONTEND"
build_frontend() {
    cd frontend/web
    ng build
    echo "✅ Build frontend complet"
}

echo "🧪 TESTS FRONTEND"
test_frontend() {
    cd frontend/web
    ng test --watch=false
}

echo "🧪 TESTS E2E FRONTEND"
test_frontend_e2e() {
    cd frontend/web
    ng e2e
}

echo "🧹 LINT FRONTEND"
lint_frontend() {
    cd frontend/web
    ng lint
}

echo "📊 BUNDLE ANALYSIS FRONTEND"
analyze_frontend() {
    cd frontend/web
    ng build --stats-json
    npm install -g webpack-bundle-analyzer
    webpack-bundle-analyzer dist/agrima/stats.json
}

# ============================================================
# 🔧 BACKEND - Spring Boot & Maven
# ============================================================

echo "📦 INSTALLATION BACKEND"
install_backend() {
    cd backend/user-service
    mvn clean install
    cd ../..
    echo "✅ Backend installé"
}

echo "🚀 DÉMARRAGE BACKEND"
start_backend() {
    cd backend/user-service
    mvn spring-boot:run
}

echo "🔨 BUILD BACKEND"
build_backend() {
    cd backend/user-service
    mvn clean package -DskipTests
    echo "✅ Build backend complet"
}

echo "🧪 TESTS BACKEND"
test_backend() {
    cd backend/user-service
    mvn clean test
}

echo "✔️ VÉRIFIER QUALITÉ BACKEND"
check_backend_quality() {
    cd backend/user-service
    mvn clean verify checkstyle:checkstyle
}

echo "🔍 LINTER BACKEND"
lint_backend() {
    cd backend/user-service
    mvn spotbugs:check pmd:check
}

# ============================================================
# 🗄️ DATABASE - PostgreSQL
# ============================================================

echo "🐘 CRÉER BASE DE DONNÉES"
create_database() {
    psql -U postgres -c "CREATE DATABASE agrima;"
    psql -U postgres -c "CREATE USER agrima_user WITH PASSWORD 'secure_password';"
    psql -U postgres -c "ALTER ROLE agrima_user SET client_encoding TO 'utf8';"
    psql -U postgres -c "ALTER ROLE agrima_user SET default_transaction_isolation TO 'read committed';"
    psql -U postgres -c "ALTER ROLE agrima_user SET default_transaction_deferrable TO on;"
    psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE agrima TO agrima_user;"
    echo "✅ Base de données créée"
}

echo "🔄 RÉINITIALISER BASE DE DONNÉES"
reset_database() {
    psql -U postgres -c "DROP DATABASE IF EXISTS agrima;"
    psql -U postgres -c "DROP USER IF EXISTS agrima_user;"
    create_database
}

echo "📊 SAUVEGARDE BASE DE DONNÉES"
backup_database() {
    pg_dump -U agrima_user agrima > agrima_backup_$(date +%Y%m%d_%H%M%S).sql
    echo "✅ Sauvegarde complétée"
}

echo "📥 RESTAURER BASE DE DONNÉES"
restore_database() {
    read -p "Fichier de sauvegarde: " backup_file
    psql -U agrima_user agrima < $backup_file
    echo "✅ Restauration complétée"
}

# ============================================================
# 🐳 DOCKER
# ============================================================

echo "🐳 BUILD DOCKER"
docker_build() {
    echo "Frontend..."
    docker build -t agrima-frontend:latest ./frontend/web
    echo "Backend..."
    docker build -t agrima-backend:latest ./backend/user-service
    echo "✅ Images Docker créées"
}

echo "🐳 LANCER AVEC DOCKER COMPOSE"
docker_up() {
    docker-compose up -d
    echo "✅ Containers lancés"
}

echo "🐳 ARRÊTER DOCKER COMPOSE"
docker_down() {
    docker-compose down
    echo "✅ Containers arrêtés"
}

echo "🐳 LOGS DOCKER"
docker_logs() {
    docker-compose logs -f
}

echo "🐳 NETTOYER DOCKER"
docker_clean() {
    docker system prune -a
    echo "✅ Docker nettoyé"
}

# ============================================================
# 🧪 TESTING
# ============================================================

echo "✅ TOUS LES TESTS"
run_all_tests() {
    echo "Tests Frontend..."
    test_frontend
    echo "Tests Backend..."
    test_backend
    echo "✅ Tous les tests complétés"
}

echo "📝 TEST ENDPOINTS AVEC CURL"
test_endpoints() {
    echo "Tester GET /api/admin/profils..."
    curl -X GET http://localhost:8080/api/admin/profils \
        -H "Authorization: Bearer YOUR_TOKEN" \
        -H "Content-Type: application/json"
    
    echo "\nTester GET /api/admin/statistiques..."
    curl -X GET http://localhost:8080/api/admin/statistiques \
        -H "Authorization: Bearer YOUR_TOKEN" \
        -H "Content-Type: application/json"
}

echo "🛠️ TEST AVEC POSTMAN"
test_postman() {
    postman collections export ./postman_collection.json
    postman runner execute ./postman_collection.json
}

# ============================================================
# 📋 UTILITAIRES
# ============================================================

echo "🧹 CLEAN ALL"
clean_all() {
    echo "Nettoyage..."
    rm -rf frontend/web/node_modules
    rm -rf frontend/web/dist
    rm -rf backend/user-service/target
    rm -rf backend/user-service/.m2
    echo "✅ Nettoyage complet"
}

echo "📊 STATUS DU SYSTÈME"
system_status() {
    echo "=== Frontend ==="
    cd frontend/web
    npm list | head -10
    cd ../..
    
    echo -e "\n=== Backend ==="
    cd backend/user-service
    mvn dependency:tree | head -10
    cd ../..
    
    echo -e "\n=== Base de données ==="
    psql -U agrima_user -d agrima -c "SELECT COUNT(*) FROM utilisateurs;" 2>/dev/null || echo "BD non disponible"
    
    echo -e "\n=== Services ==="
    curl -s http://localhost:4200 > /dev/null && echo "Frontend: ✅ Actif" || echo "Frontend: ❌ Inactif"
    curl -s http://localhost:8080/health > /dev/null && echo "Backend: ✅ Actif" || echo "Backend: ❌ Inactif"
}

echo "📦 RELEASE VERSION"
release_version() {
    read -p "Nouvelle version (ex: 1.0.1): " version
    
    # Update package.json
    npm version $version --prefix frontend/web
    
    # Update pom.xml
    mvn versions:set -DnewVersion=$version -f backend/user-service/pom.xml
    
    echo "✅ Version mise à jour en $version"
}

echo "🚀 DÉPLOIEMENT PRODUCTION"
deploy_production() {
    echo "1. Building..."
    build_frontend
    build_backend
    
    echo "2. Testing..."
    test_frontend
    test_backend
    
    echo "3. Pushing to production..."
    docker_build
    docker push agrima-frontend:latest
    docker push agrima-backend:latest
    
    echo "✅ Déploiement complété"
}

# ============================================================
# HELP
# ============================================================

show_help() {
    echo "
    ╔════════════════════════════════════════════════════════════╗
    ║  AGRIMA Admin Dashboard - Commandes utiles                 ║
    ╚════════════════════════════════════════════════════════════╝
    
    🖥️  FRONTEND (Angular)
        install_frontend              # Installer dépendances
        start_frontend                # Démarrer ng serve
        build_frontend                # Build production
        test_frontend                 # Tests unitaires
        test_frontend_e2e             # Tests E2E
        lint_frontend                 # Vérifier code
        analyze_frontend              # Analyser bundle

    🔧 BACKEND (Spring Boot)
        install_backend               # Installer dépendances
        start_backend                 # Démarrer Spring Boot
        build_backend                 # Build JAR
        test_backend                  # Tests unitaires
        check_backend_quality         # Vérifier qualité
        lint_backend                  # Analyse statique

    🗄️  DATABASE (PostgreSQL)
        create_database               # Créer BD + utilisateur
        reset_database                # Réinitialiser BD
        backup_database               # Sauvegarder BD
        restore_database              # Restaurer BD

    🐳 DOCKER
        docker_build                  # Build images
        docker_up                     # Lancer docker-compose
        docker_down                   # Arrêter services
        docker_logs                   # Voir logs
        docker_clean                  # Nettoyer système

    🧪 TESTING
        run_all_tests                 # Tous les tests
        test_endpoints                # Tester API (curl)
        test_postman                  # Tester avec Postman

    📋 UTILS
        clean_all                     # Nettoyer tous les builds
        system_status                 # Status du système
        release_version               # Mettre à jour version
        deploy_production             # Build + test + push
        show_help                     # Afficher cette aide

    ╔════════════════════════════════════════════════════════════╗
    ║  Exemple d'utilisation:                                    ║
    ║  $ source scripts.sh                                       ║
    ║  $ install_frontend                                        ║
    ║  $ start_frontend                                          ║
    ║  $ start_backend                                           ║
    ╚════════════════════════════════════════════════════════════╝
    "
}

# ============================================================
# Main Menu
# ============================================================

if [ -z "$1" ]; then
    show_help
else
    $1
fi
