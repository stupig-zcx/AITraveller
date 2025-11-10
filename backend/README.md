# 旅游规划助手后端服务

这是一个为旅游规划助手前端应用提供API服务的Node.js后端。

## 功能特性

1. 用户认证（注册、登录、登出）
2. 旅行计划管理（创建、读取、更新、删除）
3. 与Supabase数据库集成

## 技术栈

- Node.js
- Express.js
- Supabase (认证和数据库)
- dotenv (环境变量管理)

## 安装和设置

1. 克隆项目或确保已在正确目录中
2. 安装依赖：
   ```bash
   npm install
   ```

3. 创建环境变量文件：
   ```bash
   cp .env.example .env
   ```
   
4. 在 `.env` 文件中配置以下变量：
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   PORT=3000
   ```

## 数据库设置

在Supabase中创建以下表：

```sql
-- 创建旅行计划表
CREATE TABLE travel_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT,
  total_consumption TEXT,
  days_detail JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 为user_id创建索引以提高查询性能
CREATE INDEX idx_travel_plans_user_id ON travel_plans(user_id);

-- 自动更新updated_at字段的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器以自动更新updated_at字段
CREATE TRIGGER update_travel_plans_updated_at 
  BEFORE UPDATE ON travel_plans 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_updated_at_column();
```

或者，您可以直接运行我们提供的SQL文件：
```sql
\i database/schema.sql
```

## 运行服务

### 开发模式
```bash
npm run dev
```

### 生产模式
```bash
npm start
```

服务将在 `http://localhost:3000` 上运行（或你在.env中配置的端口）。

## API 端点

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出

### 旅行计划相关
- `POST /api/travel-plans` - 保存旅行计划
- `GET /api/travel-plans/:userId` - 获取用户的所有旅行计划
- `GET /api/travel-plans/plan/:planId` - 获取特定旅行计划
- `PUT /api/travel-plans/:planId` - 更新旅行计划
- `DELETE /api/travel-plans/:planId` - 删除旅行计划

## 环境变量说明

- `SUPABASE_URL`: 你的Supabase项目URL
- `SUPABASE_SERVICE_KEY`: 你的Supabase服务角色密钥
- `PORT`: 服务运行端口（默认3000）

## 注意事项

1. 在生产环境中，请确保环境变量配置正确，特别是Supabase的凭证信息
2. 服务角色密钥具有数据库的完全访问权限，请妥善保管
3. 前端应用应通过此后端API与Supabase交互，而不是直接连接