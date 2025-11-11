require('dotenv').config(); // 确保加载环境变量

const supabase = require('./supabaseClient');

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
    console.log('SUPABASE_SERVICE_KEY exists:', !!process.env.SUPABASE_SERVICE_KEY);
    
    // 测试数据库连接 - 尝试获取旅行计划表中的记录
    const { data, error } = await supabase
      .from('travel_plans')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error querying travel_plans table:', error);
    } else {
      console.log('Database connection successful. Found', data.length, 'records in travel_plans table.');
    }
    
    // 测试插入一条记录
    console.log('Testing data insertion...');
    const { data: insertData, error: insertError } = await supabase
      .from('travel_plans')
      .insert([
        {
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
        }
      ])
      .select();
    
    if (insertError) {
      console.error('Error inserting test record:', insertError);
    } else {
      console.log('Data insertion successful. Inserted record ID:', insertData[0].id);
      
      // 测试删除这条记录以保持数据库清洁
      const { error: deleteError } = await supabase
        .from('travel_plans')
        .delete()
        .eq('id', insertData[0].id);
        
      if (deleteError) {
        console.error('Error deleting test record:', deleteError);
      } else {
        console.log('Test record deleted successfully.');
      }
    }
    
    console.log('Supabase connection test completed successfully!');
  } catch (error) {
    console.error('Error during Supabase connection test:', error);
  }
}

// 如果直接运行此脚本，则执行测试
if (require.main === module) {
  testSupabaseConnection();
}

module.exports = testSupabaseConnection;