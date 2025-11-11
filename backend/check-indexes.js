const fetch = require('node-fetch');

async function checkIndexes() {
  try {
    console.log('Checking if indexes exist...');
    
    // 由于我们无法通过REST API直接检查索引，我们可以通过查询来间接验证
    // 检查唯一索引是否有效（尝试插入重复用户名）
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
      console.log('Unique constraint on username is working correctly');
    } else {
      console.log('Unique constraint on username may not be working. Status:', duplicateUserResponse.status);
      if (duplicateUserResponse.status !== 201) {
        const errorData = await duplicateUserResponse.json();
        console.log('Error data:', errorData);
      }
    }
    
    // 测试查询性能（间接验证索引）
    console.log('Testing query performance with user_id filter...');
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
    console.log('Query with user_id filter took', endTime - startTime, 'ms');
    
    const plansData = await plansResponse.json();
    console.log('Number of plans for user:', plansData.length);
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkIndexes();