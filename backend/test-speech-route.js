const express = require('express');
const speechRoutes = require('./routes/speechRoutes');

const app = express();
app.use(express.json({ limit: '10mb' }));

// 挂载路由
app.use('/api/speech', speechRoutes);

// 测试路由
app.get('/', (req, res) => {
  res.json({ message: '测试服务器' });
});

app.listen(3001, () => {
  console.log('测试服务器运行在端口 3001');
});