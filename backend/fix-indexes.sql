-- 创建用户表用户名的唯一索引
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 创建旅游计划表用户ID的索引
CREATE INDEX IF NOT EXISTS idx_travel_plans_user_id ON travel_plans(user_id);

-- 为旅游计划创建时间添加索引，便于按时间排序
CREATE INDEX IF NOT EXISTS idx_travel_plans_created_at ON travel_plans(created_at);