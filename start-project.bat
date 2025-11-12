@echo off
echo 正在启动旅游规划助手项目...

echo 启动后端服务...
cd backend
start "后端服务" cmd /k "npm start"

cd ..
echo 启动前端应用...
start "前端应用" cmd /k "python -m http.server 8000"

echo 项目启动完成！
echo 前端应用将在 http://localhost:8000 上运行
echo 后端服务将在 http://localhost:3000 上运行
echo.
echo 要在PowerShell中运行此脚本，请使用: .\start-project.bat
pause