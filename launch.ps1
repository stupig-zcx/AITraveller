# 旅游规划助手 - 一键启动脚本

param(
    [Parameter(Mandatory=$false)]
    [switch]$NoFrontend
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    智能旅游规划助手 - 一键启动脚本     " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 检查是否在项目根目录
if (-not (Test-Path ".\backend")) {
    Write-Host "错误: 请在项目根目录运行此脚本" -ForegroundColor Red
    Write-Host "当前目录: $(Get-Location)" -ForegroundColor Yellow
    pause
    exit 1
}

# 检查Node.js是否安装
try {
    $nodeVersion = node --version
    Write-Host "Node.js 版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "错误: 未找到 Node.js，请先安装 Node.js" -ForegroundColor Red
    pause
    exit 1
}

# 检查Python是否安装
try {
    $pythonVersion = python --version
    Write-Host "Python 版本: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "警告: 未找到 Python，将跳过前端服务启动" -ForegroundColor Yellow
    $NoFrontend = $true
}

# 启动后端服务
Write-Host "`n启动后端服务..." -ForegroundColor Yellow
Set-Location -Path ".\backend"

# 检查node_modules是否存在
if (-not (Test-Path ".\node_modules")) {
    Write-Host "正在安装后端依赖..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "错误: 后端依赖安装失败" -ForegroundColor Red
        Set-Location -Path ".."
        pause
        exit 1
    }
}

# 检查.env文件是否存在
if (-not (Test-Path ".\.env")) {
    Write-Host "警告: 未找到 .env 文件，请确保已配置环境变量" -ForegroundColor Yellow
}

Write-Host "正在启动后端服务..." -ForegroundColor Yellow
$backendProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -WindowStyle Minimized -PassThru
Write-Host "后端服务 PID: $($backendProcess.Id)" -ForegroundColor Green

Set-Location -Path ".."

# 启动前端服务
if (-not $NoFrontend) {
    Write-Host "启动前端应用..." -ForegroundColor Yellow
    $frontendProcess = Start-Process -FilePath "python" -ArgumentList "-m http.server 8000" -WindowStyle Minimized -PassThru
    Write-Host "前端服务 PID: $($frontendProcess.Id)" -ForegroundColor Green
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "服务启动信息:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "后端服务 PID: $($backendProcess.Id)" -ForegroundColor Green
Write-Host "后端服务地址: http://localhost:3000" -ForegroundColor Green

if (-not $NoFrontend -and $frontendProcess) {
    Write-Host "前端服务 PID: $($frontendProcess.Id)" -ForegroundColor Green
    Write-Host "前端应用地址: http://localhost:8000" -ForegroundColor Green
}

Write-Host "`n提示: 按任意键停止服务..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# 停止服务
Write-Host "`n正在停止服务..." -ForegroundColor Yellow
Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue

if (-not $NoFrontend -and $frontendProcess) {
    Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
}

Write-Host "所有服务已停止" -ForegroundColor Green