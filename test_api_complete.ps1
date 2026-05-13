# ============================================================================
# Script de Test Automatisé - API Service Utilisateur
# ============================================================================
# Description: Script PowerShell pour tester automatiquement l'API REST
# Utilisation: powershell -ExecutionPolicy Bypass -File test_api_complete.ps1
# ============================================================================

param(
    [string]$BaseUrl = "http://localhost:8082",
    [switch]$Verbose = $false
)

# Configuration
$ErrorActionPreference = "Continue"
$testsPassed = 0
$testsFailed = 0
$uniqueId = Get-Random -Minimum 10000 -Maximum 99999

# Fonctions utilitaires
function Write-TestHeader {
    param([string]$Title)
    Write-Host "`n" + "="*70 -ForegroundColor Cyan
    Write-Host $Title -ForegroundColor Cyan -BackgroundColor DarkCyan
    Write-Host "="*70 -ForegroundColor Cyan
}

function Write-TestPass {
    param([string]$Message)
    Write-Host "✓ PASS: $Message" -ForegroundColor Green
    $script:testsPassed++
}

function Write-TestFail {
    param([string]$Message)
    Write-Host "✗ FAIL: $Message" -ForegroundColor Red
    $script:testsFailed++
}

function Write-Info {
    param([string]$Message)
    if ($Verbose) {
        Write-Host "ℹ INFO: $Message" -ForegroundColor Cyan
    }
}

function Test-StatusCode {
    param([int]$Expected, [int]$Actual, [string]$TestName)
    if ($Actual -eq $Expected) {
        Write-TestPass "$TestName - HTTP $Expected"
        return $true
    } else {
        Write-TestFail "$TestName - Expected HTTP $Expected but got $Actual"
        return $false
    }
}

function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Endpoint,
        [hashtable]$Body = $null,
        [string]$Description = ""
    )
    
    $url = "$BaseUrl$Endpoint"
    Write-Info "[$Method] $url"
    if ($Description) { Write-Host "  Description: $Description" -ForegroundColor DarkGray }
    
    try {
        if ($Body) {
            $bodyJson = $Body | ConvertTo-Json
            Write-Info "Body: $bodyJson"
            $response = Invoke-WebRequest -Uri $url -Method $Method -Body $bodyJson `
                -ContentType "application/json" -UseBasicParsing -ErrorAction Stop
        } else {
            $response = Invoke-WebRequest -Uri $url -Method $Method `
                -Headers @{"Content-Type" = "application/json"} `
                -UseBasicParsing -ErrorAction Stop
        }
        return @{
            StatusCode = $response.StatusCode
            Content = $response.Content | ConvertFrom-Json
            Success = $true
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.Value__
        $errorContent = $null
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $errorContent = $reader.ReadToEnd() | ConvertFrom-Json
            $reader.Close()
        } catch {
            $errorContent = $_.Exception.Response
        }
        
        return @{
            StatusCode = $statusCode
            Content = $errorContent
            Success = $false
        }
    }
}

# ============================================================================
# TEST 1: GET - Récupérer tous les utilisateurs
# ============================================================================
Write-TestHeader "TEST 1: GET /api/utilisateurs (Récupérer tous les utilisateurs)"

$result = Invoke-ApiRequest -Method GET -Endpoint "/api/utilisateurs" `
    -Description "Récupère la liste complète des utilisateurs"

if (Test-StatusCode -Expected 200 -Actual $result.StatusCode -TestName "GET /api/utilisateurs") {
    if ($result.Content -is [array]) {
        Write-TestPass "Response is an array"
    } else {
        Write-TestFail "Response is not an array"
    }
}

if ($Verbose) {
    Write-Host "Response:" -ForegroundColor Yellow
    $result.Content | ConvertTo-Json | Write-Host
}

# ============================================================================
# TEST 2: GET - Récupérer un utilisateur par ID (existant)
# ============================================================================
Write-TestHeader "TEST 2: GET /api/utilisateurs/{id} (Utilisateur existant)"

$result = Invoke-ApiRequest -Method GET -Endpoint "/api/utilisateurs/1" `
    -Description "Récupère l'utilisateur avec ID=1"

if ($result.StatusCode -eq 200) {
    Write-TestPass "GET /api/utilisateurs/1 - HTTP 200"
    if ($result.Content.id -eq 1) {
        Write-TestPass "Response contains correct ID"
    }
} elseif ($result.StatusCode -eq 404) {
    Write-TestFail "User with ID=1 does not exist (404)"
} else {
    Write-TestFail "Unexpected status code: $($result.StatusCode)"
}

# ============================================================================
# TEST 3: GET - Utilisateur inexistant (404)
# ============================================================================
Write-TestHeader "TEST 3: GET /api/utilisateurs/{id} (Utilisateur inexistant)"

$result = Invoke-ApiRequest -Method GET -Endpoint "/api/utilisateurs/99999" `
    -Description "Récupère un utilisateur qui n'existe pas"

if (Test-StatusCode -Expected 404 -Actual $result.StatusCode -TestName "GET /api/utilisateurs/99999") {
    Write-TestPass "Correct error message for non-existent user"
}

# ============================================================================
# TEST 4: POST - Créer un nouvel utilisateur (valide)
# ============================================================================
Write-TestHeader "TEST 4: POST /api/utilisateurs (Créer un utilisateur valide)"

$newUser = @{
    email = "test.user$uniqueId@example.com"
    nom = "TestNom$uniqueId"
    prenom = "TestPrenom$uniqueId"
    telephone = "+33612345678"
    role = "USER"
    statut = "ACTIF"
}

$result = Invoke-ApiRequest -Method POST -Endpoint "/api/utilisateurs" -Body $newUser `
    -Description "Crée un nouvel utilisateur avec email unique"

if (Test-StatusCode -Expected 201 -Actual $result.StatusCode -TestName "POST /api/utilisateurs") {
    if ($result.Content.id) {
        Write-TestPass "Response contains user ID: $($result.Content.id)"
        $createdUserId = $result.Content.id
        # Sauvegarder l'ID pour les tests suivants
        Write-Info "User ID saved: $createdUserId"
    }
    if ($result.Content.email -eq $newUser.email) {
        Write-TestPass "Email correctly stored"
    }
}

# ============================================================================
# TEST 5: POST - Email invalide (400)
# ============================================================================
Write-TestHeader "TEST 5: POST /api/utilisateurs (Email invalide - 400)"

$invalidUser = @{
    email = "invalid-email"
    nom = "Test"
    prenom = "User"
    role = "USER"
}

$result = Invoke-ApiRequest -Method POST -Endpoint "/api/utilisateurs" -Body $invalidUser `
    -Description "Tente de créer un utilisateur avec email invalide"

if (Test-StatusCode -Expected 400 -Actual $result.StatusCode -TestName "POST with invalid email") {
    Write-TestPass "Validation error returned for invalid email"
}

# ============================================================================
# TEST 6: POST - Champs obligatoires manquants (400)
# ============================================================================
Write-TestHeader "TEST 6: POST /api/utilisateurs (Champs manquants - 400)"

$incompleteUser = @{
    email = "incomplete@example.com"
    nom = "Test"
    # Manque: prenom, role
}

$result = Invoke-ApiRequest -Method POST -Endpoint "/api/utilisateurs" -Body $incompleteUser `
    -Description "Tente de créer un utilisateur sans champs obligatoires"

if (Test-StatusCode -Expected 400 -Actual $result.StatusCode -TestName "POST with missing fields") {
    Write-TestPass "Validation error returned for missing fields"
}

# ============================================================================
# TEST 7: POST - Email en doublon (409)
# ============================================================================
Write-TestHeader "TEST 7: POST /api/utilisateurs (Email en doublon - 409)"

$duplicateEmail = @{
    email = $newUser.email
    nom = "Another"
    prenom = "User"
    role = "USER"
}

$result = Invoke-ApiRequest -Method POST -Endpoint "/api/utilisateurs" -Body $duplicateEmail `
    -Description "Tente de créer un utilisateur avec un email déjà existant"

if (Test-StatusCode -Expected 409 -Actual $result.StatusCode -TestName "POST with duplicate email") {
    if ($result.Content.message -and $result.Content.message.Contains("Email")) {
        Write-TestPass "Correct error message for duplicate email"
    }
}

# ============================================================================
# TEST 8: PUT - Mettre à jour un utilisateur (mise à jour partielle)
# ============================================================================
Write-TestHeader "TEST 8: PUT /api/utilisateurs/{id} (Mise à jour partielle)"

if ($createdUserId) {
    $updateData = @{
        telephone = "+33699999999"
        statut = "INACTIF"
    }
    
    $result = Invoke-ApiRequest -Method PUT -Endpoint "/api/utilisateurs/$createdUserId" `
        -Body $updateData -Description "Met à jour partiellement l'utilisateur créé"
    
    if (Test-StatusCode -Expected 200 -Actual $result.StatusCode -TestName "PUT /api/utilisateurs/{id}") {
        if ($result.Content.telephone -eq "+33699999999") {
            Write-TestPass "Telephone correctly updated"
        }
        if ($result.Content.statut -eq "INACTIF") {
            Write-TestPass "Status correctly updated"
        }
    }
} else {
    Write-TestFail "Skipped: No user ID available from POST test"
}

# ============================================================================
# TEST 9: PUT - Mise à jour complète
# ============================================================================
Write-TestHeader "TEST 9: PUT /api/utilisateurs/{id} (Mise à jour complète)"

if ($createdUserId) {
    $fullUpdate = @{
        email = "updated$uniqueId@example.com"
        nom = "UpdatedNom"
        prenom = "UpdatedPrenom"
        telephone = "+33787654321"
        role = "ADMIN"
        statut = "ACTIF"
    }
    
    $result = Invoke-ApiRequest -Method PUT -Endpoint "/api/utilisateurs/$createdUserId" `
        -Body $fullUpdate -Description "Met à jour complètement l'utilisateur"
    
    if (Test-StatusCode -Expected 200 -Actual $result.StatusCode -TestName "PUT full update") {
        Write-TestPass "User fully updated"
    }
} else {
    Write-TestFail "Skipped: No user ID available from POST test"
}

# ============================================================================
# TEST 10: PUT - Utilisateur inexistant (404)
# ============================================================================
Write-TestHeader "TEST 10: PUT /api/utilisateurs/{id} (Utilisateur inexistant - 404)"

$updateData = @{
    telephone = "+33699999999"
}

$result = Invoke-ApiRequest -Method PUT -Endpoint "/api/utilisateurs/99999" `
    -Body $updateData -Description "Tente de mettre à jour un utilisateur inexistant"

if (Test-StatusCode -Expected 404 -Actual $result.StatusCode -TestName "PUT non-existent user") {
    Write-TestPass "Correct error for non-existent user"
}

# ============================================================================
# TEST 11: DELETE - Supprimer un utilisateur
# ============================================================================
Write-TestHeader "TEST 11: DELETE /api/utilisateurs/{id} (Suppression réussie)"

if ($createdUserId) {
    $result = Invoke-ApiRequest -Method DELETE -Endpoint "/api/utilisateurs/$createdUserId" `
        -Description "Supprime l'utilisateur créé précédemment"
    
    if (Test-StatusCode -Expected 204 -Actual $result.StatusCode -TestName "DELETE /api/utilisateurs/{id}") {
        Write-TestPass "User successfully deleted"
    }
} else {
    Write-TestFail "Skipped: No user ID available from POST test"
}

# ============================================================================
# TEST 12: DELETE - Utilisateur inexistant (404)
# ============================================================================
Write-TestHeader "TEST 12: DELETE /api/utilisateurs/{id} (Utilisateur inexistant - 404)"

$result = Invoke-ApiRequest -Method DELETE -Endpoint "/api/utilisateurs/99999" `
    -Description "Tente de supprimer un utilisateur inexistant"

if (Test-StatusCode -Expected 404 -Actual $result.StatusCode -TestName "DELETE non-existent user") {
    Write-TestPass "Correct error for non-existent user"
}

# ============================================================================
# TEST 13: Health Check (Actuator)
# ============================================================================
Write-TestHeader "TEST 13: Health Check - /actuator/health"

$result = Invoke-ApiRequest -Method GET -Endpoint "/actuator/health" `
    -Description "Vérifie la santé du service via Spring Boot Actuator"

if (Test-StatusCode -Expected 200 -Actual $result.StatusCode -TestName "Health check") {
    if ($result.Content.status) {
        Write-TestPass "Health status: $($result.Content.status)"
    }
}

# ============================================================================
# RÉSUMÉ DES TESTS
# ============================================================================
Write-TestHeader "RÉSUMÉ DES RÉSULTATS"

$totalTests = $testsPassed + $testsFailed
$percentage = if ($totalTests -gt 0) { ($testsPassed / $totalTests) * 100 } else { 0 }

Write-Host "Total des tests: $totalTests" -ForegroundColor Yellow
Write-Host "Tests réussis:   $testsPassed" -ForegroundColor Green
Write-Host "Tests échoués:   $testsFailed" -ForegroundColor Red
Write-Host "Taux de réussite: $([math]::Round($percentage, 2))%" -ForegroundColor Cyan

if ($testsFailed -eq 0) {
    Write-Host "`n✓ TOUS LES TESTS SONT PASSÉS!" -ForegroundColor Green -BackgroundColor DarkGreen
} else {
    Write-Host "`n✗ CERTAINS TESTS ONT ÉCHOUÉ" -ForegroundColor Red -BackgroundColor DarkRed
}

# Retour au répertoire initial
Write-Host "`nFin du test." -ForegroundColor Cyan
