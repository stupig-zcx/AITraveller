// 为Node.js添加Headers支持
if (typeof Headers === 'undefined') {
  global.Headers = function() {};
}

require('dotenv').config();

// 直接使用Supabase客户端而不通过我们的封装
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

// 创建Supabase客户端实例
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // 测试数据库连接 - 尝试获取旅行计划表中的记录
    const { data, error, count } = await supabase
      .from('travel_plans')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.error('Error querying travel_plans table:', error);
    } else {
      console.log('Database connection successful.');
      console.log('Found', count, 'records in travel_plans table.');
    }
  } catch (error) {
    console.error('Error during Supabase connection test:', error);
  }
}

testConnection();