const fetch = require('node-fetch');

async function testBackendAPI() {
  try {
    console.log('=== Testing Backend API ===\n');
    
    // 测试用户注册
    console.log('1. Testing user registration...');
    const testUsername = `api_test_user_${Date.now()}`;
    const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: testUsername,
        password: 'test_password_123'
      })
    });
    
    console.log('Register response status:', registerResponse.status);
    const registerData = await registerResponse.json();
    console.log('Register response:', registerData);
    
    if (registerResponse.status === 200) {
      console.log('✓ User registration successful');
      
      // 测试用户登录
      console.log('\n2. Testing user login...');
      const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: testUsername,
          password: 'test_password_123'
        })
      });
      
      console.log('Login response status:', loginResponse.status);
      const loginData = await loginResponse.json();
      console.log('Login response:', loginData);
      
      if (loginResponse.status === 200) {
        console.log('✓ User login successful');
        const userId = loginData.user.id;
        
        // 测试获取用户资料
        console.log('\n3. Testing user profile retrieval...');
        const profileResponse = await fetch(`http://localhost:3000/api/auth/profile/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Profile response status:', profileResponse.status);
        const profileData = await profileResponse.json();
        console.log('Profile response:', profileData);
        
        if (profileResponse.status === 200) {
          console.log('✓ User profile retrieval successful');
        } else {
          console.log('✗ User profile retrieval failed');
        }
      } else {
        console.log('✗ User login failed');
      }
    } else {
      console.log('✗ User registration failed');
    }
    
    console.log('\n=== Backend API Test Completed ===');
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testBackendAPI();