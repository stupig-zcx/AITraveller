const fetch = require('node-fetch');

async function createTravelPlan() {
  try {
    console.log('Attempting to create a test travel plan using fetch...');
    
    const response = await fetch('https://olsezvgkkwwpvbdkdusq.supabase.co/rest/v1/travel_plans', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        user_id: '72cf0010-b91a-4ee2-b645-19dc6f0292e6',
        title: '测试旅行计划2',
        total_consumption: '2000元',
        days_detail: [
          {
            date: '2023-01-02',
            transportation: '火车',
            accommodation: '民宿',
            attractions: [
              {
                name: '景点2',
                ticket_price: '200元',
                introduction: '这是第二个测试景点',
                address: '测试地址2'
              }
            ],
            food: [
              {
                name: '餐厅2',
                price_per_person: '80元',
                recommendation: '特色菜品'
              }
            ],
            activities: [
              {
                name: '活动2',
                cost: '50元',
                description: '活动描述2'
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
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

createTravelPlan();