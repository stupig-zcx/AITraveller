# Start the travel planning assistant project

Write-Host "Starting travel planning assistant project..." -ForegroundColor Green

# Start backend service
Write-Host "Starting backend service..." -ForegroundColor Yellow
Set-Location -Path ".\backend"
Start-Process -FilePath "cmd" -ArgumentList "/k npm start" -WindowStyle Normal -PassThru

# Return to parent directory and start frontend
Set-Location -Path ".."
Write-Host "Starting frontend application..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/k python -m http.server 8000" -WindowStyle Normal -PassThru

Write-Host "Project startup complete!" -ForegroundColor Green
Write-Host "Frontend application will run on http://localhost:8000" -ForegroundColor Cyan
Write-Host "Backend service will run on http://localhost:3000" -ForegroundColor Cyan