const fetch = require('node-fetch');

async function testRegister() {
  try {
    console.log('Testing registration...');
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'testuser_' + Date.now(), // 使用唯一用户名
        password: 'testpass'
      })
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    if (response.status === 200) {
      // 测试登录
      console.log('\nTesting login...');
      const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: data.user.username,
          password: 'testpass'
        })
      });
      
      console.log('Login response status:', loginResponse.status);
      const loginData = await loginResponse.json();
      console.log('Login response data:', loginData);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testRegister();