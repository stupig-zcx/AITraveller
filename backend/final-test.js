// 为Node.js添加Headers支持
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

require('dotenv').config();

// 直接创建Supabase客户端
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key exists:', !!supabaseAnonKey);

// 使用更明确的配置
const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        'apikey': supabaseAnonKey
      }
    }
  }
);

async function testSupabase() {
  console.log('Testing Supabase connection...');
  
  try {
    // 测试数据库连接 - 尝试获取旅行计划表中的记录
    // 显式添加API密钥到请求中
    const { data, error } = await supabase
      .from('travel_plans')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Supabase error:', error);
      return;
    }
    
    console.log('Supabase connection successful!');
    console.log('Found records:', data.length);
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
  }
}

testSupabase();