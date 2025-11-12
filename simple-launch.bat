@echo off
title 旅游规划助手 - 一键启动

echo ========================================
echo    智能旅游规划助手 - 一键启动脚本     
echo ========================================

echo 检查环境...

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

REM 检查Python是否安装
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 警告: 未找到 Python，将跳过前端服务启动
    set NO_FRONTEND=1
)

echo 启动后端服务...
cd backend

REM 检查node_modules是否存在
if not exist node_modules (
    echo 正在安装后端依赖...
    npm install
    if %errorlevel% neq 0 (
        echo 错误: 后端依赖安装失败
        cd ..
        pause
        exit /b 1
    )
)

echo 正在启动后端服务...
start "后端服务" cmd /k "node server.js"

cd ..

if not defined NO_FRONTEND (
    echo 启动前端应用...
    start "前端应用" cmd /k "python -m http.server 8000"
)

echo.
echo ========================================
echo 服务启动信息:
echo ========================================
echo 后端服务地址: http://localhost:3000
if not defined NO_FRONTEND (
    echo 前端应用地址: http://localhost:8000
)
echo.
echo 按任意键停止服务...
pause >nul

echo 正在停止服务...
taskkill /f /im node.exe >nul 2>&1
if not defined NO_FRONTEND (
    taskkill /f /im python.exe >nul 2>&1
)

echo 所有服务已停止