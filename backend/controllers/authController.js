const supabase = require('../supabaseClient');

// 用户注册
async function register(req, res) {
  try {
    const { email, password } = req.body;
    
    // 使用Supabase Auth注册用户
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(200).json({ 
      message: '用户注册成功', 
      user: data.user 
    });
  } catch (error) {
    return res.status(500).json({ error: '服务器内部错误' });
  }
}

// 用户登录
async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    // 使用Supabase Auth登录用户
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(200).json({ 
      message: '登录成功', 
      user: data.user,
      session: data.session
    });
  } catch (error) {
    return res.status(500).json({ error: '服务器内部错误' });
  }
}

// 用户登出
async function logout(req, res) {
  try {
    // 使用Supabase Auth登出用户
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(200).json({ message: '登出成功' });
  } catch (error) {
    return res.status(500).json({ error: '服务器内部错误' });
  }
}

module.exports = {
  register,
  login,
  logout
};