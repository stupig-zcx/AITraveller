const fetch = require('node-fetch');

// 引入环境变量
require('dotenv').config({ path: __dirname + '/.env' });

// 从环境变量获取配置
const supabaseUrl = process.env.SUPABASE_URL || 'https://olsezvgkkwwpvbdkdusq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s';

async function testFullUserWorkflow() {
    console.log('Testing full user workflow...');
    
    try {
        // 1. 注册新用户
        console.log('1. Registering new user...');
        const registerResponse = await fetch(`${supabaseUrl}/rest/v1/users`, {
            method: 'POST',
            headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                username: 'workflow_test_user_' + Date.now(),
                password: 'test_password',
                created_at: new Date().toISOString()
            })
        });

        if (registerResponse.status !== 201) {
            console.log('✗ User registration failed');
            const error = await registerResponse.json();
            console.log('Error:', error);
            return;
        }

        const registerData = await registerResponse.json();
        const userId = registerData[0].id;
        console.log('✓ User registered successfully');
        console.log('  User ID:', userId);
        console.log('  Username:', registerData[0].username);

        // 2. 用户登录（查询用户）
        console.log('\n2. Testing user login (query user)...');
        const loginResponse = await fetch(`${supabaseUrl}/rest/v1/users?username=eq.${registerData[0].username}&password=eq.test_password`, {
            method: 'GET',
            headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json'
            }
        });

        const loginData = await loginResponse.json();
        if (loginData.length === 0) {
            console.log('✗ User login failed - user not found');
            return;
        }

        console.log('✓ User login successful');
        console.log('  Found user:', loginData[0].username);

        // 3. 创建旅游计划并关联到用户
        console.log('\n3. Creating travel plan for user...');
        const travelPlanResponse = await fetch(`${supabaseUrl}/rest/v1/travel_plans`, {
            method: 'POST',
            headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                user_id: userId,
                title: 'Test Travel Plan for Workflow',
                total_consumption: '2000元',
                days_detail: [
                    {
                        date: '2023-08-01',
                        transportation: '飞机',
                        accommodation: '五星级酒店',
                        attractions: [
                            {
                                name: '测试景点1',
                                ticket_price: '150元',
                                introduction: '这是一个测试景点1',
                                address: '测试地址1'
                            }
                        ],
                        food: [
                            {
                                name: '测试餐厅1',
                                price_per_person: '100元',
                                recommendation: '招牌菜'
                            }
                        ],
                        activities: [
                            {
                                name: '测试活动1',
                                cost: '50元',
                                description: '有趣的活动1'
                            }
                        ]
                    },
                    {
                        date: '2023-08-02',
                        transportation: '出租车',
                        accommodation: '五星级酒店',
                        attractions: [
                            {
                                name: '测试景点2',
                                ticket_price: '120元',
                                introduction: '这是一个测试景点2',
                                address: '测试地址2'
                            }
                        ],
                        food: [
                            {
                                name: '测试餐厅2',
                                price_per_person: '80元',
                                recommendation: '特色菜'
                            }
                        ],
                        activities: [
                            {
                                name: '测试活动2',
                                cost: '60元',
                                description: '有趣的活动2'
                            }
                        ]
                    }
                ],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
        });

        if (travelPlanResponse.status !== 201) {
            console.log('✗ Failed to create travel plan');
            const error = await travelPlanResponse.json();
            console.log('Error:', error);
            return;
        }

        const travelPlanData = await travelPlanResponse.json();
        const planId = travelPlanData[0].id;
        console.log('✓ Travel plan created successfully');
        console.log('  Plan ID:', planId);
        console.log('  Plan title:', travelPlanData[0].title);

        // 4. 查询用户的旅游计划
        console.log('\n4. Querying user\'s travel plans...');
        const userPlansResponse = await fetch(`${supabaseUrl}/rest/v1/travel_plans?user_id=eq.${userId}&order=created_at.desc`, {
            method: 'GET',
            headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json'
            }
        });

        const userPlansData = await userPlansResponse.json();
        if (userPlansData.length > 0) {
            console.log('✓ User\'s travel plans retrieved successfully');
            console.log('  Found', userPlansData.length, 'travel plan(s)');
            console.log('  Most recent plan:', userPlansData[0].title);
        } else {
            console.log('✗ No travel plans found for user');
            return;
        }

        // 5. 清理测试数据
        console.log('\n5. Cleaning up test data...');

        // 删除旅游计划
        const deletePlanResponse = await fetch(`${supabaseUrl}/rest/v1/travel_plans?id=eq.${planId}`, {
            method: 'DELETE',
            headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
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
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (deleteUserResponse.status === 204) {
            console.log('✓ User deleted successfully');
        } else {
            console.log('⚠ Failed to delete user');
        }

        console.log('\n=== Full User Workflow Test Completed ===');
        console.log('✓ All tests passed - User registration, login, and travel plan management are working correctly with the database');

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testFullUserWorkflow();
