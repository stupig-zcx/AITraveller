const { createHmac } = require('crypto');

// 引入环境变量
require('dotenv').config({ path: __dirname + '/.env' });

const APPID = process.env.IFLYTEK_APP_ID || '2586de2e';
const APIKey = process.env.IFLYTEK_API_KEY || 'b5f70b0f61f68ada14e3c9bcf23fc819';
const APISecret = process.env.IFLYTEK_API_SECRET || 'YTZhNTA3NjYwNGUzYzRlYjA2Nzc0OTMx';

// 请求参数
const url = 'wss://iat.xf-yun.com/v1';
const host = 'iat.xf-yun.com';
const date = new Date().toGMTString(); // RFC1123格式
const requestLine = 'GET /v1 HTTP/1.1';

console.log('=== 科大讯飞API鉴权参数验证 ===\n');

console.log('1. 基本参数检查:');
console.log('   - URL:', url);
console.log('   - Host:', host);
console.log('   - Date:', date);
console.log('   - Request Line:', requestLine);
console.log('   - APPID:', APPID);
console.log('   - APIKey:', APIKey);
console.log('   - APISecret:', APISecret);

// 验证时间格式是否符合RFC1123
const rfc1123Regex = /^[A-Z][a-z]{2}, \d{1,2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/;
const isRFC1123 = rfc1123Regex.test(date);
console.log('\n2. 时间格式验证:');
console.log('   - 符合RFC1123格式:', isRFC1123);

// 构建签名原始字段
const signatureOrigin = `host: ${host}\ndate: ${date}\n${requestLine}`;
console.log('\n3. 签名原始字段 (signature_origin):');
console.log('   ' + signatureOrigin.replace(/\n/g, '\\n'));

// 使用HMAC-SHA256算法签名
const signatureSha = createHmac('sha256', APISecret).update(signatureOrigin).digest('base64');
console.log('\n4. HMAC-SHA256签名结果 (signature_sha):');
console.log('   ' + signatureSha);

// 构建authorization原始字段
const authorizationOrigin = `api_key="${APIKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signatureSha}"`;
console.log('\n5. 授权原始字段 (authorization_origin):');
console.log('   ' + authorizationOrigin);

// Base64编码authorization原始字段
const authorization = Buffer.from(authorizationOrigin).toString('base64');
console.log('\n6. Base64编码后的授权字段 (authorization):');
console.log('   ' + authorization);

// 构建完整URL
const encodedAuthorization = encodeURIComponent(authorization);
const encodedDate = encodeURIComponent(date);
const websocketUrl = `${url}?authorization=${encodedAuthorization}&date=${encodedDate}&host=${host}`;
console.log('\n7. 完整WebSocket URL:');
console.log('   ' + websocketUrl);

console.log('\n=== 验证完成 ===');