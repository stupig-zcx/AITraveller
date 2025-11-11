const fetch = require('node-fetch');

async function testFullWorkflow() {
  try {
    console.log('=== Testing Full User Workflow ===\n');
    
    const supabaseUrl = 'https://olsezvgkkwwpvbdkdusq.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s';
    
    // 1. 用户注册
    console.log('1. Testing user registration...');
    const testUsername = `full_workflow_user_${Date.now()}`;
    const registerResponse = await fetch(`${supabaseUrl}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        username: testUsername,
        password: 'workflow_password_123',
        created_at: new Date().toISOString()
      })
    });
    
    console.log('Register response status:', registerResponse.status);
    
    if (registerResponse.status === 201) {
      const registerData = await registerResponse.json();
      console.log('✓ User registration successful');
      console.log('  User ID:', registerData[0].id);
      console.log('  Username:', registerData[0].username);
      
      const userId = registerData[0].id;
      
      // 2. 用户登录（查询用户）
      console.log('\n2. Testing user login (query user)...');
      const loginResponse = await fetch(`${supabaseUrl}/rest/v1/users?username=eq.${testUsername}&password=eq.workflow_password_123`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const loginData = await loginResponse.json();
      if (loginData.length > 0) {
        console.log('✓ User login successful');
        console.log('  Found user:', loginData[0].username);
        
        // 3. 创建旅游计划
        console.log('\n3. Creating travel plan for user...');
        const travelPlanResponse = await fetch(`${supabaseUrl}/rest/v1/travel_plans`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            user_id: userId,
            title: 'Full Workflow Test Plan',
            total_consumption: '3500元',
            days_detail: [
              {
                date: '2023-11-01',
                transportation: '飞机',
                accommodation: '豪华酒店',
                attractions: [
                  {
                    name: '完整流程测试景点',
                    ticket_price: '200元',
                    introduction: '用于完整流程测试的景点',
                    address: '测试地址'
                  }
                ],
                food: [
                  {
                    name: '完整流程测试餐厅',
                    price_per_person: '150元',
                    recommendation: '招牌菜品'
                  }
                ],
                activities: [
                  {
                    name: '完整流程测试活动',
                    cost: '100元',
                    description: '测试活动描述'
                  }
                ]
              }
            ],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        });
        
        console.log('Travel plan creation status:', travelPlanResponse.status);
        
        if (travelPlanResponse.status === 201) {
          const planData = await travelPlanResponse.json();
          console.log('✓ Travel plan creation successful');
          console.log('  Plan ID:', planData[0].id);
          console.log('  Plan title:', planData[0].title);
          
          const planId = planData[0].id;
          
          // 4. 查询用户的旅游计划
          console.log('\n4. Querying user\'s travel plans...');
          const userPlansResponse = await fetch(`${supabaseUrl}/rest/v1/travel_plans?user_id=eq.${userId}`, {
            method: 'GET',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            }
          });
          
          const userPlansData = await userPlansResponse.json();
          console.log('✓ User\'s travel plans retrieved successfully');
          console.log('  Found', userPlansData.length, 'plan(s)');
          
          // 5. 清理测试数据
          console.log('\n5. Cleaning up test data...');
          
          // 删除旅游计划
          const deletePlanResponse = await fetch(`${supabaseUrl}/rest/v1/travel_plans?id=eq.${planId}`, {
            method: 'DELETE',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (deletePlanResponse.status === 204) {
            console.log('✓ Travel plan deleted successfully');
          } else {
            console.log('⚠ Failed to delete travel plan');
          }
          
          // 删除用户
          const deleteUserResponse = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${userId}`, {
            method: 'DELETE',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (deleteUserResponse.status === 204) {
            console.log('✓ User deleted successfully');
          } else {
            console.log('⚠ Failed to delete user');
          }
        } else {
          console.log('✗ Travel plan creation failed');
          const errorData = await travelPlanResponse.json();
          console.log('Error:', errorData);
        }
      } else {
        console.log('✗ User login failed - user not found');
      }
    } else {
      console.log('✗ User registration failed');
      const errorData = await registerResponse.json();
      console.log('Error:', errorData);
    }
    
    console.log('\n=== Full User Workflow Test Completed ===');
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testFullWorkflow();