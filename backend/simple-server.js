const express = require('express');
const cors = require('cors');
const speechRoutes = require('./routes/speechRoutes');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 路由
app.use('/api/speech', speechRoutes);

// 基本路由
app.get('/', (req, res) => {
  res.json({ message: '测试服务器运行在端口 3001' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`测试服务器运行在端口 ${PORT}`);
});