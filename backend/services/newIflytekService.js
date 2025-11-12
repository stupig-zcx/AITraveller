const { createHash, createHmac } = require('crypto');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');

// 引入环境变量
require('dotenv').config({ path: __dirname + '/../../.env' });

class IflytekService {
  constructor() {
    // 从环境变量获取配置
    this.APPID = process.env.IFLYTEK_APP_ID || '2586de2e';
    this.APIKey = process.env.IFLYTEK_API_KEY || 'b5f70b0f61f68ada14e3c9bcf23fc819';
    this.APISecret = process.env.IFLYTEK_API_SECRET || 'YTZhNTA3NjYwNGUzYzRlYjA2Nzc0OTMx';
    
    // 添加日志以检查配置
    console.log('初始化科大讯飞服务:');
    console.log('- APPID:', this.APPID);
    console.log('- APIKey:', this.APIKey);
    console.log('- APISecret长度:', this.APISecret.length);
  }

  // 生成鉴权URL
  getAuthUrl() {
    const host = 'iat-api.xfyun.cn';
    const date = new Date().toGMTString();
    const requestLine = 'GET /v2/iat HTTP/1.1';
    
    console.log('构建认证信息:');
    console.log('- Host:', host);
    console.log('- Date:', date);
    console.log('- Request Line:', requestLine);

    // 构建签名
    const signatureOrigin = `host: ${host}\ndate: ${date}\n${requestLine}`;
    console.log('签名原始字段:', signatureOrigin);
    
    const signatureSha = createHmac('sha256', this.APISecret).update(signatureOrigin).digest('base64');
    console.log('签名SHA256:', signatureSha);
    
    const signature = signatureSha;

    // 构建授权信息
    const authorizationOrigin = `api_key="${this.APIKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
    console.log('授权原始字段:', authorizationOrigin);
    
    const authorization = Buffer.from(authorizationOrigin).toString('base64');
    console.log('Base64编码后的授权字段:', authorization);

    // 构建完整URL
    const url = `wss://${host}/v2/iat`;
    return `${url}?authorization=${encodeURIComponent(authorization)}&date=${encodeURIComponent(date)}&host=${host}`;
  }

  async convertWebMToPCM(webmFilePath) {
    return new Promise((resolve, reject) => {
      const pcmFilePath = webmFilePath.replace('.webm', '.pcm');
      
      ffmpeg(webmFilePath)
        .setFfmpegPath(ffmpegStatic)
        .audioCodec('pcm_s16le')
        .audioChannels(1)
        .audioFrequency(16000)
        .format('s16le')
        .on('end', () => {
          console.log('音频转换完成');
          resolve(pcmFilePath);
        })
        .on('error', (err) => {
          console.error('音频转换出错:', err);
          reject(err);
        })
        .save(pcmFilePath);
    });
  }

  // 从文件读取并识别语音
  async speechToText(audioBuffer) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('开始语音识别过程');
        
        // 保存原始音频数据到文件以便调试
        const timestamp = Date.now();
        const webmFilePath = path.join(__dirname, `../temp_audio_${timestamp}.webm`);
        fs.writeFileSync(webmFilePath, audioBuffer);
        console.log(`原始音频已保存至: ${webmFilePath}`);
        console.log(`原始音频大小: ${audioBuffer.length} 字节`);

        // 转换为PCM格式
        const pcmFilePath = await this.convertWebMToPCM(webmFilePath);
        
        // 读取PCM数据
        const pcmBuffer = fs.readFileSync(pcmFilePath);
        console.log(`PCM文件已生成: ${pcmFilePath}`);
        console.log(`PCM文件大小: ${pcmBuffer.length} 字节`);
        
        // 保存PCM文件用于进一步调试
        const debugPcmFilePath = path.join(__dirname, `../debug_${timestamp}.pcm`);
        fs.copyFileSync(pcmFilePath, debugPcmFilePath);
        console.log(`调试用PCM文件已保存至: ${debugPcmFilePath}`);

        // 获取鉴权URL
        const websocketUrl = this.getAuthUrl();
        console.log('WebSocket连接地址:', websocketUrl);

        // 连接WebSocket
        const ws = new WebSocket(websocketUrl);

        let fullResult = '';
        let isFinished = false;
        let sentenceResults = []; // 用于存储句子结果

        ws.on('open', () => {
          console.log('WebSocket连接已建立');

          // 发送开始参数 (根据新文档的第一帧数据格式)
          const startFrame = {
            "common": {
              "app_id": this.APPID
            },
            "business": {
              "language": "zh_cn",
              "domain": "iat",
              "accent": "mandarin",
              "dwa": "wpgs"
            },
            "data": {
              "status": 0
            }
          };

          console.log('发送开始帧:', JSON.stringify(startFrame, null, 2));
          ws.send(JSON.stringify(startFrame));

          // 分块发送音频数据 (根据文档建议每次发送1280字节)
          const chunkSize = 1280;
          let offset = 0;
          let seq = 1;

          const sendChunk = () => {
            if (offset >= pcmBuffer.length) {
              // 发送结束帧 (根据文档的最后一帧数据格式)
              const endFrame = {
                "data": {
                  "status": 2, // 最后一帧
                  "audio": "" // 最后一帧数据为空
                }
              };
              console.log('发送结束帧');
              ws.send(JSON.stringify(endFrame));
              return;
            }

            // 发送中间帧 (根据文档的中间帧数据格式)
            const chunk = pcmBuffer.slice(offset, offset + chunkSize);
            const dataFrame = {
              "data": {
                "status": 1, // 中间帧
                "audio": chunk.toString('base64'), // 音频数据base64编码
                "encoding": "raw" // raw PCM格式
              }
            };

            ws.send(JSON.stringify(dataFrame));
            console.log(`发送音频数据块: ${chunk.length} 字节 (偏移量: ${offset})`);
            offset += chunkSize;

            // 继续发送下一块
            setImmediate(sendChunk);
          };

          // 开始发送音频数据
          sendChunk();
        });

        ws.on('message', (data) => {
          const response = JSON.parse(data);
          console.log('收到WebSocket消息:', JSON.stringify(response, null, 2));

          if (response.code && response.code !== 0) {
            console.error('科大讯飞API错误:', response.message);
            console.error('错误代码:', response.code);
            console.error('SID:', response.sid);
            
            // 根据错误代码提供更具体的错误信息
            let errorMessage = `科大讯飞API错误: ${response.message} (代码: ${response.code})`;
            
            ws.close();
            if (!isFinished) {
              isFinished = true;
              reject(new Error(errorMessage));
            }
            return;
          }

          // 解析识别结果
          if (response.data && response.data.result) {
            // 处理结果
            if (response.data.result.ws) {
              // 获取序列号
              const sn = response.data.result.sn;
              // 从ws数组中提取文字
              const words = response.data.result.ws.map(cw => cw.cw[0].w).join('');
              
              // 处理流式识别结果
              if (response.data.result.pgs) {
                // 处理替换(rpl)和追加(apd)操作
                if (response.data.result.pgs === 'rpl') {
                  // 替换操作，替换指定范围的结果
                  if (response.data.result.rg && response.data.result.rg.length === 2) {
                    const start = response.data.result.rg[0] - 1;
                    const end = response.data.result.rg[1];
                    // 确保数组长度足够
                    while (sentenceResults.length <= end) {
                      sentenceResults.push('');
                    }
                    // 替换范围内的结果
                    for (let i = start; i < end; i++) {
                      sentenceResults[i] = '';
                    }
                    sentenceResults[sn-1] = words;
                  }
                } else if (response.data.result.pgs === 'apd') {
                  // 追加操作
                  sentenceResults[sn-1] = words;
                }
              } else {
                // 非流式识别，直接存储
                sentenceResults[sn-1] = words;
              }
              
              // 重新构建完整结果
              fullResult = sentenceResults.filter(result => result !== undefined && result !== null).join('');
              
              console.log('当前识别结果:', words);
              console.log('累积识别结果:', fullResult);
            }
          }

          // 检查是否完成
          if (response.data && response.data.status === 2) {
            console.log('语音识别完成，最终结果:', fullResult);
            ws.close();
            if (!isFinished) {
              isFinished = true;
              // 清理临时文件
              try {
                fs.unlinkSync(webmFilePath);
                fs.unlinkSync(pcmFilePath);
              } catch (e) {
                console.warn('清理临时文件时出错:', e);
              }
              resolve(fullResult);
            }
          }
        });

        ws.on('error', (error) => {
          console.error('WebSocket错误:', error);
          // 清理临时文件
          try {
            fs.unlinkSync(webmFilePath);
            fs.unlinkSync(pcmFilePath);
          } catch (e) {
            console.warn('清理临时文件时出错:', e);
          }
          if (!isFinished) {
            isFinished = true;
            reject(new Error(`WebSocket连接错误: ${error.message}`));
          }
        });

        ws.on('close', () => {
          console.log('WebSocket连接已关闭');
          if (!isFinished) {
            isFinished = true;
            // 清理临时文件
            try {
              fs.unlinkSync(webmFilePath);
              fs.unlinkSync(pcmFilePath);
            } catch (e) {
              console.warn('清理临时文件时出错:', e);
            }
            resolve(fullResult);
          }
        });

      } catch (error) {
        console.error('语音识别过程中出错:', error);
        reject(error);
      }
    });
  }
}

module.exports = IflytekService;