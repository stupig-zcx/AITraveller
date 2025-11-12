const fetch = require('node-fetch');

// 引入环境变量
require('dotenv').config({ path: __dirname + '/.env' });

// 从环境变量获取配置
const supabaseUrl = process.env.SUPABASE_URL || 'https://olsezvgkkwwpvbdkdusq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s';

async function createTravelPlan() {
    console.log('Creating travel plan...');
    
    const response = await fetch(`${supabaseUrl}/rest/v1/travel_plans`, {
        method: 'POST',
        headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({
            user_id: '72cf0010-b91a-4ee2-b645-19dc6f0292e6',
            title: '测试旅游计划',
            total_consumption: '5000元',
            days_detail: [
                {
                    date: '2023-06-01',
                    transportation: '飞机',
                    accommodation: '测试酒店',
                    attractions: [
                        {
                            name: '测试景点',
                            time: '10:00',
                            transportation: '步行',
                            ticket_price: '100元',
                            introduction: '这是一个测试景点',
                            address: '测试地址'
                        }
                    ]
                }
            ],
            created_at: new Date().toISOString()
        })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
}

createTravelPlan();