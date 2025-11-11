const supabase = require('./supabaseClient');

async function testUserCreation() {
  try {
    console.log('Attempting to create a test user...');
    
    // 插入测试用户
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username: 'testuser',
          password: 'testpass',
          created_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) {
      console.log('Error creating user:', error);
    } else {
      console.log('User created successfully:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testUserCreation();