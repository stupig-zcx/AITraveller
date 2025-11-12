// 引入环境变量
require('dotenv').config({ path: __dirname + '/.env' });

// 从环境变量获取配置
const supabaseUrl = process.env.SUPABASE_URL || 'https://olsezvgkkwwpvbdkdusq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s';

const fetch = require('node-fetch');

async function testFullWorkflow() {
    console.log('Testing full frontend-backend integration workflow...');
    
    try {
        // 1. 直接注册一个新用户到Supabase
        console.log('1. Registering new user directly with Supabase...');
        const directRegisterResponse = await fetch(`${supabaseUrl}/rest/v1/users`, {
            method: 'POST',
            headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                username: 'integration_test_user_' + Date.now(),
                password: 'test_password',
                created_at: new Date().toISOString()
            })
        });

        console.log('Direct register response status:', directRegisterResponse.status);
        if (directRegisterResponse.status !== 201) {
            console.log('✗ Direct registration failed');
            const error = await directRegisterResponse.json();
            console.log('Error:', error);
            return;
        }

        const userData = await directRegisterResponse.json();
        const userId = userData[0].id;
        console.log('✓ Direct registration successful');
        console.log('  User ID:', userId);
        console.log('  Username:', userData[0].username);

        // 2. 使用注册的用户ID创建一个旅游计划
        console.log('\n2. Creating travel plan for registered user...');
        const planResponse = await fetch(`${supabaseUrl}/rest/v1/travel_plans`, {
            method: 'POST',
            headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                user_id: userId,
                title: 'Integration Test Plan',
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
        if (planResponse.status !== 201) {
            console.log('✗ Travel plan creation failed');
            const error = await planResponse.json();
            console.log('Error:', error);
            return;
        }

        const planData = await planResponse.json();
        console.log('✓ Travel plan created successfully via direct API');
        console.log('  Plan title:', planData[0].title);

        // 3. 查询用户的旅游计划
        console.log('\n3. Querying user\'s travel plans...');
        const userPlansResponse = await fetch(`${supabaseUrl}/rest/v1/travel_plans?user_id=eq.${userId}`, {
            method: 'GET',
            headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json'
            }
        });

        const userPlansData = await userPlansResponse.json();
        console.log('✓ User travel plans retrieved successfully');
        console.log('  Found', userPlansData.length, 'plan(s)');

        // 4. 清理数据
        console.log('\n4. Cleaning up test data...');
        
        // 删除旅游计划
        await fetch(`${supabaseUrl}/rest/v1/travel_plans?id=eq.${planData[0].id}`, {
            method: 'DELETE',
            headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        // 删除用户
        await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${userId}`, {
            method: 'DELETE',
            headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✓ Test data cleaned up');

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testFullWorkflow();
