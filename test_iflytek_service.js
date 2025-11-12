const fs = require('fs');
const path = require('path');
const iflytekService = require('./backend/services/newIflytekService');

async function testIflytekService() {
  try {
    console.log('开始测试科大讯飞语音识别服务...');
    
    // 检查测试音频文件是否存在
    const testAudioPath = path.join(__dirname, 'test_audio.webm');
    if (!fs.existsSync(testAudioPath)) {
      console.log('未找到测试音频文件: test_audio.webm');
      console.log('请提供一个WebM格式的音频文件用于测试');
      return;
    }
    
    // 读取音频文件
    const audioBuffer = fs.readFileSync(testAudioPath);
    console.log(`读取音频文件成功，大小: ${audioBuffer.length} 字节`);
    
    // 调用语音识别服务
    console.log('调用语音识别服务...');
    const result = await iflytekService.voiceToText(audioBuffer);
    
    console.log('语音识别结果:', result);
    console.log('结果类型:', typeof result);
    console.log('结果长度:', result.length);
    
    if (result && result.length > 0) {
      console.log('✓ 语音识别成功，返回了非空结果');
    } else {
      console.log('✗ 语音识别完成但返回了空结果');
    }
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

// 运行测试
testIflytekService();