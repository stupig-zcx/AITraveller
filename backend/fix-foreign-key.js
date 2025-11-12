const fetch = require('node-fetch');

// 引入环境变量
require('dotenv').config({ path: __dirname + '/.env' });

// 从环境变量获取配置
const supabaseUrl = process.env.SUPABASE_URL || 'https://olsezvgkkwwpvbdkdusq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s';

async function checkConstraints() {
    console.log('Checking foreign key constraints...');
    
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/check_constraints`, {
        method: 'POST',
        headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Current constraints:', data);
    } else {
        console.log('Could not check constraints, but will attempt to fix them anyway');
    }
}

async function fixForeignKeyConstraint() {
  try {
    console.log('Attempting to fix foreign key constraint...');
    
    // 首先检查当前的约束
    await checkConstraints();
    
    // 尝试修复外键约束
    const fixResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/fix_travel_plan_constraint`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          ALTER TABLE travel_plans 
          DROP CONSTRAINT IF EXISTS travel_plans_user_id_fkey,
          ADD CONSTRAINT travel_plans_user_id_fkey 
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        `
      })
    });
    
    if (fixResponse.ok) {
      const data = await fixResponse.json();
      console.log('Foreign key constraint fixed:', data);
    } else {
      console.log('Failed to fix foreign key constraint directly via API');
      console.log('Status:', fixResponse.status);
      console.log('Response:', await fixResponse.text());
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

fixForeignKeyConstraint();