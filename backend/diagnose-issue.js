const fetch = require('node-fetch');

// 引入环境变量
require('dotenv').config({ path: __dirname + '/.env' });

// 从环境变量获取配置
const supabaseUrl = process.env.SUPABASE_URL || 'https://olsezvgkkwwpvbdkdusq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s';

async function diagnoseIssue() {
    try {
        console.log('Diagnosing Supabase API issues...');
        
        // 1. 检查用户表
        console.log('1. Checking users table...');
        const usersResponse = await fetch(`${supabaseUrl}/rest/v1/users?select=*`, {
            method: 'GET',
            headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        const usersData = await usersResponse.json();
        console.log('Users in database:', usersData);
        
        // 2. 检查旅游计划表
        console.log('2. Checking travel plans table...');
        const plansResponse = await fetch(`${supabaseUrl}/rest/v1/travel_plans?select=*`, {
            method: 'GET',
            headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        const plansData = await plansResponse.json();
        console.log('Travel plans in database:', plansData);
        
        // 3. 尝试直接查询特定用户是否存在
        console.log('3. Checking specific user...');
        const specificUserResponse = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.72cf0010-b91a-4ee2-b645-19dc6f0292e6`, {
            method: 'GET',
            headers: {
                'apikey': supabaseServiceKey,
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        const specificUserData = await specificUserResponse.json();
        console.log('Specific user check:', specificUserData);
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

diagnoseIssue().catch(console.error);