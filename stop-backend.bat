@echo off
echo 正在查找并停止后端服务...

echo 查找Node.js进程...
tasklist | findstr "node"

for /f "tokens=2" %%i in ('tasklist ^| findstr "node"') do (
    echo 终止进程 %%i
    taskkill /PID %%i /F
)

echo 后端服务已停止
echo.
echo 要在PowerShell中运行此脚本，请使用: .\stop-backend.bat
pause