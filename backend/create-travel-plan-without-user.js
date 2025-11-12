// 引入环境变量
require('dotenv').config({ path: __dirname + '/.env' });

// 从环境变量获取配置
const supabaseUrl = process.env.SUPABASE_URL || 'https://olsezvgkkwwpvbdkdusq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s';

const fetch = require('node-fetch');

async function createTravelPlanWithoutUser() {
    console.log('Creating travel plan without existing user...');
    
    // 1. 创建一个新用户
    console.log('1. Creating new user...');
    const userResponse = await fetch(`${supabaseUrl}/rest/v1/users`, {
        method: 'POST',
        headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({
            username: 'test_user_' + Date.now(),
            password: 'test_password',
            created_at: new Date().toISOString()
        })
    });

    const userData = await userResponse.json();
    console.log('User response status:', userResponse.status);
    console.log('User response data:', userData);

    if (userResponse.status === 201 && userData && userData[0]) {
        const userId = userData[0].id;
        console.log('User created with ID:', userId);

        // 2. 创建一个没有 user_id 的旅游计划
        console.log('2. Creating travel plan without user_id...');
        const response = await fetch(`${supabaseUrl}/rest/v1/travel_plans`, {
            method: 'POST',
            headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                title: '测试旅行计划3',
                total_consumption: '3000元',
                days_detail: [
                    {
                        date: '2023-01-03',
                        transportation: '汽车',
                        accommodation: '青旅',
                        attractions: [
                            {
                                name: '景点3',
                                ticket_price: '50元',
                                introduction: '这是第三个测试景点',
                                address: '测试地址3'
                            }
                        ],
                        food: [
                            {
                                name: '餐厅3',
                                price_per_person: '30元',
                                recommendation: '特色小吃'
                            }
                        ],
                        activities: [
                            {
                                name: '活动3',
                                cost: '20元',
                                description: '活动描述3'
                            }
                        ]
                    }
                ],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
        });

        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', data);

        if (response.status === 201 && data && data[0]) {
            const planId = data[0].id;
            console.log('Travel plan created with ID:', planId);

            // 3. 现在尝试更新 user_id
            console.log('3. Attempting to update user_id...');
            const updateResponse = await fetch(`${supabaseUrl}/rest/v1/travel_plans?id=eq.${planId}`, {
                method: 'PATCH',
                headers: {
                    'apikey': supabaseServiceKey,
                    'Authorization': `Bearer ${supabaseServiceKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                    user_id: userId
                })
            });

            const updateData = await updateResponse.json();
            console.log('Update response status:', updateResponse.status);
            console.log('Update response data:', updateData);

            if (updateResponse.status === 200) {
                console.log('Successfully updated user_id for travel plan');
            } else {
                console.log('Failed to update user_id:', updateData);
            }
        }
    }
}

createTravelPlanWithoutUser();