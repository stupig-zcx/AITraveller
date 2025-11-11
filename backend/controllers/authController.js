// 添加全局fetch支持
const fetch = require('node-fetch');
global.fetch = fetch;

const supabase = require('../supabaseClient');

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

// 用户注册
async function register(req, res) {
  try {
    const { username, password } = req.body;
    
    // 检查用户名是否已存在
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .limit(1);
    
    if (checkError) {
      return res.status(400).json({ error: checkError.message });
    }
    
    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ error: '用户名已存在' });
    }
    
    // 创建新用户（在实际应用中，你应该对密码进行哈希处理）
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username: username,
          password: password, // 注意：在实际应用中应该使用密码哈希
          created_at: new Date()
        }
      ])
      .select()
      .single();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(200).json({ 
      message: '用户注册成功', 
      user: {
        id: data.id,
        username: data.username
      }
    });
  } catch (error) {
    return res.status(500).json({ error: '服务器内部错误' });
  }
}

// 用户登录
async function login(req, res) {
  try {
    const { username, password } = req.body;
    
    // 验证用户名和密码
    const { data, error } = await supabase
      .from('users')
      .select('id, username')
      .eq('username', username)
      .eq('password', password) // 注意：在实际应用中应该使用密码哈希验证
      .single();
    
    if (error || !data) {
      return res.status(400).json({ error: '用户名或密码错误' });
    }
    
    return res.status(200).json({ 
      message: '登录成功', 
      user: {
        id: data.id,
        username: data.username
      }
    });
  } catch (error) {
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
    
    // 获取用户基本信息
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, username, created_at')
      .eq('id', userId)
      .single();
    
    if (userError) {
      return res.status(400).json({ error: userError.message });
    }
    
    // 获取用户的旅游计划
    const { data: plansData, error: plansError } = await supabase
      .from('travel_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (plansError) {
      return res.status(400).json({ error: plansError.message });
    }
    
    // 构建用户对象
    const user = new User(userData.id, userData.username, null);
    user.travelPlans = plansData;
    
    return res.status(200).json({ 
      user: {
        id: userData.id,
        username: userData.username,
        created_at: userData.created_at,
        travelPlans: plansData
      }
    });
  } catch (error) {
    return res.status(500).json({ error: '服务器内部错误' });
  }
}

module.exports = {
  register,
  login,
  logout,
  getUserProfile
};