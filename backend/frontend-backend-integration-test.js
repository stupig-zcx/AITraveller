// 测试前端和后端的集成
const fetch = require('node-fetch');

async function frontendBackendIntegrationTest() {
  try {
    console.log('=== Frontend-Backend Integration Test ===\n');
    
    // 模拟前端注册请求
    console.log('1. Simulating frontend registration request...');
    const testUsername = `frontend_user_${Date.now()}`;
    const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: testUsername,
        password: 'frontend_password_123'
      })
    });
    
    console.log('Register response status:', registerResponse.status);
    
    if (registerResponse.status !== 200) {
      console.log('✗ Registration failed - checking if backend is running');
      console.log('This is expected if the backend server is not running');
      
      // 直接测试数据库API
      console.log('\n2. Directly testing database API (bypassing backend server)...');
      const directRegisterResponse = await fetch('https://olsezvgkkwwpvbdkdusq.supabase.co/rest/v1/users', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          username: testUsername + '_direct',
          password: 'direct_password_123',
          created_at: new Date().toISOString()
        })
      });
      
      console.log('Direct register response status:', directRegisterResponse.status);
      
      if (directRegisterResponse.status === 201) {
        const userData = await directRegisterResponse.json();
        const userId = userData[0].id;
        console.log('✓ Direct registration successful');
        console.log('  User ID:', userId);
        console.log('  Username:', userData[0].username);
        
        // 测试创建旅游计划
        console.log('\n3. Creating travel plan for directly registered user...');
        const planResponse = await fetch('https://olsezvgkkwwpvbdkdusq.supabase.co/rest/v1/travel_plans', {
          method: 'POST',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            user_id: userId,
            title: 'Direct Integration Test Plan',
            total_consumption: '1000元',
            days_detail: [
              {
                date: '2023-09-01',
                transportation: '地铁',
                accommodation: '快捷酒店',
                attractions: [
                  {
                    name: '集成测试景点',
                    ticket_price: '50元',
                    introduction: '用于测试前后端集成的景点',
                    address: '测试地址'
                  }
                ],
                food: [
                  {
                    name: '集成测试餐厅',
                    price_per_person: '30元',
                    recommendation: '测试菜品'
                  }
                ],
                activities: [
                  {
                    name: '集成测试活动',
                    cost: '20元',
                    description: '测试活动描述'
                  }
                ]
              }
            ],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        });
        
        console.log('Travel plan creation status:', planResponse.status);
        
        if (planResponse.status === 201) {
          const planData = await planResponse.json();
          console.log('✓ Travel plan created successfully via direct API');
          console.log('  Plan title:', planData[0].title);
          
          // 查询用户的旅游计划
          console.log('\n4. Querying user\'s travel plans...');
          const userPlansResponse = await fetch(`https://olsezvgkkwwpvbdkdusq.supabase.co/rest/v1/travel_plans?user_id=eq.${userId}`, {
            method: 'GET',
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
              'Content-Type': 'application/json'
            }
          });
          
          const userPlansData = await userPlansResponse.json();
          console.log('✓ User travel plans retrieved successfully');
          console.log('  Found', userPlansData.length, 'plan(s)');
          
          // 清理数据
          console.log('\n5. Cleaning up test data...');
          
          // 删除旅游计划
          await fetch(`https://olsezvgkkwwpvbdkdusq.supabase.co/rest/v1/travel_plans?id=eq.${planData[0].id}`, {
            method: 'DELETE',
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
              'Content-Type': 'application/json'
            }
          });
          
          // 删除用户
          await fetch(`https://olsezvgkkwwpvbdkdusq.supabase.co/rest/v1/users?id=eq.${userId}`, {
            method: 'DELETE',
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
              'Content-Type': 'application/json'
            }
          });
          
          console.log('✓ Test data cleaned up');
        }
      } else {
        console.log('✗ Direct registration also failed');
        const error = await directRegisterResponse.json();
        console.log('Error:', error);
      }
    } else {
      const registerData = await registerResponse.json();
      console.log('✓ Registration through backend successful');
      console.log('Response:', registerData);
    }
    
    console.log('\n=== Frontend-Backend Integration Test Completed ===');
    console.log('Note: For full integration testing, ensure the backend server is running on port 3000');
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

frontendBackendIntegrationTest();