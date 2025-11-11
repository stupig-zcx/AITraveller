const fetch = require('node-fetch');

async function testForeignKeyAfterUpdate() {
  try {
    console.log('Testing foreign key constraint after table update...');
    
    // 首先确认用户存在
    console.log('Checking if user exists...');
    const userCheckResponse = await fetch('https://olsezvgkkwwpvbdkdusq.supabase.co/rest/v1/users?id=eq.72cf0010-b91a-4ee2-b645-19dc6f0292e6', {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
        'Content-Type': 'application/json'
      }
    });
    
    const userData = await userCheckResponse.json();
    if (userData.length === 0) {
      console.log('User does not exist. Creating a new test user...');
      
      // 创建一个测试用户
      const createUserResponse = await fetch('https://olsezvgkkwwpvbdkdusq.supabase.co/rest/v1/users', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          username: 'fktestuser',
          password: 'fktestpass',
          created_at: new Date().toISOString()
        })
      });
      
      const newUserData = await createUserResponse.json();
      const userId = newUserData[0].id;
      console.log('Created new user with ID:', userId);
    } else {
      console.log('User exists:', userData[0].username);
      const userId = userData[0].id;
      
      // 尝试创建一个关联到该用户的旅游计划
      console.log('Attempting to create travel plan with user_id...');
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
          title: 'FK Test Travel Plan',
          total_consumption: '500元',
          days_detail: [
            {
              date: '2023-06-01',
              transportation: '飞机',
              accommodation: '酒店',
              attractions: [
                {
                  name: '测试景点',
                  ticket_price: '100元',
                  introduction: '这是一个测试景点',
                  address: '测试地址'
                }
              ],
              food: [
                {
                  name: '测试餐厅',
                  price_per_person: '50元',
                  recommendation: '推荐菜品'
                }
              ],
              activities: [
                {
                  name: '测试活动',
                  cost: '30元',
                  description: '活动描述'
                }
              ]
            }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      });
      
      console.log('Travel plan creation response status:', planResponse.status);
      
      if (planResponse.status === 201) {
        const planData = await planResponse.json();
        console.log('✓ Foreign key constraint is working correctly');
        console.log('Created travel plan:', planData[0].title);
        
        // 测试级联删除
        console.log('\nTesting cascade delete...');
        const deleteResponse = await fetch(`https://olsezvgkkwwpvbdkdusq.supabase.co/rest/v1/users?id=eq.${userId}`, {
          method: 'DELETE',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
            'Content-Type': 'application/json'
          }
        });
        
        if (deleteResponse.status === 204) {
          console.log('✓ User deleted successfully');
          
          // 检查关联的旅游计划是否也被删除
          const checkPlanResponse = await fetch(`https://olsezvgkkwwpvbdkdusq.supabase.co/rest/v1/travel_plans?user_id=eq.${userId}`, {
            method: 'GET',
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
              'Content-Type': 'application/json'
            }
          });
          
          const plansAfterDelete = await checkPlanResponse.json();
          if (plansAfterDelete.length === 0) {
            console.log('✓ Cascade delete is working - travel plans deleted with user');
          } else {
            console.log('⚠ Cascade delete may not be working - travel plans still exist');
          }
        } else {
          console.log('⚠ Failed to delete user for cascade test');
        }
      } else {
        const errorData = await planResponse.json();
        console.log('✗ Foreign key constraint test failed:', errorData);
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testForeignKeyAfterUpdate();