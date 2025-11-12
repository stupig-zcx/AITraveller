const IFlytekSpeechService = require('./services/iflytekService');
const fs = require('fs');
const path = require('path');

async function testIFlytekAPI() {
  try {
    console.log('开始测试科大讯飞语音识别API...');
    
    // 初始化服务
    const iflytekService = new IFlytekSpeechService();
    console.log('科大讯飞服务初始化成功');
    
    // 读取测试音频文件
    // 这里我们创建一个简短的音频数据用于测试
    // 在实际应用中，这将是真实的音频数据
    const testAudioPath = path.join(__dirname, 'test-audio.txt');
    
    // 创建测试音频数据（模拟）
    let testAudioData;
    try {
      // 尝试读取真实音频文件
      testAudioData = fs.readFileSync(testAudioPath, 'base64');
      console.log('读取测试音频文件成功');
    } catch (err) {
      console.log('未找到测试音频文件，使用模拟数据');
      // 创建模拟音频数据
      testAudioData = 'UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==';
    }
    
    console.log('测试音频数据长度:', testAudioData.length);
    
    // 将base64数据转换为buffer
    const audioBuffer = Buffer.from(testAudioData, 'base64');
    console.log('音频buffer大小:', audioBuffer.length);
    
    // 调用语音识别服务
    console.log('调用语音识别服务...');
    const result = await iflytekService.speechToText(audioBuffer);
    console.log('语音识别结果:', result);
    
    console.log('测试完成');
    return result;
  } catch (error) {
    console.error('测试过程中出现错误:', error.message);
    throw error;
  }
}

// 运行测试
if (require.main === module) {
  testIFlytekAPI()
    .then(result => {
      console.log('最终结果:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('测试失败:', error);
      process.exit(1);
    });
}

module.exports = testIFlytekAPI;