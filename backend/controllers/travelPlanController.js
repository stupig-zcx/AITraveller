// 添加全局fetch支持
const fetch = require('node-fetch');
global.fetch = fetch;

// 从环境变量获取Supabase配置
require('dotenv').config({ path: __dirname + '/../.env' });
const supabaseUrl = process.env.SUPABASE_URL || 'https://olsezvgkkwwpvbdkdusq.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s';

console.log('Supabase Configuration:');
console.log('- URL:', supabaseUrl);
console.log('- Key exists:', !!supabaseKey);
console.log('- Key length:', supabaseKey ? supabaseKey.length : 0);

// 直接使用fetch API与Supabase交互
async function supabaseFetch(endpoint, options = {}) {
  const url = `${supabaseUrl}/rest/v1/${endpoint}`;
  const defaultHeaders = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  console.log(`Supabase Request to ${url}:`, {
    method: config.method || 'GET',
    headers: config.headers
  });

  const response = await fetch(url, config);
  
  console.log(`Supabase Response from ${url}:`, {
    status: response.status,
    statusText: response.statusText
  });

  return response;
}

// 保存旅行计划
async function saveTravelPlan(req, res) {
  try {
    const { userId, travelPlan } = req.body;
    
    console.log('Saving travel plan for user:', userId);
    console.log('Travel plan data:', JSON.stringify(travelPlan, null, 2));
    
    // 插入旅行计划到数据库
    const response = await supabaseFetch('travel_plans', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        title: travelPlan.title,
        total_consumption: travelPlan.total_consumption,
        days_detail: travelPlan.days_detail,
        created_at: new Date().toISOString()
      })
    });
    
    console.log('Insert travel plan response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Insert travel plan error response:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || 'Unknown error' };
      }
      return res.status(400).json({ error: errorData.message });
    }
    
    // 尝试解析响应体
    const responseText = await response.text();
    console.log('Insert travel plan response text:', responseText);
    
    let planData;
    try {
      planData = JSON.parse(responseText);
    } catch (e) {
      console.log('Failed to parse JSON, using empty array');
      planData = [{}]; // 默认值
    }
    
    console.log('Insert travel plan success:', planData);
    
    // 检查是否有返回数据
    if (!planData || planData.length === 0) {
      console.warn('No data returned from insert operation');
      return res.status(200).json({ 
        message: '旅行计划保存成功，但无返回数据', 
        plan: null 
      });
    }
    
    return res.status(200).json({ 
      message: '旅行计划保存成功', 
      plan: planData[0] 
    });
  } catch (error) {
    console.error('Save travel plan error:', error);
    return res.status(500).json({ error: '服务器内部错误: ' + error.message });
  }
}

// 获取用户的所有旅行计划
async function getUserTravelPlans(req, res) {
  try {
    const { userId } = req.params;
    
    console.log('Fetching travel plans for user:', userId);
    
    // 查询用户的旅行计划
    const response = await supabaseFetch(`travel_plans?user_id=eq.${userId}&order=created_at.desc`);
    
    console.log('Get travel plans response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Get travel plans error response:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || 'Unknown error' };
      }
      return res.status(400).json({ error: errorData.message });
    }
    
    const plansData = await response.json();
    console.log('Get plans data:', plansData);
    
    return res.status(200).json({ plans: plansData });
  } catch (error) {
    console.error('Get user travel plans error:', error);
    return res.status(500).json({ error: '服务器内部错误: ' + error.message });
  }
}

// 获取特定旅行计划
async function getTravelPlanById(req, res) {
  try {
    const { planId } = req.params;
    
    // 查询特定的旅行计划
    const response = await supabaseFetch(`travel_plans?id=eq.${planId}`);
    
    console.log('Get travel plan response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Get travel plan error response:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || 'Unknown error' };
      }
      return res.status(400).json({ error: errorData.message });
    }
    
    const planData = await response.json();
    console.log('Get plan data:', planData);
    
    if (!planData || planData.length === 0) {
      return res.status(404).json({ error: '旅行计划未找到' });
    }
    
    return res.status(200).json({ plan: planData[0] });
  } catch (error) {
    console.error('Get travel plan error:', error);
    return res.status(500).json({ error: '服务器内部错误: ' + error.message });
  }
}

// 更新旅行计划
async function updateTravelPlan(req, res) {
  try {
    const { planId } = req.params;
    const { travelPlan } = req.body;
    
    // 更新旅行计划
    const response = await supabaseFetch(`travel_plans?id=eq.${planId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: travelPlan.title,
        total_consumption: travelPlan.total_consumption,
        days_detail: travelPlan.days_detail,
        updated_at: new Date().toISOString()
      })
    });
    
    console.log('Update travel plan response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Update travel plan error response:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || 'Unknown error' };
      }
      return res.status(400).json({ error: errorData.message });
    }
    
    // 获取更新后的数据
    const getResponse = await supabaseFetch(`travel_plans?id=eq.${planId}`);
    const updatedData = await getResponse.json();
    
    return res.status(200).json({ 
      message: '旅行计划更新成功', 
      plan: updatedData[0] 
    });
  } catch (error) {
    console.error('Update travel plan error:', error);
    return res.status(500).json({ error: '服务器内部错误: ' + error.message });
  }
}

// 删除旅行计划
async function deleteTravelPlan(req, res) {
  try {
    const { planId } = req.params;
    
    // 删除旅行计划
    const response = await supabaseFetch(`travel_plans?id=eq.${planId}`, {
      method: 'DELETE'
    });
    
    console.log('Delete travel plan response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Delete travel plan error response:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || 'Unknown error' };
      }
      return res.status(400).json({ error: errorData.message });
    }
    
    return res.status(200).json({ message: '旅行计划删除成功' });
  } catch (error) {
    console.error('Delete travel plan error:', error);
    return res.status(500).json({ error: '服务器内部错误: ' + error.message });
  }
}

module.exports = {
  saveTravelPlan,
  getUserTravelPlans,
  getTravelPlanById,
  updateTravelPlan,
  deleteTravelPlan
};