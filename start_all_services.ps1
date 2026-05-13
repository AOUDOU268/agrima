# ============================================================================
# Script de Lancement de Tous les Services - AGRIMA
# ============================================================================
# Description: Lance tous les services backend en parallèle
# Utilisation: powershell -ExecutionPolicy Bypass -File start_all_services.ps1
# ============================================================================

param(
    [string]$BackendPath = "C:\Stage_L5_MIT\Applications\agrima\backend",
    [int]$StartDelaySeconds = 2,
    [switch]$SkipBuild = $false,
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Continue"

# Services à lancer
$services = @(
    @{ name = "discovery-server"; port = 8761; description = "Eureka Service Discovery" },
    @{ name = "config-server"; port = 8888; description = "Configuration Server" },
    @{ name = "api-gateway"; port = 8080; description = "API Gateway" },
    @{ name = "auth-service"; port = 8081; description = "Authentication Service" },
    @{ name = "user-service"; port = 8082; description = "User Service" },
    @{ name = "product-service"; port = 8083; description = "Product Service" },
    @{ name = "order-service"; port = 8084; description = "Order Service" },
    @{ name = "payment-service"; port = 8085; description = "Payment Service" },
    @{ name = "delivery-service"; port = 8086; description = "Delivery Service" },
    @{ name = "notification-service"; port = 8087; description = "Notification Service" },
    @{ name = "chat-service"; port = 8088; description = "Chat Service" }
)

function Write-Header {
    Write-Host "`n" + "="*70 -ForegroundColor Cyan
    Write-Host $args[0] -ForegroundColor Cyan -BackgroundColor DarkCyan
    Write-Host "="*70 -ForegroundColor Cyan
}

function Write-Success {
    Write-Host "✓ $($args -join ' ')" -ForegroundColor Green
}

function Write-Info {
    Write-Host "ℹ $($args -join ' ')" -ForegroundColor Cyan
}

function Write-Warning {
    Write-Host "⚠ $($args -join ' ')" -ForegroundColor Yellow
}

function Write-Error {
    Write-Host "✗ $($args -join ' ')" -ForegroundColor Red
}

# Vérifier que le chemin backend existe
if (-not (Test-Path $BackendPath)) {
    Write-Error "Backend path not found: $BackendPath"
    exit 1
}

Write-Header "AGRIMA - Lancement de tous les services"
Write-Info "Backend path: $BackendPath"
Write-Info "Total services: $($services.Count)"

# Construction si nécessaire
if (-not $SkipBuild) {
    Write-Header "ÉTAPE 1: Construction Maven"
    
    Push-Location $BackendPath
    Write-Info "Building parent project..."
    
    mvn clean install -DskipTests -q
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Maven build failed!"
        Pop-Location
        exit 1
    }
    
    Write-Success "Maven build completed successfully"
    Pop-Location
} else {
    Write-Info "Skipping Maven build (--SkipBuild flag)"
}

# Vérifier les ports disponibles
Write-Header "ÉTAPE 2: Vérification des ports"

$busyPorts = @()
foreach ($service in $services) {
    $connection = Get-NetTcpConnection -LocalPort $service.port -ErrorAction SilentlyContinue
    if ($connection) {
        $busyPorts += @{ service = $service.name; port = $service.port }
        Write-Warning "Port $($service.port) is already in use ($($service.name))"
    } else {
        Write-Success "Port $($service.port) is available ($($service.name))"
    }
}

if ($busyPorts.Count -gt 0) {
    Write-Warning "Some ports are already in use. Previous instances may be running."
    Write-Info "You can kill them with: taskkill /F /IM java.exe"
    
    $response = Read-Host "Continue anyway? (y/n)"
    if ($response -ne "y") {
        Write-Info "Cancelled"
        exit 0
    }
}

# Lancer les services
Write-Header "ÉTAPE 3: Lancement des services"
Write-Info "Services will start in order with $StartDelaySeconds second delay between each"

$processIds = @()

foreach ($service in $services) {
    Write-Info "Launching $($service.name) (port $($service.port))..."
    
    $jarPath = Join-Path $BackendPath "$($service.name)/target/$($service.name)-0.0.1-SNAPSHOT.jar"
    
    if (-not (Test-Path $jarPath)) {
        Write-Error "JAR not found: $jarPath"
        Write-Warning "Skipping $($service.name)"
        continue
    }
    
    # Lancer en arrière-plan
    $process = Start-Process -FilePath "java" `
        -ArgumentList "-jar", "`"$jarPath`"" `
        -NoNewWindow `
        -PassThru `
        -ErrorAction SilentlyContinue
    
    if ($process) {
        $processIds += @{ service = $service.name; pid = $process.Id; port = $service.port }
        Write-Success "$($service.name) launched (PID: $($process.Id))"
    } else {
        Write-Error "Failed to launch $($service.name)"
    }
    
    Start-Sleep -Seconds $StartDelaySeconds
}

# Résumé
Write-Header "RÉSUMÉ DE LANCEMENT"
Write-Success "Total services launched: $($processIds.Count)/$($services.Count)"

Write-Host "`nServices running:" -ForegroundColor Yellow
foreach ($pid in $processIds) {
    Write-Host "  • $($pid.service) (PID: $($pid.pid), Port: $($pid.port))" -ForegroundColor Green
}

if ($busyPorts.Count -gt 0) {
    Write-Host "`nPorts already in use:" -ForegroundColor Yellow
    foreach ($busy in $busyPorts) {
        Write-Host "  • $($busy.service) (Port: $($busy.port))" -ForegroundColor Yellow
    }
}

Write-Host "`nServices de base à vérifier:" -ForegroundColor Cyan
Write-Host "  • Discovery Server: http://localhost:8761" -ForegroundColor Cyan
Write-Host "  • Config Server: http://localhost:8888" -ForegroundColor Cyan
Write-Host "  • API Gateway: http://localhost:8080" -ForegroundColor Cyan
Write-Host "  • User Service: http://localhost:8082" -ForegroundColor Cyan

Write-Host "`nCommandes utiles:" -ForegroundColor Cyan
Write-Host "  • Afficher les logs: Get-Content 'C:\path\to\service.log'" -ForegroundColor Cyan
Write-Host "  • Arrêter tout: taskkill /F /IM java.exe" -ForegroundColor Cyan
Write-Host "  • Tester les services: powershell -ExecutionPolicy Bypass -File test_api_complete.ps1" -ForegroundColor Cyan

Write-Info "All services are starting. Check logs for startup errors."
Write-Info "Press Ctrl+C to stop this script (services will continue running)"

# Garder le script actif
while ($true) {
    Start-Sleep -Seconds 5
    
    # Vérifier que les processus tournent toujours
    $stillRunning = 0
    foreach ($pid in $processIds) {
        $proc = Get-Process -Id $pid.pid -ErrorAction SilentlyContinue
        if ($proc) {
            $stillRunning++
        } else {
            Write-Warning "$($pid.service) (PID: $($pid.pid)) has stopped"
        }
    }
    
    if ($Verbose) {
        Write-Info "Services still running: $stillRunning/$($processIds.Count)"
    }
}
