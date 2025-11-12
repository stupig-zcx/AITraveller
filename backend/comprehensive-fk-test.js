// 引入环境变量
require('dotenv').config({ path: __dirname + '/.env' });

// 从环境变量获取配置
const supabaseUrl = process.env.SUPABASE_URL || 'https://olsezvgkkwwpvbdkdusq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s';

const fetch = require('node-fetch');

async function main() {
    console.log('Starting comprehensive foreign key test...');
    
    // 1. 创建一个测试用户
    console.log('1. Creating test user...');
    const createUserResponse = await fetch(`${supabaseUrl}/rest/v1/users`, {
        method: 'POST',
        headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({
            username: 'fk_test_user_' + Date.now(),
            password: 'test_password',
            created_at: new Date().toISOString()
        })
    });
    
    if (createUserResponse.status !== 201) {
        console.log('✗ Failed to create test user');
        const error = await createUserResponse.json();
        console.log('Error:', error);
        return;
    }
    
    const userData = await createUserResponse.json();
    const userId = userData[0].id;
    console.log('✓ Created user:', userData[0].username, 'with ID:', userId);
    
    // 2. 创建关联到该用户的旅游计划
    console.log('\n2. Creating travel plan associated with user...');
    const createPlanResponse = await fetch(`${supabaseUrl}/rest/v1/travel_plans`, {
        method: 'POST',
        headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({
            user_id: userId,
            title: 'Comprehensive Test Travel Plan',
            total_consumption: '1500元',
            days_detail: [
                {
                    date: '2023-07-01',
                    transportation: '高铁',
                    accommodation: '民宿',
                    attractions: [
                        {
                            name: ' comprehensive测试景点',
                            ticket_price: '80元',
                            introduction: '这是一个comprehensive测试景点',
                            address: '测试地址123'
                        }
                    ],
                    food: [
                        {
                            name: ' comprehensive测试餐厅',
                            price_per_person: '60元',
                            recommendation: '特色菜品'
                        }
                    ],
                    activities: [
                        {
                            name: ' comprehensive测试活动',
                            cost: '40元',
                            description: '有趣的活动'
                        }
                    ]
                }
            ],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
    });
    
    if (createPlanResponse.status !== 201) {
        console.log('✗ Failed to create travel plan');
        const error = await createPlanResponse.json();
        console.log('Error:', error);
        return;
    }
    
    const planData = await createPlanResponse.json();
    const planId = planData[0].id;
    console.log('✓ Created travel plan:', planData[0].title, 'with ID:', planId);
    
    // 3. 验证旅游计划与用户正确关联
    console.log('\n3. Verifying travel plan is correctly associated with user...');
    const verifyResponse = await fetch(`${supabaseUrl}/rest/v1/travel_plans?id=eq.${planId}&select=id,title,user_id`, {
        method: 'GET',
        headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json'
        }
    });
    
    const verifyData = await verifyResponse.json();
    if (verifyData[0].user_id === userId) {
        console.log('✓ Travel plan correctly associated with user');
    } else {
        console.log('✗ Travel plan not correctly associated with user');
        console.log('Expected user_id:', userId);
        console.log('Actual user_id:', verifyData[0].user_id);
        return;
    }
    
    // 4. 测试尝试关联不存在的用户ID
    console.log('\n4. Testing association with non-existent user ID...');
    const fakeUserId = '00000000-0000-0000-0000-000000000000';
    const fakePlanResponse = await fetch(`${supabaseUrl}/rest/v1/travel_plans`, {
        method: 'POST',
        headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
            user_id: fakeUserId,
            title: 'Fake User Test Plan',
            total_consumption: '100元'
        })
    });
    
    if (fakePlanResponse.status === 409) {
        console.log('✓ Foreign key constraint correctly prevented association with non-existent user');
    } else {
        console.log('✗ Foreign key constraint failed to prevent association with non-existent user');
        console.log('Response status:', fakePlanResponse.status);
    }
    
    // 5. 测试级联删除
    console.log('\n5. Testing cascade delete...');
    const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${userId}`, {
        method: 'DELETE',
        headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json'
        }
    });
    
    if (deleteResponse.status === 204) {
        console.log('✓ User deleted successfully');
        
        // 验证关联的旅游计划是否也被删除
        const checkPlanResponse = await fetch(`${supabaseUrl}/rest/v1/travel_plans?id=eq.${planId}`, {
            method: 'GET',
            headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        const plansAfterDelete = await checkPlanResponse.json();
        if (plansAfterDelete.length === 0) {
            console.log('✓ Cascade delete working - travel plan deleted with user');
        } else {
            console.log('⚠ Cascade delete may not be working - travel plan still exists');
        }
    } else {
        console.log('✗ Failed to delete user for cascade test');
    }
    
    console.log('\n=== Foreign Key Test Completed ===');
    
}

main();
