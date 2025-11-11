const fetch = require('node-fetch');

async function testIndexes() {
  try {
    console.log('Testing if indexes are working...');
    
    // 测试唯一索引：尝试插入重复的用户名
    console.log('Testing unique constraint on username...');
    
    const duplicateUserResponse = await fetch('https://olsezvgkkwwpvbdkdusq.supabase.co/rest/v1/users', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        username: 'testuser',  // 这个用户名已经存在
        password: 'anotherpass',
        created_at: new Date().toISOString()
      })
    });
    
    if (duplicateUserResponse.status === 409) {
      console.log('✓ Unique constraint on username is working correctly');
    } else if (duplicateUserResponse.status === 201) {
      console.log('⚠ Unique constraint on username is NOT working - duplicate username was inserted');
      // 清理测试数据
      // 这里可以添加删除重复用户的代码
    } else {
      console.log('⚠ Unexpected response when testing unique constraint. Status:', duplicateUserResponse.status);
    }
    
    // 测试user_id索引：查询特定用户的旅游计划
    console.log('\nTesting user_id index with query...');
    const startTime = Date.now();
    
    const plansResponse = await fetch('https://olsezvgkkwwpvbdkdusq.supabase.co/rest/v1/travel_plans?user_id=eq.72cf0010-b91a-4ee2-b645-19dc6f0292e6', {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
        'Content-Type': 'application/json'
      }
    });
    
    const endTime = Date.now();
    console.log(`Query took ${endTime - startTime}ms`);
    
    if (plansResponse.ok) {
      const plansData = await plansResponse.json();
      console.log(`✓ Found ${plansData.length} travel plans for user`);
    } else {
      console.log('⚠ Error querying travel plans:', plansResponse.status);
    }
    
    console.log('\nIndex testing completed.');
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testIndexes();