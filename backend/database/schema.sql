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