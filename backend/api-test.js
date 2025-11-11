require('dotenv').config();

// 添加node-fetch支持
import('node-fetch').then((module) => {
  const fetch = module.default;

  async function testSupabaseAPI() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
    
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Service Key exists:', !!supabaseServiceKey);
    
    try {
      // 首先查询现有记录
      console.log('Testing data retrieval...');
      let response = await fetch(`${supabaseUrl}/rest/v1/travel_plans?limit=1`, {
        method: 'GET',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        }
      });
      
      console.log('Retrieval response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        return;
      }
      
      let data = await response.json();
      console.log('Data retrieval successful! Found', data.length, 'records');
      
      // 然后测试创建新记录
      console.log('Testing data insertion...');
      const newPlan = {
        title: '测试旅行计划',
        total_consumption: '1000元',
        days_detail: [
          {
            Title: '第一天',
            Consumption: '500元',
            Stay: '测试酒店',
            Locations: [
              {
                name: '测试景点',
                time: '上午10点',
                content: '这是一个测试景点',
                transportation: '步行',
                consumption: '100元',
                consumptionSource: '门票'
              }
            ]
          }
        ]
      };
      
      response = await fetch(`${supabaseUrl}/rest/v1/travel_plans`, {
        method: 'POST',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(newPlan)
      });
      
      console.log('Insertion response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Insertion API Error:', errorText);
        return;
      }
      
      data = await response.json();
      console.log('Data insertion successful! Inserted record ID:', data[0].id);
      
      // 最后再次查询以确认记录已插入
      console.log('Verifying data insertion...');
      response = await fetch(`${supabaseUrl}/rest/v1/travel_plans?id=eq.${data[0].id}`, {
        method: 'GET',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Verification API Error:', errorText);
        return;
      }
      
      data = await response.json();
      console.log('Verification successful! Record found:', JSON.stringify(data[0], null, 2));
      
    } catch (error) {
      console.error('Error testing Supabase API:', error);
    }
  }

  testSupabaseAPI();
}).catch((error) => {
  console.error('Error importing node-fetch:', error);
});