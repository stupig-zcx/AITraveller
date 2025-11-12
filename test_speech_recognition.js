const fs = require('fs');
const path = require('path');
const iflytekService = require('./backend/services/newIflytekService');

// 创建测试函数
async function testSpeechRecognition() {
  try {
    console.log('开始测试语音识别功能...');
    
    // 检查是否存在测试音频文件
    const testAudioPath = path.join(__dirname, 'test_audio.webm');
    
    if (!fs.existsSync(testAudioPath)) {
      console.log('未找到测试音频文件 test_audio.webm');
      console.log('请提供一个测试用的WebM音频文件，命名为 test_audio.webm 放在项目根目录');
      return;
    }
    
    // 读取测试音频文件
    const audioBuffer = fs.readFileSync(testAudioPath);
    console.log(`读取到音频文件，大小: ${audioBuffer.length} 字节`);
    
    // 调用语音识别服务
    console.log('调用科大讯飞语音识别服务...');
    const result = await iflytekService.voiceToText(audioBuffer);
    
    console.log('语音识别结果:', result);
    
    if (result && result.length > 0) {
      console.log('✓ 语音识别成功，返回了非空结果');
    } else {
      console.log('✗ 语音识别完成但返回了空结果');
    }
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

// 运行测试
testSpeechRecognition();