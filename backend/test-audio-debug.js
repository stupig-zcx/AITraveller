const fs = require('fs');
const NewIFlytekSpeechService = require('./services/newIflytekService');

// 从文件读取音频数据进行测试
async function testSpeechRecognition() {
  try {
    // 初始化科大讯飞服务
    const iflytekService = new NewIFlytekSpeechService();
    console.log('科大讯飞服务初始化成功');
    
    // 读取测试音频文件
    // 这里假设您会把录制的音频保存为base64格式的文本文件
    const audioDataBase64 = fs.readFileSync('test-audio.txt', 'utf-8');
    console.log('读取音频数据，长度:', audioDataBase64.length);
    
    // 调用语音识别
    console.log('开始语音识别...');
    const result = await iflytekService.speechToText(audioDataBase64);
    console.log('识别结果:', result);
    console.log('结果长度:', result.length);
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

// 保存音频数据到文件
function saveAudioData(audioDataBase64) {
  try {
    fs.writeFileSync('test-audio.txt', audioDataBase64, 'utf-8');
    console.log('音频数据已保存到 test-audio.txt');
  } catch (error) {
    console.error('保存音频数据时出错:', error);
  }
}

// 从文件读取并测试
testSpeechRecognition();