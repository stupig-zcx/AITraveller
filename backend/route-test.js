// 测试路由
const http = require('http');

// 测试语音识别路由
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/speech/speech-to-text',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('测试语音识别路由...');

const req = http.request(options, (res) => {
  console.log('状态码:', res.statusCode);
  console.log('响应头:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('响应体:', data);
    
    // 尝试解析JSON
    try {
      const jsonData = JSON.parse(data);
      console.log('JSON解析成功:', jsonData);
    } catch (error) {
      console.log('JSON解析失败:', error.message);
    }
  });
});

req.on('error', (error) => {
  console.error('请求错误:', error);
});

// 发送简单的测试数据
req.write(JSON.stringify({ audioData: 'test' }));
req.end();