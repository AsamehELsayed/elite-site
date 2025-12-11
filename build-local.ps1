# Build Next.js application locally and prepare for transfer
# Run this script on Windows (local machine)

Write-Host "🏗️  Building Next.js application locally..." -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists for build
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  Warning: .env.local not found" -ForegroundColor Yellow
    Write-Host "   Make sure NEXT_PUBLIC_SITE_URL is set for production build" -ForegroundColor Yellow
    Write-Host ""
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies!" -ForegroundColor Red
        exit 1
    }
}

# Generate Prisma Client
Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma Client!" -ForegroundColor Red
    exit 1
}

# Build the application
Write-Host ""
Write-Host "🔨 Building Next.js application..." -ForegroundColor Cyan
$env:NODE_ENV = "production"
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Check if .next directory exists
if (-not (Test-Path ".next")) {
    Write-Host "❌ .next directory not found after build!" -ForegroundColor Red
    exit 1
}

# Create deployment package
Write-Host "📦 Creating deployment package..." -ForegroundColor Cyan

$packageName = "elite-site-built-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"

# Files and directories to include
$itemsToInclude = @(
    ".next",
    "public",
    "prisma",
    "package.json",
    "package-lock.json",
    "scripts"
)

# Create temp directory
$tempDir = "deploy-temp"
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy necessary files
foreach ($item in $itemsToInclude) {
    if (Test-Path $item) {
        Write-Host "   Copying $item..." -ForegroundColor Gray
        Copy-Item -Path $item -Destination "$tempDir\$item" -Recurse -Force
    } else {
        Write-Host "   ⚠️  Warning: $item not found" -ForegroundColor Yellow
    }
}

# Copy node_modules/.prisma and node_modules/@prisma if they exist
if (Test-Path "node_modules\.prisma") {
    New-Item -ItemType Directory -Path "$tempDir\node_modules\.prisma" -Force | Out-Null
    Copy-Item -Path "node_modules\.prisma\*" -Destination "$tempDir\node_modules\.prisma" -Recurse -Force
}

if (Test-Path "node_modules\@prisma") {
    New-Item -ItemType Directory -Path "$tempDir\node_modules\@prisma" -Force | Out-Null
    Copy-Item -Path "node_modules\@prisma\*" -Destination "$tempDir\node_modules\@prisma" -Recurse -Force
}

# Create zip file
Write-Host "   Compressing package..." -ForegroundColor Gray
Compress-Archive -Path "$tempDir\*" -DestinationPath $packageName -Force

# Cleanup
Remove-Item -Recurse -Force $tempDir

$fileSize = (Get-Item $packageName).Length / 1MB
Write-Host ""
Write-Host "✅ Package created successfully!" -ForegroundColor Green
Write-Host "   File: $packageName" -ForegroundColor Yellow
Write-Host "   Size: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Yellow
Write-Host ""
Write-Host "📤 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Transfer $packageName to your server:" -ForegroundColor White
Write-Host "      scp $packageName user@your-server:/root/elite-site/" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. On the server, extract and deploy:" -ForegroundColor White
Write-Host "      unzip $packageName -d /root/elite-site/" -ForegroundColor Gray
Write-Host "      docker compose -f docker-compose.prod.yml up -d --build" -ForegroundColor Gray
Write-Host ""

