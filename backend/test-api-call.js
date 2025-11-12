const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 测试新的API端点
async function testAPICall() {
  try {
    console.log('测试新的API端点...');
    
    // 使用简短的测试数据
    const testAudioData = 'dGVzdCBhdWRpbyBkYXRh'; // "test audio data"的base64编码
    console.log('测试数据长度:', testAudioData.length);
    
    // 发送请求到新的API端点
    const response = await axios.post('http://localhost:3000/api/new-speech/new-speech-to-text', {
      audioData: testAudioData
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('响应状态:', response.status);
    console.log('响应结果:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('API调用测试失败:', error.message);
    if (error.response) {
      console.error('错误响应:', error.response.status, JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

// 运行测试
if (require.main === module) {
  testAPICall()
    .then(result => {
      console.log('测试完成');
      process.exit(0);
    })
    .catch(error => {
      console.error('测试失败:', error);
      process.exit(1);
    });
}