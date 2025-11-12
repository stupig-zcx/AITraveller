const NewIFlytekSpeechService = require('./services/newIflytekService');
const fs = require('fs');
const path = require('path');

async function testNewSpeechAPI() {
  try {
    console.log('开始测试新的科大讯飞语音识别API...');
    
    // 初始化服务
    const iflytekService = new NewIFlytekSpeechService();
    console.log('新的科大讯飞服务初始化成功');
    
    // 读取测试音频文件
    const testAudioPath = path.join(__dirname, 'test-audio.txt');
    
    let testAudioData;
    try {
      // 读取真实音频文件
      testAudioData = fs.readFileSync(testAudioPath, 'utf-8');
      console.log('读取测试音频文件成功，长度:', testAudioData.length);
    } catch (err) {
      console.log('未找到测试音频文件，使用简短的模拟数据');
      // 创建非常简短的模拟音频数据
      testAudioData = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    }
    
    // 将base64数据转换为buffer
    const audioBuffer = Buffer.from(testAudioData, 'base64');
    console.log('音频buffer大小:', audioBuffer.length);
    
    // 调用语音识别服务
    console.log('调用语音识别服务...');
    const startTime = Date.now();
    const result = await iflytekService.speechToText(audioBuffer);
    const endTime = Date.now();
    console.log('语音识别结果:', result);
    console.log('识别耗时:', endTime - startTime, '毫秒');
    
    console.log('测试完成');
    return result;
  } catch (error) {
    console.error('测试过程中出现错误:', error);
    throw error;
  }
}

// 运行测试
if (require.main === module) {
  testNewSpeechAPI()
    .then(result => {
      console.log('最终结果:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('测试失败:', error);
      process.exit(1);
    });
}

module.exports = testNewSpeechAPI;