// 简单测试脚本
const http = require('http');

// 测试根路径
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET'
};

console.log('测试根路径...');

const req = http.request(options, (res) => {
  console.log('状态码:', res.statusCode);
  console.log('响应头:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('响应体:', data);
  });
});

req.on('error', (error) => {
  console.error('请求错误:', error);
});

req.end();