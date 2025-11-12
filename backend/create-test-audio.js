const fs = require('fs');
const path = require('path');

// 创建一个简单的测试音频文件
function createTestAudio() {
  // 创建一个简单的WAV文件头
  const wavHeader = Buffer.from([
    0x52, 0x49, 0x46, 0x46, // "RIFF"
    0x24, 0x00, 0x00, 0x00, // 文件大小 (36 bytes)
    0x57, 0x41, 0x56, 0x45, // "WAVE"
    0x66, 0x6d, 0x74, 0x20, // "fmt "
    0x10, 0x00, 0x00, 0x00, // fmt块大小 (16 bytes)
    0x01, 0x00,             // 音频格式 (1 = PCM)
    0x01, 0x00,             // 声道数 (1 = 单声道)
    0x80, 0x3e, 0x00, 0x00, // 采样率 (16000 Hz)
    0x00, 0x7d, 0x00, 0x00, // 字节率 (16000 * 1 * 2 = 32000)
    0x02, 0x00,             // 块对齐 (1 * 2 = 2)
    0x10, 0x00,             // 位深度 (16 bits)
    0x64, 0x61, 0x74, 0x61, // "data"
    0x00, 0x00, 0x00, 0x00  // 数据大小 (0 bytes)
  ]);
  
  // 创建一些简单的音频数据 (16位PCM, 16kHz, 1秒的静音)
  const audioData = Buffer.alloc(32000, 0); // 1秒的静音数据
  
  // 更新文件大小
  const fileSize = wavHeader.length + audioData.length - 8;
  wavHeader.writeUInt32LE(fileSize, 4);
  
  // 更新数据块大小
  const dataSize = audioData.length;
  wavHeader.writeUInt32LE(dataSize, 40);
  
  // 组合完整的WAV文件
  const wavFile = Buffer.concat([wavHeader, audioData]);
  
  // 保存到文件
  const outputPath = path.join(__dirname, 'test-audio.wav');
  fs.writeFileSync(outputPath, wavFile);
  
  console.log(`测试音频文件已创建: ${outputPath}`);
  console.log(`文件大小: ${wavFile.length} 字节`);
  
  // 同时创建base64版本
  const base64Data = wavFile.toString('base64');
  const base64Path = path.join(__dirname, 'test-audio.txt');
  fs.writeFileSync(base64Path, base64Data);
  
  console.log(`Base64音频文件已创建: ${base64Path}`);
  console.log(`Base64数据长度: ${base64Data.length} 字符`);
  
  return base64Data;
}

// 运行创建测试音频
if (require.main === module) {
  createTestAudio();
}

module.exports = createTestAudio;