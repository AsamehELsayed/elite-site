# Build Docker image locally and prepare for transfer to server
# Run this script on Windows (local machine)

Write-Host "🏗️  Building production Docker image locally..." -ForegroundColor Cyan
Write-Host ""

# Build the image
docker build -f Dockerfile.prod -t elite-site:latest .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# Save the image to a tar file
$imageFile = "elite-site-latest.tar"
Write-Host "💾 Saving image to $imageFile..." -ForegroundColor Cyan

docker save elite-site:latest -o $imageFile

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to save image!" -ForegroundColor Red
    exit 1
}

# Get file size
$fileSize = (Get-Item $imageFile).Length / 1MB
Write-Host ""
Write-Host "✅ Image saved successfully!" -ForegroundColor Green
Write-Host "   File: $imageFile" -ForegroundColor Yellow
Write-Host "   Size: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Yellow
Write-Host ""
Write-Host "📤 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Transfer $imageFile to your server using SCP:" -ForegroundColor White
Write-Host "      scp $imageFile user@your-server:/root/elite-site/" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. On the server, load the image:" -ForegroundColor White
Write-Host "      docker load -i elite-site-latest.tar" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Update docker-compose.prod.yml to use the image" -ForegroundColor White
Write-Host "      (or use the load-and-deploy.sh script on server)" -ForegroundColor Gray
Write-Host ""

