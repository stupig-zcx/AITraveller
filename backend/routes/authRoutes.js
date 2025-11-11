const express = require('express');
const { register, login, logout, getUserProfile } = require('../controllers/authController');

const router = express.Router();

// 注册路由
router.post('/register', register);

// 登录路由
router.post('/login', login);

// 登出路由
router.post('/logout', logout);

// 获取用户资料和旅游计划路由
router.get('/profile/:userId', getUserProfile);

module.exports = router;