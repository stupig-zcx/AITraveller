const supabase = require('./supabaseClient');

async function checkTables() {
  try {
    console.log('Checking if users table exists...');
    
    // 尝试从表中选择数据来检查表是否存在
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.message.includes('Could not find the table')) {
        console.log('Users table does not exist.');
        console.log('You need to create the tables using the SQL script:');
        console.log(`
-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 创建旅游计划表
CREATE TABLE IF NOT EXISTS travel_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    total_consumption VARCHAR(50),
    days_detail JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 为用户表的用户名字段创建唯一索引
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);
        `);
      } else {
        console.log('Error checking table:', error.message);
      }
    } else {
      console.log('Users table exists.');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkTables();