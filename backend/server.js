const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 路由
const authRoutes = require('./routes/authRoutes');
const travelPlanRoutes = require('./routes/travelPlanRoutes');

// Supabase客户端
const supabase = require('./supabaseClient');

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

// Supabase测试路由
app.get('/api/test-supabase', async (req, res) => {
  try {
    // 测试数据库连接 - 尝试获取旅行计划表中的记录
    const { data, error, count } = await supabase
      .from('travel_plans')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ 
      message: 'Supabase连接成功', 
      recordCount: count,
      data: data.slice(0, 3) // 只返回前3条记录以避免数据过多
    });
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    res.status(500).json({ error: error.message });
  }
});

// 基本路由
app.get('/', (req, res) => {
  res.json({ message: '旅游规划助手后端服务已启动' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});