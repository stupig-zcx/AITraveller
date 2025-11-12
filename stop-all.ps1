# 停止所有相关服务

Write-Host "正在停止所有相关服务..." -ForegroundColor Green

# 停止后端服务 (Node.js进程)
Write-Host "停止后端服务..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    foreach ($process in $nodeProcesses) {
        Write-Host "终止Node.js进程 ID: $($process.Id)" -ForegroundColor Yellow
        Stop-Process -Id $process.Id -Force
    }
    Write-Host "后端服务已停止" -ForegroundColor Green
} else {
    Write-Host "未找到运行中的Node.js进程" -ForegroundColor Red
}

# 停止前端服务 (Python HTTP服务器)
Write-Host "停止Python HTTP服务器..." -ForegroundColor Yellow
$pythonProcesses = Get-Process -Name "python" -ErrorAction SilentlyContinue

if ($pythonProcesses) {
    foreach ($process in $pythonProcesses) {
        Write-Host "终止Python进程 ID: $($process.Id)" -ForegroundColor Yellow
        Stop-Process -Id $process.Id -Force
    }
    Write-Host "Python HTTP服务器已停止" -ForegroundColor Green
} else {
    Write-Host "未找到运行中的Python进程" -ForegroundColor Red
}

Write-Host "所有服务已停止" -ForegroundColor Green