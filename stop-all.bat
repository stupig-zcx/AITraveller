@echo off
echo 正在停止所有相关服务...

echo 停止后端服务...
echo 查找Node.js进程...
tasklist | findstr "node"

for /f "tokens=2" %%i in ('tasklist ^| findstr "node"') do (
    echo 终止后端进程 %%i
    taskkill /PID %%i /F
)

echo 停止Python HTTP服务器...
echo 查找Python进程...
tasklist | findstr "python"

for /f "tokens=2" %%i in ('tasklist ^| findstr "python"') do (
    echo 终止Python进程 %%i
    taskkill /PID %%i /F
)

echo 所有服务已停止
echo.
echo 要在PowerShell中运行此脚本，请使用: .\stop-all.bat
pause