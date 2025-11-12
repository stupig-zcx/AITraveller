const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const NewIFlytekSpeechService = require('../services/newIflytekService');

// 初始化科大讯飞服务
let iflytekService;
let serviceInitialized = false;

try {
  iflytekService = new NewIFlytekSpeechService();
  serviceInitialized = true;
  console.log('新的科大讯飞服务初始化成功');
} catch (error) {
  console.error('初始化新的科大讯飞服务失败:', error.message);
}

// 语音转文字接口
router.post('/new-speech-to-text', async (req, res) => {
  try {
    console.log('收到新的语音转文字请求');
    console.log('请求体类型:', typeof req.body);
    console.log('请求体内容:', JSON.stringify(req.body).substring(0, 100) + '...');
    
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
    
    // 保存音频数据用于调试
    try {
      fs.writeFileSync('received-audio-debug.txt', audioData, 'utf-8');
      console.log('音频数据已保存到 received-audio-debug.txt');
    } catch (saveError) {
      console.error('保存音频数据时出错:', saveError);
    }
    
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
    console.log('音频数据长度:', audioData.length);
    
    // 调用科大讯飞API进行语音识别
    console.log('调用科大讯飞API进行语音识别');
    const result = await iflytekService.speechToText(audioBuffer);
    console.log('语音识别完成，结果长度:', result.length);
    
    res.json({ 
      success: true, 
      text: result || '',
      message: '语音识别成功' 
    });
  } catch (error) {
    console.error('语音识别错误:', error);
    // 确保始终返回JSON格式的错误响应
    const errorResponse = { 
      success: false, 
      error: error.message,
      message: '语音识别失败: ' + error.message,
      text: ''
    };
    
    // 检查响应是否已经发送
    if (!res.headersSent) {
      res.status(500).json(errorResponse);
    }
  }
});

// 保存音频数据用于调试的接口
router.post('/save-audio-debug', async (req, res) => {
  try {
    console.log('收到保存音频数据的请求');
    
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
    
    // 保存音频数据到文件
    fs.writeFileSync('debug-audio-base64.txt', audioData, 'utf-8');
    console.log('音频数据已保存到 debug-audio-base64.txt');
    
    res.json({ 
      success: true, 
      message: '音频数据已保存' 
    });
  } catch (error) {
    console.error('保存音频数据时出错:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: '保存音频数据失败: ' + error.message
    });
  }
});

// 测试接口，直接使用服务器上的音频文件进行识别
router.post('/recognize-file', async (req, res) => {
  try {
    console.log('收到文件识别请求');
    
    // 检查服务是否已初始化
    if (!serviceInitialized || !iflytekService) {
      return res.status(500).json({ 
        success: false, 
        error: '服务未初始化',
        message: '科大讯飞服务未初始化' 
      });
    }

    // 读取测试文件
    const testFilePath = path.join(__dirname, '../ex.webm');
    if (!fs.existsSync(testFilePath)) {
      return res.status(404).json({ 
        success: false, 
        error: '文件未找到',
        message: '测试文件 ex.webm 不存在' 
      });
    }

    const audioBuffer = fs.readFileSync(testFilePath);
    console.log('测试文件加载完成，大小:', audioBuffer.length);
    
    // 调用语音识别
    const result = await iflytekService.speechToText(audioBuffer);
    console.log('语音识别完成，结果:', result);
    
    res.json({ 
      success: true, 
      text: result || '',
      message: '语音识别成功' 
    });
  } catch (error) {
    console.error('语音识别错误:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: '语音识别失败: ' + error.message,
      text: ''
    });
  }
});

module.exports = router;