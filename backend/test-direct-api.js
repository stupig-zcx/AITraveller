const fetch = require('node-fetch');

async function testDirectAPI() {
  try {
    console.log('=== Testing Direct API Calls ===\n');
    
    const supabaseUrl = 'https://olsezvgkkwwpvbdkdusq.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s';
    
    // 测试查询用户表
    console.log('1. Testing users table query...');
    const usersResponse = await fetch(`${supabaseUrl}/rest/v1/users?limit=5`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Users response status:', usersResponse.status);
    
    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log('✓ Users table query successful');
      console.log('Found', usersData.length, 'users');
      if (usersData.length > 0) {
        console.log('Sample user:', usersData[0].username);
      }
    } else {
      console.log('✗ Users table query failed');
      const errorData = await usersResponse.json();
      console.log('Error:', errorData);
    }
    
    // 测试查询旅游计划表
    console.log('\n2. Testing travel_plans table query...');
    const plansResponse = await fetch(`${supabaseUrl}/rest/v1/travel_plans?limit=5`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Travel plans response status:', plansResponse.status);
    
    if (plansResponse.ok) {
      const plansData = await plansResponse.json();
      console.log('✓ Travel plans table query successful');
      console.log('Found', plansData.length, 'travel plans');
      if (plansData.length > 0) {
        console.log('Sample plan:', plansData[0].title);
      }
    } else {
      console.log('✗ Travel plans table query failed');
      const errorData = await plansResponse.json();
      console.log('Error:', errorData);
    }
    
    console.log('\n=== Direct API Test Completed ===');
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testDirectAPI();