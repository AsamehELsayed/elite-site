# Quick Deployment Script for Windows (Local Testing)
# Usage: .\quick-deploy.ps1

Write-Host "🚀 Starting Fast Deployment..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Check prerequisites
Write-Host "Step 1: Checking prerequisites..." -ForegroundColor Yellow
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue).Source) {
    Write-Host "❌ Docker Desktop is not running" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Please create a .env file with required variables." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Prerequisites check passed" -ForegroundColor Green
Write-Host ""

# Step 2: Stop existing containers
Write-Host "Step 2: Stopping existing containers..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml down 2>$null
Write-Host "✅ Containers stopped" -ForegroundColor Green
Write-Host ""

# Step 3: Enable BuildKit
Write-Host "Step 3: Enabling BuildKit for faster builds..." -ForegroundColor Yellow
$env:DOCKER_BUILDKIT = "1"
$env:COMPOSE_DOCKER_CLI_BUILD = "1"
Write-Host "✅ BuildKit enabled" -ForegroundColor Green
Write-Host ""

# Step 4: Build image
Write-Host "Step 4: Building production image (this may take a few minutes)..." -ForegroundColor Yellow
Write-Host "Building with cache optimization..."
docker compose -f docker-compose.prod.yml build --progress=plain
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build complete" -ForegroundColor Green
Write-Host ""

# Step 5: Start services
Write-Host "Step 5: Starting services..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start services" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Services started" -ForegroundColor Green
Write-Host ""

# Step 6: Wait for services
Write-Host "Step 6: Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check containers
$containers = docker ps --format "{{.Names}}"
if ($containers -match "elite-app") {
    Write-Host "✅ Application container is running" -ForegroundColor Green
} else {
    Write-Host "⚠️  Application container may still be starting" -ForegroundColor Yellow
}

if ($containers -match "elite-db") {
    Write-Host "✅ Database container is running" -ForegroundColor Green
} else {
    Write-Host "⚠️  Database container may still be starting" -ForegroundColor Yellow
}
Write-Host ""

# Step 7: Show status
Write-Host "Step 7: Container Status" -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml ps
Write-Host ""

# Final summary
Write-Host "════════════════════════════════════════" -ForegroundColor Green
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Cyan
Write-Host "  View logs:     docker compose -f docker-compose.prod.yml logs -f app-elite"
Write-Host "  View status:   docker compose -f docker-compose.prod.yml ps"
Write-Host "  Stop services: docker compose -f docker-compose.prod.yml down"
Write-Host "  Restart app:   docker compose -f docker-compose.prod.yml restart app-elite"
Write-Host ""

