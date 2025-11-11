const fetch = require('node-fetch');

async function testForeignKey() {
  try {
    console.log('Testing foreign key constraint with a simple insert...');
    
    // 直接尝试插入一个带有user_id的记录
    const response = await fetch('https://olsezvgkkwwpvbdkdusq.supabase.co/rest/v1/travel_plans', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        user_id: '72cf0010-b91a-4ee2-b645-19dc6f0292e6',
        title: '测试计划',
        total_consumption: '100元'
      })
    });
    
    console.log('Direct insert response status:', response.status);
    
    if (response.status === 201) {
      console.log('Direct insert successful - foreign key constraint is working correctly');
    } else {
      const errorData = await response.json();
      console.log('Direct insert failed:', errorData);
      
      // 如果失败，尝试不带user_id的插入
      console.log('Trying insert without user_id...');
      const response2 = await fetch('https://olsezvgkkwwpvbdkdusq.supabase.co/rest/v1/travel_plans', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s',
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          title: '测试计划2',
          total_consumption: '200元'
        })
      });
      
      console.log('Insert without user_id status:', response2.status);
      if (response2.status === 201) {
        console.log('Insert without user_id successful');
      } else {
        const errorData2 = await response2.json();
        console.log('Insert without user_id failed:', errorData2);
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testForeignKey();