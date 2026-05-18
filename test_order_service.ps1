$baseUrl = "http://127.0.0.1:8080/api/orders"
$results = @()

# Test 1: GET /api/orders - List all orders
Write-Host "=== TEST 1: GET /api/orders - List all orders ===" -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method Get
    Write-Host "Status: 200 OK" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 10)" -ForegroundColor Cyan
    $results += @{Test="GET /api/orders"; Status="PASS"}
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    $results += @{Test="GET /api/orders"; Status="FAIL"}
}
Write-Host ""

# Test 2: POST /api/orders - Create a new order
Write-Host "=== TEST 2: POST /api/orders - Create a new order ===" -ForegroundColor Green
try {
    $orderPayload = @{
        numero = "ORD-2025-001"
        clientId = 1
        producteurId = 1
        adresseLivraison = "123 Rue de Paris, Paris"
        modeLivraison = "Standard"
        montantTotal = 150.50
        fraisLivraison = 10.00
        dateCommande = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
        dateLivraisonEstimee = (Get-Date).AddDays(3).ToString("yyyy-MM-ddTHH:mm:ss")
        lignes = @()
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $orderPayload -ContentType "application/json"
    Write-Host "Status: 200 OK" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 10)" -ForegroundColor Cyan
    $createdOrderId = $response.id
    Write-Host "Created Order ID: $createdOrderId" -ForegroundColor Yellow
    $results += @{Test="POST /api/orders"; Status="PASS"}
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    $results += @{Test="POST /api/orders"; Status="FAIL"}
}
Write-Host ""

# Test 3: GET /api/orders/{id} - Get a specific order
Write-Host "=== TEST 3: GET /api/orders/{id} - Get a specific order ===" -ForegroundColor Green
if ($createdOrderId) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/$createdOrderId" -Method Get
        Write-Host "Status: 200 OK" -ForegroundColor Green
        Write-Host "Response: $($response | ConvertTo-Json -Depth 10)" -ForegroundColor Cyan
        $results += @{Test="GET /api/orders/{id}"; Status="PASS"}
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        $results += @{Test="GET /api/orders/{id}"; Status="FAIL"}
    }
}
Write-Host ""

# Test 4: PUT /api/orders/{id} - Update an order
Write-Host "=== TEST 4: PUT /api/orders/{id} - Update an order ===" -ForegroundColor Green
if ($createdOrderId) {
    try {
        $updatePayload = @{
            numero = "ORD-2025-001-UPDATED"
            clientId = 1
            producteurId = 1
            adresseLivraison = "456 Avenue des Champs, Lyon"
            modeLivraison = "Express"
            montantTotal = 200.00
            fraisLivraison = 15.00
            dateCommande = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
            dateLivraisonEstimee = (Get-Date).AddDays(1).ToString("yyyy-MM-ddTHH:mm:ss")
            lignes = @()
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "$baseUrl/$createdOrderId" -Method Put -Body $updatePayload -ContentType "application/json"
        Write-Host "Status: 200 OK" -ForegroundColor Green
        Write-Host "Response: $($response | ConvertTo-Json -Depth 10)" -ForegroundColor Cyan
        $results += @{Test="PUT /api/orders/{id}"; Status="PASS"}
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        $results += @{Test="PUT /api/orders/{id}"; Status="FAIL"}
    }
}
Write-Host ""

# Test 5: POST /api/orders - Create another order for deletion test
Write-Host "=== TEST 5: POST /api/orders - Create order for deletion ===" -ForegroundColor Green
try {
    $orderPayload = @{
        numero = "ORD-2025-DELETE"
        clientId = 2
        producteurId = 2
        adresseLivraison = "789 Rue de Marseille"
        modeLivraison = "Standard"
        montantTotal = 75.25
        fraisLivraison = 5.00
        dateCommande = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
        dateLivraisonEstimee = (Get-Date).AddDays(5).ToString("yyyy-MM-ddTHH:mm:ss")
        lignes = @()
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $orderPayload -ContentType "application/json"
    Write-Host "Status: 200 OK" -ForegroundColor Green
    $orderToDeleteId = $response.id
    Write-Host "Created order ID: $orderToDeleteId" -ForegroundColor Yellow
    $results += @{Test="POST /api/orders (for delete)"; Status="PASS"}
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    $results += @{Test="POST /api/orders (for delete)"; Status="FAIL"}
}
Write-Host ""

# Test 6: DELETE /api/orders/{id} - Delete an order
Write-Host "=== TEST 6: DELETE /api/orders/{id} - Delete an order ===" -ForegroundColor Green
if ($orderToDeleteId) {
    try {
        Invoke-RestMethod -Uri "$baseUrl/$orderToDeleteId" -Method Delete
        Write-Host "Status: 204 No Content" -ForegroundColor Green
        Write-Host "Order deleted successfully" -ForegroundColor Cyan
        $results += @{Test="DELETE /api/orders/{id}"; Status="PASS"}
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        $results += @{Test="DELETE /api/orders/{id}"; Status="FAIL"}
    }
}
Write-Host ""

# Test 7: GET /api/orders/{id} - Verify deleted order (should return 404)
Write-Host "=== TEST 7: GET /api/orders/{id} - Verify deleted order ===" -ForegroundColor Green
if ($orderToDeleteId) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/$orderToDeleteId" -Method Get
        Write-Host "Status: 200 OK - Unexpected (Order still exists)" -ForegroundColor Yellow
        $results += @{Test="Verify DELETE /api/orders/{id}"; Status="UNEXPECTED"}
    } catch {
        Write-Host "Status: Error as expected" -ForegroundColor Green
        $results += @{Test="Verify DELETE /api/orders/{id}"; Status="PASS"}
    }
}
Write-Host ""

# Test 8: GET /api/orders with invalid ID
Write-Host "=== TEST 8: GET /api/orders with invalid ID (999999) ===" -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/999999" -Method Get
    Write-Host "Status: 200 OK - Unexpected" -ForegroundColor Yellow
    $results += @{Test="GET /api/orders/999999"; Status="UNEXPECTED"}
} catch {
    Write-Host "Status: Error as expected (404 or similar)" -ForegroundColor Green
    $results += @{Test="GET /api/orders/999999"; Status="PASS"}
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "TEST SUMMARY" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
$passCount = ($results | Where-Object { $_.Status -eq "PASS" }).Count
$failCount = ($results | Where-Object { $_.Status -eq "FAIL" }).Count
$unexpectedCount = ($results | Where-Object { $_.Status -eq "UNEXPECTED" }).Count

Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host "Unexpected: $unexpectedCount" -ForegroundColor Yellow
Write-Host ""
Write-Host "Detailed Results:" -ForegroundColor Magenta
foreach ($result in $results) {
    if ($result.Status -eq "PASS") {
        Write-Host "$($result.Test): $($result.Status)" -ForegroundColor Green
    } elseif ($result.Status -eq "FAIL") {
        Write-Host "$($result.Test): $($result.Status)" -ForegroundColor Red
    } else {
        Write-Host "$($result.Test): $($result.Status)" -ForegroundColor Yellow
    }
}
