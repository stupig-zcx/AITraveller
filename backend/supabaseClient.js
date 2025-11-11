// 添加全局Headers对象以解决Node.js版本兼容性问题
if (typeof Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init) {
      this._headers = {};
      if (init) {
        if (init instanceof Headers) {
          init.forEach((value, name) => this.append(name, value));
        } else if (Array.isArray(init)) {
          init.forEach(([name, value]) => this.append(name, value));
        } else {
          Object.keys(init).forEach(name => this.append(name, init[name]));
        }
      }
    }
    
    append(name, value) {
      const key = name.toLowerCase();
      if (this._headers[key]) {
        this._headers[key] += ', ' + value;
      } else {
        this._headers[key] = value;
      }
    }
    
    set(name, value) {
      this._headers[name.toLowerCase()] = value;
    }
    
    get(name) {
      return this._headers[name.toLowerCase()] || null;
    }
    
    has(name) {
      return this._headers.hasOwnProperty(name.toLowerCase());
    }
    
    delete(name) {
      delete this._headers[name.toLowerCase()];
    }
    
    forEach(callback) {
      Object.keys(this._headers).forEach(key => {
        callback(this._headers[key], key);
      });
    }
  };
}

// 加载环境变量
require('dotenv').config({ path: __dirname + '/.env' });

const { createClient } = require('@supabase/supabase-js');

// Supabase配置 - 从环境变量获取
const supabaseUrl = process.env.SUPABASE_URL || 'https://olsezvgkkwwpvbdkdusq.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

// 创建Supabase客户端实例
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;