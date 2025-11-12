const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 路由
const authRoutes = require('./routes/authRoutes');
const travelPlanRoutes = require('./routes/travelPlanRoutes');
const speechRoutes = require('./routes/speechRoutes');
const newSpeechRoutes = require('./routes/newSpeechRoutes'); // 新的语音识别路由

// Supabase客户端
const supabase = require('./supabaseClient');

// 创建 Express 应用
const app = express();
const PORT = process.env.PORT || 3000;

// 日志中间件
app.use((req, res, next) => {
  console.log(`收到请求: ${req.method} ${req.url}`);
  console.log('请求头:', JSON.stringify(req.headers));
  next();
});

// 中间件
app.use(cors());
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf, encoding) => {
    try {
      // 验证JSON格式
      if (req.method === 'POST' && req.url.includes('/speech')) {
        console.log('验证JSON格式，数据长度:', buf.length);
        JSON.parse(buf.toString());
      }
    } catch (error) {
      console.log('JSON验证失败:', error.message);
      // JSON解析错误将在路由中处理
    }
  }
}));

// 路由
console.log('注册路由: /api/auth');
app.use('/api/auth', authRoutes);
console.log('注册路由: /api/travel-plans');
app.use('/api/travel-plans', travelPlanRoutes);
console.log('注册路由: /api/speech');
app.use('/api/speech', speechRoutes); // 添加语音识别路由
console.log('注册路由: /api/new-speech'); // 新的语音识别路由
app.use('/api/new-speech', newSpeechRoutes);

// 测试路由
app.get('/api/test', (req, res) => {
  console.log('收到测试请求');
  res.json({ message: '后端服务连接成功!' });
});

// Supabase测试路由
app.get('/api/test-supabase', async (req, res) => {
  try {
    console.log('收到Supabase测试请求');
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

// 获取数据库表结构信息
app.get('/api/schema-info', async (req, res) => {
  try {
    console.log('收到数据库结构信息请求');
    // 获取users表结构
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (usersError) {
      console.error('Users table error:', usersError);
      return res.status(500).json({ error: usersError.message });
    }
    
    // 获取travel_plans表结构
    const { data: plansData, error: plansError } = await supabase
      .from('travel_plans')
      .select('*')
      .limit(1);
    
    if (plansError) {
      console.error('Travel plans table error:', plansError);
      return res.status(500).json({ error: plansError.message });
    }
    
    res.json({ 
      message: '数据库表结构信息获取成功',
      usersTable: usersData.length > 0 ? Object.keys(usersData[0]) : [],
      travelPlansTable: plansData.length > 0 ? Object.keys(plansData[0]) : [],
      usersSample: usersData,
      plansSample: plansData
    });
  } catch (error) {
    console.error('Error getting schema info:', error);
    res.status(500).json({ error: error.message });
  }
});

// 基本路由
app.get('/', (req, res) => {
  console.log('收到根路径请求');
  res.json({ message: '旅游规划助手后端服务已启动' });
});

// 404处理
app.use((req, res) => {
  console.log(`404 - 未找到路由: ${req.method} ${req.url}`);
  res.status(404).json({ 
    success: false,
    error: '路由未找到',
    message: `请求的路径 ${req.url} 不存在`
  });
});

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('全局错误处理:', error);
  
  // 确保始终返回JSON格式的响应
  const errorResponse = {
    success: false,
    error: '服务器内部错误',
    message: error.message || '未知错误'
  };
  
  // 检查响应是否已经发送
  if (!res.headersSent) {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
      errorResponse.error = 'JSON格式错误';
      errorResponse.message = '请求体不是有效的JSON格式: ' + error.message;
      return res.status(400).json(errorResponse);
    }
    res.status(500).json(errorResponse);
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

module.exports = app;