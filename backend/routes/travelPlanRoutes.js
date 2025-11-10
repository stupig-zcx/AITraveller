const express = require('express');
const {
  saveTravelPlan,
  getUserTravelPlans,
  getTravelPlanById,
  updateTravelPlan,
  deleteTravelPlan
} = require('../controllers/travelPlanController');

const router = express.Router();

// 保存旅行计划路由
router.post('/', saveTravelPlan);

// 获取用户所有旅行计划路由
router.get('/:userId', getUserTravelPlans);

// 获取特定旅行计划路由
router.get('/plan/:planId', getTravelPlanById);

// 更新旅行计划路由
router.put('/:planId', updateTravelPlan);

// 删除旅行计划路由
router.delete('/:planId', deleteTravelPlan);

module.exports = router;