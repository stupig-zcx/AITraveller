const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 路由
const authRoutes = require('./routes/authRoutes');
const travelPlanRoutes = require('./routes/travelPlanRoutes');

// 创建 Express 应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/travel-plans', travelPlanRoutes);

// 测试路由
app.get('/api/test', (req, res) => {
  res.json({ message: '后端服务连接成功!' });
});

// 基本路由
app.get('/', (req, res) => {
  res.json({ message: '旅游规划助手后端服务已启动' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});