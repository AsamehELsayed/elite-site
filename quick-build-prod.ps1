# Quick Production Build Script - Optimized with BuildKit (PowerShell)
# Usage: .\quick-build-prod.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting optimized production build..." -ForegroundColor Cyan
Write-Host ""

# Enable BuildKit
$env:DOCKER_BUILDKIT = "1"
$env:COMPOSE_DOCKER_CLI_BUILD = "1"

Write-Host "📦 Step 1: Building with BuildKit and parallel builds..." -ForegroundColor Yellow
$startTime = Get-Date
docker compose -f docker-compose.prod.yml build --parallel
$endTime = Get-Date
$buildTime = ($endTime - $startTime).TotalSeconds

Write-Host ""
Write-Host "✅ Build completed in $([math]::Round($buildTime, 2)) seconds" -ForegroundColor Green
Write-Host ""

# Show image size
Write-Host "📊 Image size:" -ForegroundColor Yellow
docker images elite-site:latest --format "{{.Repository}}:{{.Tag}} - {{.Size}}"

Write-Host ""
Write-Host "🚀 Step 2: Starting services..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml up -d

Write-Host ""
Write-Host "✅ Services started!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Useful commands:" -ForegroundColor Cyan
Write-Host "  View logs:    docker compose -f docker-compose.prod.yml logs -f app-elite"
Write-Host "  Stop:         docker compose -f docker-compose.prod.yml down"
Write-Host "  Restart:      docker compose -f docker-compose.prod.yml restart app-elite"
Write-Host "  Health check: curl http://localhost:3000/api/health"
Write-Host ""

