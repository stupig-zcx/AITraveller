// 测试Supabase连接的简单脚本
require('dotenv').config(); // 确保加载环境变量

const supabase = require('./supabaseClient');

async function testSupabaseConnection() {
  try {
    console.log('正在测试Supabase连接...');
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
    console.log('SUPABASE_SERVICE_KEY exists:', !!process.env.SUPABASE_SERVICE_KEY);
    
    // 尝试获取当前时间戳以测试连接
    const { data, error } = await supabase.rpc('now');
    
    if (error) {
      console.error('Supabase连接失败:', error);
      return;
    }
    
    console.log('Supabase连接成功!');
    console.log('当前时间:', data);
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

// 如果直接运行此脚本，则执行测试
if (require.main === module) {
  testSupabaseConnection();
}

module.exports = testSupabaseConnection;