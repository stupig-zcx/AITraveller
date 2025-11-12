const fs = require('fs');
const path = require('path');
const NewIFlytekSpeechService = require('./services/newIflytekService');

async function testLocalFile() {
  try {
    console.log('开始测试本地音频文件识别...');
    
    // 初始化科大讯飞服务
    const iflytekService = new NewIFlytekSpeechService();
    console.log('科大讯飞服务初始化成功');
    
    // 读取本地ex.webm文件
    const filePath = path.join(__dirname, '../ex.webm');
    console.log('读取文件路径:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error('文件不存在:', filePath);
      return;
    }
    
    const audioBuffer = fs.readFileSync(filePath);
    console.log('文件读取成功，大小:', audioBuffer.length, '字节');
    
    // 调用语音识别
    console.log('开始语音识别...');
    const result = await iflytekService.speechToText(audioBuffer);
    console.log('语音识别完成');
    
    if (result && result.length > 0) {
      console.log('识别成功，文本内容:', result);
    } else {
      console.log('识别结果为空');
    }
  } catch (error) {
    console.error('测试过程中出错:', error);
    console.error('错误详情:', error.stack);
  }
}

// 运行测试
testLocalFile();