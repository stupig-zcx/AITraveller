const supabase = require('./supabaseClient');

async function testSupabaseClient() {
  try {
    console.log('=== Testing Supabase Client ===\n');
    
    // 测试查询用户表
    console.log('1. Testing users table query...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (usersError) {
      console.log('✗ Users table query failed');
      console.log('Error:', usersError);
    } else {
      console.log('✓ Users table query successful');
      console.log('Found', users.length, 'users');
      if (users.length > 0) {
        console.log('Sample user:', users[0].username);
      }
    }
    
    // 测试查询旅游计划表
    console.log('\n2. Testing travel_plans table query...');
    const { data: plans, error: plansError } = await supabase
      .from('travel_plans')
      .select('*')
      .limit(5);
    
    if (plansError) {
      console.log('✗ Travel plans table query failed');
      console.log('Error:', plansError);
    } else {
      console.log('✓ Travel plans table query successful');
      console.log('Found', plans.length, 'travel plans');
      if (plans.length > 0) {
        console.log('Sample plan:', plans[0].title);
      }
    }
    
    // 测试插入用户
    console.log('\n3. Testing user insertion...');
    const testUsername = `supabase_test_user_${Date.now()}`;
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          username: testUsername,
          password: 'test_password',
          created_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (insertError) {
      console.log('✗ User insertion failed');
      console.log('Error:', insertError);
    } else {
      console.log('✓ User insertion successful');
      console.log('New user ID:', newUser[0].id);
      console.log('New username:', newUser[0].username);
      
      // 清理测试用户
      await supabase
        .from('users')
        .delete()
        .eq('id', newUser[0].id);
      
      console.log('✓ Test user cleaned up');
    }
    
    console.log('\n=== Supabase Client Test Completed ===');
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testSupabaseClient();