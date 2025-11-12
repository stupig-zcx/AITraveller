# 使用 Node.js 官方镜像
FROM node:18-alpine

# 安装 Python3（用于前端静态服务器）
RUN apk add --no-cache python3

# 设置工作目录
WORKDIR /app

# 设置国内 npm 镜像加速
RUN npm config set registry https://registry.npmmirror.com

# 复制 package 文件
COPY package*.json ./
COPY backend/package*.json ./backend/

# 安装前端依赖
RUN npm install

# 安装后端依赖
RUN cd backend && npm install

# 复制所有源代码
COPY . .

# 创建生产环境 .env 文件（从示例文件复制）
RUN cd backend && cp .env.example .env || echo "No .env.example found, using environment variables"

# 暴露端口（前端 8080，后端 3000）
EXPOSE 3000 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# 启动命令：同时启动后端服务和前端静态服务器
CMD ["sh", "-c", "cd backend && npm start & python3 -m http.server 8080 --directory ."]