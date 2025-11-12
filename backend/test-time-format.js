const { createHmac } = require('crypto');

// 测试时间格式
const date = new Date().toGMTString();
console.log('当前时间 (GMT):', date);
console.log('时间格式是否符合RFC1123标准:', /^[\w]{3}, [\d]{1,2} [\w]{3} [\d]{4} [\d]{2}:[\d]{2}:[\d]{2} GMT$/.test(date));

// 测试签名过程
const host = 'iat.xf-yun.com';
const requestLine = 'GET /v1 HTTP/1.1';
const APISecret = 'YTZhNTA3NjYwNGUzYzRlYjA2Nzc0OTMx';
const APIKey = 'b5f70b0f61f68ada14e3c9bcf23fc819';

console.log('\n构建签名参数:');
console.log('- Host:', host);
console.log('- Request Line:', requestLine);

const signatureOrigin = `host: ${host}\ndate: ${date}\n${requestLine}`;
console.log('\n签名原始字段:');
console.log(signatureOrigin);

const signatureSha = createHmac('sha256', APISecret).update(signatureOrigin).digest('base64');
console.log('\n签名SHA256 (Base64):');
console.log(signatureSha);

// 构建授权信息
const authorizationOrigin = `api_key="${APIKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signatureSha}"`;
console.log('\n授权原始字段:');
console.log(authorizationOrigin);

const authorization = Buffer.from(authorizationOrigin).toString('base64');
console.log('\nBase64编码后的授权字段:');
console.log(authorization);