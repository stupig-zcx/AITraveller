# 停止后端服务

Write-Host "正在查找并停止后端服务..." -ForegroundColor Green

# 查找Node.js进程
Write-Host "查找Node.js进程..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    foreach ($process in $nodeProcesses) {
        Write-Host "终止进程 ID: $($process.Id)" -ForegroundColor Yellow
        Stop-Process -Id $process.Id -Force
    }
    Write-Host "后端服务已停止" -ForegroundColor Green
} else {
    Write-Host "未找到运行中的Node.js进程" -ForegroundColor Red
}