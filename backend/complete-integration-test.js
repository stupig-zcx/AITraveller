// 完整的前后端集成测试
const fetch = require('node-fetch');

async function completeIntegrationTest() {
  try {
    console.log('=== Complete Frontend-Backend Integration Test ===\n');
    
    // 1. 测试用户注册
    console.log('1. Testing user registration through backend API...');
    const testUsername = `integration_user_${Date.now()}`;
    const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: testUsername,
        password: 'integration_password_123'
      })
    });
    
    console.log('Register response status:', registerResponse.status);
    
    if (registerResponse.status === 200) {
      const registerData = await registerResponse.json();
      console.log('✓ User registration through backend successful');
      console.log('  Message:', registerData.message);
      console.log('  User ID:', registerData.user.id);
      console.log('  Username:', registerData.user.username);
    } else {
      const errorData = await registerResponse.json();
      console.log('✗ User registration failed');
      console.log('  Error:', errorData.error);
      
      // 如果注册失败，我们仍然继续测试其他功能
    }
    
    // 2. 测试用户登录
    console.log('\n2. Testing user login through backend API...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: testUsername,
        password: 'integration_password_123'
      })
    });
    
    console.log('Login response status:', loginResponse.status);
    
    if (loginResponse.status === 200) {
      const loginData = await loginResponse.json();
      console.log('✓ User login through backend successful');
      console.log('  Message:', loginData.message);
      console.log('  User ID:', loginData.user.id);
      console.log('  Username:', loginData.user.username);
      
      const userId = loginData.user.id;
      
      // 3. 测试创建旅游计划
      console.log('\n3. Testing travel plan creation through backend API...');
      const travelPlan = {
        title: 'Integration Test Travel Plan',
        total_consumption: '2500元',
        days_detail: [
          {
            date: '2023-10-01',
            transportation: '高铁',
            accommodation: '商务酒店',
            attractions: [
              {
                name: '集成测试景点1',
                ticket_price: '80元',
                introduction: '用于完整集成测试的景点1',
                address: '测试地址1'
              }
            ],
            food: [
              {
                name: '集成测试餐厅1',
                price_per_person: '60元',
                recommendation: '招牌菜品1'
              }
            ],
            activities: [
              {
                name: '集成测试活动1',
                cost: '40元',
                description: '测试活动描述1'
              }
            ]
          },
          {
            date: '2023-10-02',
            transportation: '公交',
            accommodation: '商务酒店',
            attractions: [
              {
                name: '集成测试景点2',
                ticket_price: '70元',
                introduction: '用于完整集成测试的景点2',
                address: '测试地址2'
              }
            ],
            food: [
              {
                name: '集成测试餐厅2',
                price_per_person: '50元',
                recommendation: '招牌菜品2'
              }
            ],
            activities: [
              {
                name: '集成测试活动2',
                cost: '30元',
                description: '测试活动描述2'
              }
            ]
          }
        ]
      };
      
      const createPlanResponse = await fetch('http://localhost:3000/api/travel-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          travelPlan: travelPlan
        })
      });
      
      console.log('Travel plan creation response status:', createPlanResponse.status);
      
      if (createPlanResponse.status === 200) {
        const planData = await createPlanResponse.json();
        console.log('✓ Travel plan creation through backend successful');
        console.log('  Message:', planData.message);
        console.log('  Plan ID:', planData.plan.id);
        console.log('  Plan title:', planData.plan.title);
        
        const planId = planData.plan.id;
        
        // 4. 测试查询用户的旅游计划
        console.log('\n4. Testing retrieval of user\'s travel plans through backend API...');
        const getPlansResponse = await fetch(`http://localhost:3000/api/travel-plans/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Get plans response status:', getPlansResponse.status);
        
        if (getPlansResponse.status === 200) {
          const plansData = await getPlansResponse.json();
          console.log('✓ User\'s travel plans retrieval through backend successful');
          console.log('  Found', plansData.plans.length, 'plan(s)');
          if (plansData.plans.length > 0) {
            console.log('  Most recent plan:', plansData.plans[0].title);
          }
        } else {
          const errorData = await getPlansResponse.json();
          console.log('✗ Failed to retrieve user\'s travel plans');
          console.log('  Error:', errorData.error);
        }
        
        // 5. 测试查询特定旅游计划
        console.log('\n5. Testing retrieval of specific travel plan through backend API...');
        const getPlanResponse = await fetch(`http://localhost:3000/api/travel-plans/${planId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Get specific plan response status:', getPlanResponse.status);
        
        if (getPlanResponse.status === 200) {
          const planData = await getPlanResponse.json();
          console.log('✓ Specific travel plan retrieval through backend successful');
          console.log('  Plan title:', planData.plan.title);
          console.log('  Total consumption:', planData.plan.total_consumption);
        } else {
          const errorData = await getPlanResponse.json();
          console.log('✗ Failed to retrieve specific travel plan');
          console.log('  Error:', errorData.error);
        }
        
        // 6. 测试更新旅游计划
        console.log('\n6. Testing travel plan update through backend API...');
        const updatedTravelPlan = {
          ...travelPlan,
          title: 'Updated Integration Test Travel Plan',
          total_consumption: '3000元'
        };
        
        const updatePlanResponse = await fetch(`http://localhost:3000/api/travel-plans/${planId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            travelPlan: updatedTravelPlan
          })
        });
        
        console.log('Update plan response status:', updatePlanResponse.status);
        
        if (updatePlanResponse.status === 200) {
          const updateData = await updatePlanResponse.json();
          console.log('✓ Travel plan update through backend successful');
          console.log('  Message:', updateData.message);
          console.log('  Updated plan title:', updateData.plan.title);
          console.log('  Updated total consumption:', updateData.plan.total_consumption);
        } else {
          const errorData = await updatePlanResponse.json();
          console.log('✗ Failed to update travel plan');
          console.log('  Error:', errorData.error);
        }
        
        // 7. 测试删除旅游计划
        console.log('\n7. Testing travel plan deletion through backend API...');
        const deletePlanResponse = await fetch(`http://localhost:3000/api/travel-plans/${planId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Delete plan response status:', deletePlanResponse.status);
        
        if (deletePlanResponse.status === 200) {
          const deleteData = await deletePlanResponse.json();
          console.log('✓ Travel plan deletion through backend successful');
          console.log('  Message:', deleteData.message);
        } else {
          const errorData = await deletePlanResponse.json();
          console.log('✗ Failed to delete travel plan');
          console.log('  Error:', errorData.error);
        }
      } else {
        const errorData = await createPlanResponse.json();
        console.log('✗ Failed to create travel plan');
        console.log('  Error:', errorData.error);
      }
    } else {
      const errorData = await loginResponse.json();
      console.log('✗ User login failed');
      console.log('  Error:', errorData.error);
    }
    
    console.log('\n=== Complete Frontend-Backend Integration Test Completed ===');
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

completeIntegrationTest();