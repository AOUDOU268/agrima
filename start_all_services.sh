#!/bin/bash

# ============================================================================
# Script de Lancement de Tous les Services - AGRIMA (Linux/Mac/WSL)
# ============================================================================
# Description: Lance tous les services backend en parallèle
# Utilisation: bash start_all_services.sh
# ============================================================================

set -e

BACKEND_PATH="${BACKEND_PATH:-.}"
START_DELAY=${START_DELAY:-2}
SKIP_BUILD=${SKIP_BUILD:-false}
VERBOSE=${VERBOSE:-false}

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Services à lancer
declare -a SERVICES=(
    "discovery-server:8761:Eureka Service Discovery"
    "config-server:8888:Configuration Server"
    "api-gateway:8080:API Gateway"
    "auth-service:8081:Authentication Service"
    "user-service:8082:User Service"
    "product-service:8083:Product Service"
    "order-service:8084:Order Service"
    "payment-service:8085:Payment Service"
    "delivery-service:8086:Delivery Service"
    "notification-service:8087:Notification Service"
    "chat-service:8088:Chat Service"
)

# Fonctions
write_header() {
    echo -e "${CYAN}========================================================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}========================================================================${NC}"
}

write_success() {
    echo -e "${GREEN}✓ $@${NC}"
}

write_info() {
    echo -e "${CYAN}ℹ $@${NC}"
}

write_warning() {
    echo -e "${YELLOW}⚠ $@${NC}"
}

write_error() {
    echo -e "${RED}✗ $@${NC}"
}

# Vérifier le chemin backend
if [ ! -d "$BACKEND_PATH" ]; then
    write_error "Backend path not found: $BACKEND_PATH"
    exit 1
fi

write_header "AGRIMA - Lancement de tous les services"
write_info "Backend path: $BACKEND_PATH"
write_info "Total services: ${#SERVICES[@]}"

# Construction si nécessaire
if [ "$SKIP_BUILD" = "false" ]; then
    write_header "ÉTAPE 1: Construction Maven"
    
    cd "$BACKEND_PATH"
    write_info "Building parent project..."
    
    mvn clean install -DskipTests -q
    
    if [ $? -ne 0 ]; then
        write_error "Maven build failed!"
        exit 1
    fi
    
    write_success "Maven build completed successfully"
    cd - > /dev/null
else
    write_info "Skipping Maven build (SKIP_BUILD=true)"
fi

# Vérifier les ports disponibles
write_header "ÉTAPE 2: Vérification des ports"

BUSY_PORTS=()
for service_info in "${SERVICES[@]}"; do
    IFS=':' read -r SERVICE_NAME PORT DESC <<< "$service_info"
    
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        BUSY_PORTS+=("$SERVICE_NAME:$PORT")
        write_warning "Port $PORT is already in use ($SERVICE_NAME)"
    else
        write_success "Port $PORT is available ($SERVICE_NAME)"
    fi
done

if [ ${#BUSY_PORTS[@]} -gt 0 ]; then
    write_warning "Some ports are already in use. Previous instances may be running."
    write_info "You can kill them with: killall java"
    
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        write_info "Cancelled"
        exit 0
    fi
fi

# Lancer les services
write_header "ÉTAPE 3: Lancement des services"
write_info "Services will start in order with $START_DELAY second delay between each"

PIDS=()

for service_info in "${SERVICES[@]}"; do
    IFS=':' read -r SERVICE_NAME PORT DESC <<< "$service_info"
    
    write_info "Launching $SERVICE_NAME (port $PORT)..."
    
    JAR_PATH="$BACKEND_PATH/$SERVICE_NAME/target/$SERVICE_NAME-0.0.1-SNAPSHOT.jar"
    
    if [ ! -f "$JAR_PATH" ]; then
        write_error "JAR not found: $JAR_PATH"
        write_warning "Skipping $SERVICE_NAME"
        continue
    fi
    
    # Lancer en arrière-plan
    java -jar "$JAR_PATH" > /dev/null 2>&1 &
    PID=$!
    
    if [ $? -eq 0 ]; then
        PIDS+=("$SERVICE_NAME:$PID:$PORT")
        write_success "$SERVICE_NAME launched (PID: $PID)"
    else
        write_error "Failed to launch $SERVICE_NAME"
    fi
    
    sleep $START_DELAY
done

# Résumé
write_header "RÉSUMÉ DE LANCEMENT"
write_success "Total services launched: ${#PIDS[@]}/${#SERVICES[@]}"

echo -e "\n${YELLOW}Services running:${NC}"
for pid_info in "${PIDS[@]}"; do
    IFS=':' read -r SERVICE_NAME PID PORT <<< "$pid_info"
    echo -e "  ${GREEN}•${NC} $SERVICE_NAME (PID: $PID, Port: $PORT)"
done

if [ ${#BUSY_PORTS[@]} -gt 0 ]; then
    echo -e "\n${YELLOW}Ports already in use:${NC}"
    for busy_port in "${BUSY_PORTS[@]}"; do
        IFS=':' read -r SERVICE_NAME PORT <<< "$busy_port"
        echo -e "  ${YELLOW}•${NC} $SERVICE_NAME (Port: $PORT)"
    done
fi

echo -e "\n${CYAN}Services de base à vérifier:${NC}"
echo -e "  ${CYAN}•${NC} Discovery Server: http://localhost:8761"
echo -e "  ${CYAN}•${NC} Config Server: http://localhost:8888"
echo -e "  ${CYAN}•${NC} API Gateway: http://localhost:8080"
echo -e "  ${CYAN}•${NC} User Service: http://localhost:8082"

echo -e "\n${CYAN}Commandes utiles:${NC}"
echo -e "  ${CYAN}•${NC} Afficher les logs: tail -f /path/to/service.log"
echo -e "  ${CYAN}•${NC} Arrêter tout: killall java"

write_info "All services are starting. Check logs for startup errors."

# Garder le script actif
while true; do
    sleep 5
done
