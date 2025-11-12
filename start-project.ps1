# 启动旅游规划助手项目

Write-Host "正在启动旅游规划助手项目..." -ForegroundColor Green

# 启动后端服务
Write-Host "启动后端服务..." -ForegroundColor Yellow
Set-Location -Path ".\backend"
Start-Process -FilePath "cmd" -ArgumentList "/k npm start" -WindowStyle Normal -PassThru

# 返回上级目录并启动前端
Set-Location -Path ".."
Write-Host "启动前端应用..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/k python -m http.server 8000" -WindowStyle Normal -PassThru

Write-Host "项目启动完成！" -ForegroundColor Green
Write-Host "前端应用将在 http://localhost:8000 上运行" -ForegroundColor Cyan
Write-Host "后端服务将在 http://localhost:3000 上运行" -ForegroundColor Cyan