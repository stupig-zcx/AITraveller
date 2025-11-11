const supabase = require('../supabaseClient');

// 保存旅行计划
async function saveTravelPlan(req, res) {
  try {
    const { userId, travelPlan } = req.body;
    
    // 插入旅行计划到数据库
    const { data, error } = await supabase
      .from('travel_plans')
      .insert([
        {
          user_id: userId,
          title: travelPlan.title,
          total_consumption: travelPlan.total_consumption,
          days_detail: travelPlan.days_detail,
          created_at: new Date()
        }
      ])
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(200).json({ 
      message: '旅行计划保存成功', 
      plan: data[0] 
    });
  } catch (error) {
    return res.status(500).json({ error: '服务器内部错误' });
  }
}

// 获取用户的所有旅行计划
async function getUserTravelPlans(req, res) {
  try {
    const { userId } = req.params;
    
    // 查询用户的旅行计划
    const { data, error } = await supabase
      .from('travel_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(200).json({ plans: data });
  } catch (error) {
    return res.status(500).json({ error: '服务器内部错误' });
  }
}

// 获取特定旅行计划
async function getTravelPlanById(req, res) {
  try {
    const { planId } = req.params;
    
    // 查询特定的旅行计划
    const { data, error } = await supabase
      .from('travel_plans')
      .select('*')
      .eq('id', planId)
      .single();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(200).json({ plan: data });
  } catch (error) {
    return res.status(500).json({ error: '服务器内部错误' });
  }
}

// 更新旅行计划
async function updateTravelPlan(req, res) {
  try {
    const { planId } = req.params;
    const { travelPlan } = req.body;
    
    // 更新旅行计划
    const { data, error } = await supabase
      .from('travel_plans')
      .update({
        title: travelPlan.title,
        total_consumption: travelPlan.total_consumption,
        days_detail: travelPlan.days_detail,
        updated_at: new Date()
      })
      .eq('id', planId)
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(200).json({ 
      message: '旅行计划更新成功', 
      plan: data[0] 
    });
  } catch (error) {
    return res.status(500).json({ error: '服务器内部错误' });
  }
}

// 删除旅行计划
async function deleteTravelPlan(req, res) {
  try {
    const { planId } = req.params;
    
    // 删除旅行计划
    const { error } = await supabase
      .from('travel_plans')
      .delete()
      .eq('id', planId);
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(200).json({ message: '旅行计划删除成功' });
  } catch (error) {
    return res.status(500).json({ error: '服务器内部错误' });
  }
}

module.exports = {
  saveTravelPlan,
  getUserTravelPlans,
  getTravelPlanById,
  updateTravelPlan,
  deleteTravelPlan
};