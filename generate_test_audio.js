// 生成一个简单的测试音频文件
const fs = require('fs');
const path = require('path');

// 创建一个简单的PCM音频数据（模拟音频）
function generateTestTone() {
  const sampleRate = 16000;  // 16kHz
  const duration = 3;        // 3秒
  const frequency = 440;     // 440Hz (A音)
  
  const totalSamples = sampleRate * duration;
  const buffer = Buffer.alloc(totalSamples * 2); // 16-bit = 2 bytes per sample
  
  for (let i = 0; i < totalSamples; i++) {
    // 生成正弦波
    const amplitude = Math.sin(2 * Math.PI * frequency * i / sampleRate);
    // 转换为16位整数
    const sample = Math.round(amplitude * 0x7FFF);
    // 写入buffer (小端序)
    buffer.writeInt16LE(sample, i * 2);
  }
  
  return buffer;
}

// 生成测试音频文件
function generateTestAudio() {
  const pcmData = generateTestTone();
  const filePath = path.join(__dirname, 'test_audio.pcm');
  fs.writeFileSync(filePath, pcmData);
  console.log(`测试PCM音频文件已生成: ${filePath}`);
  console.log(`文件大小: ${pcmData.length} 字节`);
  console.log('注意: 这是一个简单的正弦波音频，不会被识别为有意义的语音');
  console.log('要测试真实的语音识别，需要提供真实的语音录音文件');
}

generateTestAudio();