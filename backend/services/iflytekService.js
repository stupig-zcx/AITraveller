const CryptoJS = require('crypto-js');
const WebSocket = require('ws');
const dotenv = require('dotenv');

dotenv.config();

class IFlytekSpeechService {
  constructor() {
    this.appId = process.env.IFLYTEK_APP_ID;
    this.apiKey = process.env.IFLYTEK_API_KEY;
    this.apiSecret = process.env.IFLYTEK_API_SECRET;
    
    if (!this.appId || !this.apiKey || !this.apiSecret) {
      throw new Error('缺少科大讯飞API配置，请检查.env文件');
    }
  }

  // 生成WebSocket URL
  generateWebSocketUrl() {
    const host = "iat-api.xfyun.cn";
    const path = "/v2/iat";
    
    // 获取当前时间（RFC1123格式）
    const date = new Date().toGMTString();
    
    // 拼接signature原串
    const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`;
    
    // 使用apiSecret对signatureOrigin进行HMAC-SHA256加密
    const signature = CryptoJS.HmacSHA256(signatureOrigin, this.apiSecret).toString(CryptoJS.enc.Base64);
    
    // 构建authorization参数
    const authorizationOrigin = `api_key="${this.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
    const authorization = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(authorizationOrigin));
    
    // 构建URL
    return `wss://${host}${path}?authorization=${encodeURIComponent(authorization)}&date=${encodeURIComponent(date)}&host=${host}`;
  }

  // 语音转文字 - 批量处理模式
  async speechToText(audioBuffer) {
    return new Promise((resolve, reject) => {
      try {
        // 设置整体超时
        const timeout = setTimeout(() => {
          if (ws && ws.readyState !== WebSocket.CLOSED) {
            ws.close();
          }
          reject(new Error('语音识别超时'));
        }, 15000); // 15秒超时

        const url = this.generateWebSocketUrl();
        const ws = new WebSocket(url);
        
        let result = '';
        let isFinished = false;
        
        // 连接打开时发送数据
        ws.on('open', () => {
          // 发送开始参数
          const frame = {
            common: {
              app_id: this.appId
            },
            business: {
              language: 'zh_cn',
              domain: 'iat',
              accent: 'mandarin',
              dwa: 'wpgs'
            },
            data: {
              status: 0,
              format: 'audio/L16;rate=16000',
              encoding: 'raw',
              audio: audioBuffer.toString('base64')
            }
          };
          
          ws.send(JSON.stringify(frame));
          
          // 发送结束标识
          const endFrame = {
            data: {
              status: 2,
              format: 'audio/L16;rate=16000',
              encoding: 'raw',
              audio: ''
            }
          };
          
          ws.send(JSON.stringify(endFrame));
        });
        
        ws.on('message', (data) => {
          try {
            const jsonData = JSON.parse(data);
            
            if (jsonData.code !== 0) {
              clearTimeout(timeout);
              if (!isFinished) {
                isFinished = true;
                ws.close();
                reject(new Error(`科大讯飞API错误: ${jsonData.message} (code: ${jsonData.code})`));
              }
              return;
            }
            
            if (jsonData.data && jsonData.data.result) {
              const words = jsonData.data.result.ws;
              words.forEach(word => {
                result += word.cw[0].w;
              });
              
              if (jsonData.data.status === 2) {
                // 识别完成
                clearTimeout(timeout);
                if (!isFinished) {
                  isFinished = true;
                  ws.close();
                  resolve(result);
                }
              }
            }
          } catch (parseError) {
            clearTimeout(timeout);
            if (!isFinished) {
              isFinished = true;
              ws.close();
              reject(new Error(`解析响应数据失败: ${parseError.message}`));
            }
          }
        });
        
        ws.on('error', (err) => {
          clearTimeout(timeout);
          if (!isFinished) {
            isFinished = true;
            reject(new Error(`WebSocket连接错误: ${err.message}`));
          }
        });
        
        ws.on('close', () => {
          clearTimeout(timeout);
          if (!isFinished) {
            isFinished = true;
            // 如果没有错误但连接关闭，返回已识别的结果
            resolve(result);
          }
        });
      } catch (error) {
        reject(new Error(`语音识别处理错误: ${error.message}`));
      }
    });
  }
}

module.exports = IFlytekSpeechService;