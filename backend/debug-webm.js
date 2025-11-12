const fs = require('fs');
const path = require('path');

// 读取通过网站保存的WebM文件
const webmPath = path.join(__dirname, '../received-audio-debug.txt');
if (fs.existsSync(webmPath)) {
  const base64Data = fs.readFileSync(webmPath, 'utf-8');
  console.log('Base64数据长度:', base64Data.length);
  
  // 将Base64数据保存为WebM文件
  const webmBuffer = Buffer.from(base64Data, 'base64');
  const outputPath = path.join(__dirname, 'debug_received.webm');
  fs.writeFileSync(outputPath, webmBuffer);
  console.log('WebM文件已保存到:', outputPath);
  console.log('WebM文件大小:', webmBuffer.length, '字节');
} else {
  console.log('未找到 received-audio-debug.txt 文件');
}

// 读取通过"保存录音"按钮保存的文件
const savedWebmPath = path.join(__dirname, '../recording.webm');
if (fs.existsSync(savedWebmPath)) {
  const savedWebmBuffer = fs.readFileSync(savedWebmPath);
  console.log('保存的WebM文件大小:', savedWebmBuffer.length, '字节');
  
  // 将其转换为Base64进行比较
  const savedBase64 = savedWebmBuffer.toString('base64');
  console.log('保存的WebM Base64长度:', savedBase64.length);
} else {
  console.log('未找到 recording.webm 文件');
}