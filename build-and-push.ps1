# Build locally and push built files directly to server
# Simple approach: no Docker, just push and run with Node.js

Write-Host "🏗️  Building Next.js application..." -ForegroundColor Cyan
Write-Host ""

# Set production environment
$env:NODE_ENV = "production"

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
    npm install
}

# Generate Prisma Client
Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Cyan
npx prisma generate

# Build the application
Write-Host "🔨 Building application..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Check if .next/standalone exists
if (-not (Test-Path ".next\standalone")) {
    Write-Host "❌ .next/standalone not found!" -ForegroundColor Red
    Write-Host "   Make sure next.config.mjs has 'output: standalone'" -ForegroundColor Yellow
    exit 1
}

Write-Host "📤 Ready to push to server!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Push built files to server:" -ForegroundColor White
Write-Host "     rsync -avz --delete .next/ public/ prisma/ package.json server:/root/elite-site/" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Or use SCP:" -ForegroundColor White
Write-Host "     scp -r .next public prisma package.json root@srv1087024:/root/elite-site/" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. On server, install production deps and start:" -ForegroundColor White
Write-Host "     cd /root/elite-site" -ForegroundColor Gray
Write-Host "     npm install --production" -ForegroundColor Gray
Write-Host "     npx prisma generate" -ForegroundColor Gray
Write-Host "     node .next/standalone/server.js" -ForegroundColor Gray
Write-Host ""

