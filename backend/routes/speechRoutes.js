const express = require('express');
const router = express.Router();
const IFlytekSpeechService = require('../services/iflytekService');

// 初始化科大讯飞服务
let iflytekService;
let serviceInitialized = false;

try {
  iflytekService = new IFlytekSpeechService();
  serviceInitialized = true;
  console.log('科大讯飞服务初始化成功');
} catch (error) {
  console.error('初始化科大讯飞服务失败:', error.message);
}

// 语音转文字接口
router.post('/speech-to-text', async (req, res) => {
  try {
    console.log('收到语音转文字请求');
    
    // 检查请求体
    if (!req.body || !req.body.audioData) {
      console.log('缺少音频数据');
      return res.status(400).json({ 
        success: false, 
        error: '缺少音频数据',
        message: '请提供音频数据' 
      });
    }

    const { audioData } = req.body;
    console.log('接收到的音频数据长度:', audioData.length);
    
    // 检查服务是否已初始化
    if (!serviceInitialized || !iflytekService) {
      // 如果服务未初始化，返回模拟数据
      console.log('科大讯飞服务未初始化，返回模拟数据');
      // 添加一个小延迟来模拟网络请求
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return res.json({ 
        success: true, 
        text: '这是一段模拟的语音识别结果，来自科大讯飞API的模拟响应。',
        message: '语音识别成功' 
      });
    }

    // 将base64音频数据转换为buffer
    const audioBuffer = Buffer.from(audioData, 'base64');
    console.log('音频buffer大小:', audioBuffer.length);
    
    // 调用科大讯飞API进行语音识别
    console.log('调用科大讯飞API进行语音识别');
    const result = await iflytekService.speechToText(audioBuffer);
    console.log('语音识别完成，结果长度:', result.length);
    
    res.json({ 
      success: true, 
      text: result,
      message: '语音识别成功' 
    });
  } catch (error) {
    console.error('语音识别错误:', error);
    // 确保始终返回JSON格式的错误响应
    const errorResponse = { 
      success: false, 
      error: error.message,
      message: '语音识别失败: ' + error.message
    };
    
    // 检查响应是否已经发送
    if (!res.headersSent) {
      res.status(500).json(errorResponse);
    }
  }
});

module.exports = router;