// 添加全局fetch支持
const fetch = require('node-fetch');
global.fetch = fetch;

// 从环境变量获取Supabase配置
require('dotenv').config({ path: __dirname + '/../.env' });
const supabaseUrl = process.env.SUPABASE_URL || 'https://olsezvgkkwwpvbdkdusq.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s';

console.log('Supabase Configuration:');
console.log('- URL:', supabaseUrl);
console.log('- Key exists:', !!supabaseKey);
console.log('- Key length:', supabaseKey ? supabaseKey.length : 0);

// 用户类定义
class User {
  constructor(id, username, password) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.travelPlans = [];
  }

  // 添加旅游计划到用户
  addTravelPlan(plan) {
    this.travelPlans.push(plan);
  }

  // 获取用户的所有旅游计划
  getTravelPlans() {
    return this.travelPlans;
  }
}

// 直接使用fetch API与Supabase交互
async function supabaseFetch(endpoint, options = {}) {
  const url = `${supabaseUrl}/rest/v1/${endpoint}`;
  const defaultHeaders = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  console.log(`Supabase Request to ${url}:`, {
    method: config.method || 'GET',
    headers: config.headers
  });

  const response = await fetch(url, config);
  
  console.log(`Supabase Response from ${url}:`, {
    status: response.status,
    statusText: response.statusText
  });

  return response;
}

// 用户注册
async function register(req, res) {
  try {
    const { username, password } = req.body;
    console.log('Register attempt:', { username });
    
    // 检查用户名是否已存在
    const checkResponse = await supabaseFetch(`users?username=eq.${username}`);
    if (!checkResponse.ok) {
      const errorText = await checkResponse.text();
      console.log('Check user error response:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || 'Unknown error' };
      }
      return res.status(400).json({ error: errorData.message });
    }
    
    const existingUsers = await checkResponse.json();
    console.log('Existing users check result:', existingUsers);
    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ error: '用户名已存在' });
    }
    
    // 创建新用户（在实际应用中，你应该对密码进行哈希处理）
    const insertResponse = await supabaseFetch('users', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password, // 注意：在实际应用中应该使用密码哈希
        created_at: new Date().toISOString()
      })
    });
    
    console.log('Insert user response status:', insertResponse.status);
    if (!insertResponse.ok) {
      const errorText = await insertResponse.text();
      console.log('Insert user error response:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || 'Unknown error' };
      }
      return res.status(400).json({ error: errorData.message });
    }
    
    // 尝试解析响应体
    const responseText = await insertResponse.text();
    console.log('Insert user response text:', responseText);
    
    let userData;
    try {
      userData = JSON.parse(responseText);
    } catch (e) {
      console.log('Failed to parse JSON, using empty array');
      userData = [{}]; // 默认值
    }
    
    console.log('Insert user success:', userData);
    
    return res.status(200).json({ 
      message: '用户注册成功', 
      user: {
        id: userData[0]?.id || 'unknown',
        username: userData[0]?.username || username
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
}

// 用户登录
async function login(req, res) {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username });
    
    // 验证用户名和密码
    const response = await supabaseFetch(`users?username=eq.${username}&password=eq.${password}`);
    console.log('Login response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Login error response:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || 'Unknown error' };
      }
      return res.status(400).json({ error: errorData.message });
    }
    
    const userData = await response.json();
    console.log('Login user data:', userData);
    if (!userData || userData.length === 0) {
      return res.status(400).json({ error: '用户名或密码错误' });
    }
    
    return res.status(200).json({ 
      message: '登录成功', 
      user: {
        id: userData[0].id,
        username: userData[0].username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
}

// 用户登出
async function logout(req, res) {
  try {
    // 在这个简单的实现中，登出只是一个客户端操作
    return res.status(200).json({ message: '登出成功' });
  } catch (error) {
    return res.status(500).json({ error: '服务器内部错误' });
  }
}

// 获取用户信息和旅游计划
async function getUserProfile(req, res) {
  try {
    const { userId } = req.params;
    console.log('Get user profile attempt:', { userId });
    
    // 获取用户基本信息
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId);
    
    console.log('Get user data:', userData);
    if (userError || !userData || userData.length === 0) {
      const errorMessage = userError ? userError.message : '用户不存在';
      return res.status(400).json({ error: errorMessage });
    }
    
    // 获取用户的旅游计划
    const { data: plansData, error: plansError } = await supabase
      .from('travel_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    console.log('Get plans data:', plansData);
    
    if (plansError) {
      console.error('Get plans error:', plansError);
      return res.status(400).json({ error: plansError.message });
    }
    
    return res.status(200).json({ 
      user: {
        id: userData[0].id,
        username: userData[0].username,
        created_at: userData[0].created_at,
        travelPlans: plansData
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return res.status(500).json({ error: '服务器内部错误: ' + error.message });
  }
}

module.exports = {
  register,
  login,
  logout,
  getUserProfile
};