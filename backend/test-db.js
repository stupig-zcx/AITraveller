const supabase = require('./supabaseClient');

async function testDB() {
  try {
    // 首先尝试创建表
    console.log('Attempting to create users table...');
    
    // 检查是否已经存在表
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error && error.message.includes('Could not find the table')) {
      console.log('Users table does not exist. You need to create it in Supabase dashboard.');
      return;
    }
    
    console.log('Users table exists. Testing data operations...');
    
    // 插入测试用户
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          username: 'testuser',
          password: 'testpass',
          created_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (insertError) {
      console.log('Insert error:', insertError);
    } else {
      console.log('Insert success:', insertData);
    }
    
    // 查询用户
    const { data: selectData, error: selectError } = await supabase
      .from('users')
      .select('*');
    
    if (selectError) {
      console.log('Select error:', selectError);
    } else {
      console.log('Select success:', selectData);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testDB();