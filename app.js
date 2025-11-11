// DOM Elements
const travelForm = document.getElementById('travel-form');
const welcomeSection = document.getElementById('welcome-section');
const planSection = document.getElementById('plan-section');
const travelPlanDiv = document.getElementById('travel-plan');
const settingsModal = document.getElementById('settings-modal');
const authModal = document.getElementById('auth-modal');
const settingsBtn = document.getElementById('settings-btn');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const startVoiceBtn = document.getElementById('start-voice-btn');
const stopVoiceBtn = document.getElementById('stop-voice-btn');

// 添加调试日志
console.log('DOM Elements:');
console.log('settingsBtn:', settingsBtn);
console.log('loginBtn:', loginBtn);
console.log('registerBtn:', registerBtn);

// Modal close buttons
const closeButtons = document.querySelectorAll('.close');

// Settings form elements
const settingsForm = document.getElementById('settings-form');
const deepseekApiKeyInput = document.getElementById('deepseek-api-key');

// Auth form elements
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const loginFormDiv = document.getElementById('login-form');
const registerFormDiv = document.getElementById('register-form');
const loginForm = loginFormDiv.querySelector('form');
const registerForm = registerFormDiv.querySelector('form');

// Speech recognition variables
let recognition;
let isRecognizing = false;

// User state
let currentUser = null;

// Backend API base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Check if browser supports speech recognition
const supportsSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Load settings from localStorage
    loadSettings();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize speech recognition if supported
    if (supportsSpeechRecognition) {
        initSpeechRecognition();
    } else {
        console.warn('Browser does not support speech recognition');
        // Hide voice input buttons if not supported
        var voiceInput = document.querySelector('[for="voice-input"]');
        if (voiceInput && voiceInput.closest) {
            var formGroup = voiceInput.closest('.form-group');
            if (formGroup) {
                formGroup.style.display = 'none';
            }
        }
    }
    
    // Check if user is already logged in
    checkUserStatus();
});

// Load settings from localStorage
function loadSettings() {
    const deepseekApiKey = localStorage.getItem('deepseekApiKey');
    
    if (deepseekApiKey) deepseekApiKeyInput.value = deepseekApiKey;
}

// Set up event listeners
function setupEventListeners() {
    console.log('Setting up event listeners');
    
    // Form submission
    if (travelForm) {
        travelForm.addEventListener('submit', handleTravelFormSubmit);
    } else {
        console.error('travelForm not found');
    }
    
    // Settings modal
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            console.log('Settings button clicked');
            if (settingsModal) {
                settingsModal.classList.remove('hidden');
            } else {
                console.error('settingsModal not found');
            }
        });
    } else {
        console.error('settingsBtn not found');
    }
    
    // Auth modals
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            console.log('Login button clicked');
            if (authModal && loginFormDiv && registerFormDiv) {
                authModal.classList.remove('hidden');
                loginFormDiv.classList.remove('hidden');
                registerFormDiv.classList.add('hidden');
            } else {
                console.error('One or more auth elements not found');
            }
        });
    } else {
        console.error('loginBtn not found');
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            console.log('Register button clicked');
            if (authModal && loginFormDiv && registerFormDiv) {
                authModal.classList.remove('hidden');
                loginFormDiv.classList.add('hidden');
                registerFormDiv.classList.remove('hidden');
            } else {
                console.error('One or more auth elements not found');
            }
        });
    } else {
        console.error('registerBtn not found');
    }
    
    // Show register form
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Show register link clicked');
            if (loginFormDiv && registerFormDiv) {
                loginFormDiv.classList.add('hidden');
                registerFormDiv.classList.remove('hidden');
            } else {
                console.error('Form divs not found');
            }
        });
    } else {
        console.error('showRegisterLink not found');
    }
    
    // Show login form
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Show login link clicked');
            if (registerFormDiv && loginFormDiv) {
                registerFormDiv.classList.add('hidden');
                loginFormDiv.classList.remove('hidden');
            } else {
                console.error('Form divs not found');
            }
        });
    } else {
        console.error('showLoginLink not found');
    }
    
    // Close modals
    if (closeButtons && closeButtons.length > 0) {
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                console.log('Close button clicked');
                if (settingsModal) settingsModal.classList.add('hidden');
                if (authModal) authModal.classList.add('hidden');
            });
        });
    } else {
        console.error('Close buttons not found');
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (settingsModal && e.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
        if (authModal && e.target === authModal) {
            authModal.classList.add('hidden');
        }
    });
    
    // Settings form submission
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsFormSubmit);
    } else {
        console.error('settingsForm not found');
    }
    
    // Auth form submissions
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    } else {
        console.error('loginForm not found');
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    } else {
        console.error('registerForm not found');
    }
    
    // Voice recognition buttons
    if (supportsSpeechRecognition) {
        if (startVoiceBtn) {
            startVoiceBtn.addEventListener('click', startVoiceRecognition);
        } else {
            console.error('startVoiceBtn not found');
        }
        
        if (stopVoiceBtn) {
            stopVoiceBtn.addEventListener('click', stopVoiceRecognition);
        } else {
            console.error('stopVoiceBtn not found');
        }
    }
}

// Check user status
function checkUserStatus() {
    // In a real app, you would check for a valid session token
    // For now, we'll just update the UI based on currentUser state
    updateAuthUI();
}

// Update authentication UI
function updateAuthUI() {
    if (currentUser) {
        // User is logged in
        loginBtn.textContent = `欢迎, ${currentUser.email}`;
        registerBtn.style.display = 'none';
    } else {
        // User is not logged in
        loginBtn.textContent = '登录';
        registerBtn.style.display = 'inline-block';
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || '登录失败');
        }
        
        currentUser = {
            id: data.user.id,
            email: data.user.email
        };
        
        // Close modal
        authModal.classList.add('hidden');
        
        // Update UI
        updateAuthUI();
        
        alert('登录成功!');
    } catch (error) {
        console.error('Login error:', error);
        alert(error.message);
    }
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || '注册失败');
        }
        
        alert('注册成功! 请登录您的账户。');
        
        // Switch to login form
        registerFormDiv.classList.add('hidden');
        loginFormDiv.classList.remove('hidden');
    } catch (error) {
        console.error('Registration error:', error);
        alert(error.message);
    }
}

// Handle travel form submission
async function handleTravelFormSubmit(e) {
    e.preventDefault();
    
    const destination = document.getElementById('destination').value;
    const days = parseInt(document.getElementById('days').value);
    const budget = parseInt(document.getElementById('budget').value);
    const preferences = document.getElementById('preferences').value;
    
    if (!destination || !days || !budget) {
        alert('请填写所有必填字段');
        return;
    }
    
    // Show loading state
    const submitButton = travelForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = '生成中...';
    submitButton.disabled = true;
    
    try {
        // Generate travel plan using DeepSeek API
        const travelPlan = await generateTravelPlan(destination, days, budget, preferences);
        
        // Display the travel plan
        displayTravelPlan(travelPlan);
        
        // Save travel plan to backend if user is logged in
        if (currentUser) {
            await saveTravelPlanToBackend(travelPlan);
        }
        
        // Switch to plan section
        welcomeSection.classList.add('hidden');
        planSection.classList.remove('hidden');
    } catch (error) {
        console.error('Error generating travel plan:', error);
        alert('生成旅行计划时出错，请稍后重试');
    } finally {
        // Restore button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Generate travel plan using DeepSeek API
async function generateTravelPlan(destination, days, budget, preferences) {
    const apiKey = deepseekApiKeyInput.value;
    
    if (!apiKey) {
        alert('请先在设置中配置 DeepSeek API Key');
        throw new Error('Missing API Key');
    }
    
    const prompt = `
    请根据以下信息生成一个详细的旅行计划，严格按照指定的JSON格式返回：
    
    目的地: ${destination}
    天数: ${days}天
    预算: 每人${budget}元
    偏好: ${preferences}
    
    返回格式示例:
    {
      "title": "旅行标题",
      "total_consumption": "总消费金额（人民币）",
      "days_detail": [
        {
          "date": "日期（YYYY-MM-DD）",
          "transportation": "交通方式",
          "accommodation": "住宿信息",
          "attractions": [
            {
              "name": "景点名称",
              "ticket_price": "门票价格（人民币）",
              "introduction": "景点介绍",
              "address": "景点地址"
            }
          ],
          "food": [
            {
              "name": "餐厅或食物名称",
              "price_per_person": "人均消费（人民币）",
              "recommendation": "推荐理由"
            }
          ],
          "activities": [
            {
              "name": "活动名称",
              "cost": "费用（人民币）",
              "description": "活动描述"
            }
          ]
        }
      ]
    }
    
    请确保返回有效的JSON格式，不要包含其他文本。
    `;
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
                { 
                  role: "system", 
                  content: `你是旅行规划师，你的任务是根据用户的预算、时间和其他偏好生成旅行计划。

输出格式要求：
你需要以严格的JSON格式输出，具体结构如下：
{
  "title": "旅行标题",
  "total_consumption": "总消费金额（人民币）",
  "days_detail": [
    {
      "date": "日期（YYYY-MM-DD）",
      "transportation": "交通方式",
      "accommodation": "住宿信息",
      "attractions": [
        {
          "name": "景点名称",
          "ticket_price": "门票价格（人民币）",
          "introduction": "景点介绍",
          "address": "景点地址"
        }
      ],
      "food": [
        {
          "name": "餐厅或食物名称",
          "price_per_person": "人均消费（人民币）",
          "recommendation": "推荐理由"
        }
      ],
      "activities": [
        {
          "name": "活动名称",
          "cost": "费用（人民币）",
          "description": "活动描述"
        }
      ]
    }
  ]
}

字段说明：
1. title: 旅行的整体标题，应简洁且具有吸引力
2. total_consumption: 整个旅行的预估总消费，以人民币为单位
3. days_detail: 按日期排列的详细行程安排数组
   - date: 当天日期，格式为 YYYY-MM-DD
   - transportation: 当日使用的交通方式（如飞机、火车、公交、出租车等）
   - accommodation: 住宿地点和信息
   - attractions: 访问的景点列表
     - name: 景点名称
     - ticket_price: 景点门票价格
     - introduction: 景点简要介绍（不超过100字）
     - address: 景点的具体地址
   - food: 餐饮安排列表
     - name: 餐厅或特色食品名称
     - price_per_person: 人均消费
     - recommendation: 推荐原因（不超过50字）
   - activities: 其他活动安排
     - name: 活动名称
     - cost: 活动费用
     - description: 活动简要描述

注意事项：
1. 所有价格必须以人民币（元）为单位
2. 保证JSON格式的有效性和完整性
3. 内容需真实可靠，符合实际情况
4. 根据用户输入的预算合理分配各项开支
5. 行程安排应考虑时间和地理位置的合理性`
                },
                { role: "user", content: prompt }
            ],
            temperature: 0.7
        })
    });
    
    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extract JSON from the response
    try {
        // Try to parse directly
        return JSON.parse(content);
    } catch (parseError) {
        // If direct parsing fails, try to extract JSON from markdown code blocks
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
            return JSON.parse(jsonMatch[1]);
        }
        throw new Error('Failed to parse travel plan JSON');
    }
}

// Display travel plan
function displayTravelPlan(plan) {
    let planHTML = `
        <h2>${plan.title}</h2>
        <p class="consumption">总消费估算: ${plan.total_consumption}</p>
    `;
    
    plan.days_detail.forEach((day, index) => {
        planHTML += `
            <div class="day">
                <h3>第${index + 1}天</h3>
                <p><strong>日期:</strong> ${day.date}</p>
                <p><strong>交通:</strong> ${day.transportation}</p>
                <p><strong>住宿:</strong> ${day.accommodation}</p>
        `;
        
        if (day.attractions && day.attractions.length > 0) {
            planHTML += `<h4>景点</h4>`;
            day.attractions.forEach(attraction => {
                planHTML += `
                    <div class="location">
                        <h5>${attraction.name}</h5>
                        <p><strong>门票:</strong> ${attraction.ticket_price}</p>
                        <p>${attraction.introduction}</p>
                        <p><strong>地址:</strong> ${attraction.address}</p>
                    </div>
                `;
            });
        }
        
        if (day.food && day.food.length > 0) {
            planHTML += `<h4>餐饮</h4>`;
            day.food.forEach(food => {
                planHTML += `
                    <div class="location">
                        <h5>${food.name}</h5>
                        <p><strong>人均:</strong> ${food.price_per_person}</p>
                        <p><strong>推荐理由:</strong> ${food.recommendation}</p>
                    </div>
                `;
            });
        }
        
        if (day.activities && day.activities.length > 0) {
            planHTML += `<h4>活动</h4>`;
            day.activities.forEach(activity => {
                planHTML += `
                    <div class="location">
                        <h5>${activity.name}</h5>
                        <p><strong>费用:</strong> ${activity.cost}</p>
                        <p>${activity.description}</p>
                    </div>
                `;
            });
        }
        
        planHTML += `</div>`;
    });
    
    travelPlanDiv.innerHTML = planHTML;
}

// Save travel plan to backend
async function saveTravelPlanToBackend(travelPlan) {
    try {
        const response = await fetch(`${API_BASE_URL}/travel-plans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: currentUser.id,
                travelPlan: travelPlan
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to save travel plan');
        }
        
        const result = await response.json();
        console.log('Travel plan saved:', result);
    } catch (error) {
        console.error('Error saving travel plan:', error);
    }
}

// Handle settings form submission
function handleSettingsFormSubmit(e) {
    e.preventDefault();
    
    const deepseekApiKey = deepseekApiKeyInput.value;
    
    // Save to localStorage
    localStorage.setItem('deepseekApiKey', deepseekApiKey);
    
    // Close modal
    settingsModal.classList.add('hidden');
    
    alert('设置已保存');
}

// Initialize speech recognition
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
        recognition = new SpeechRecognition();
    } else {
        console.warn('Speech recognition not supported');
        return;
    }
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'zh-CN';
    
    recognition.onstart = () => {
        isRecognizing = true;
        startVoiceBtn.disabled = true;
        stopVoiceBtn.disabled = false;
        console.log('Speech recognition started');
    };
    
    recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        
        // Update form fields with recognized text
        if (finalTranscript) {
            updateFormWithSpeech(finalTranscript);
        }
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        stopVoiceRecognition();
    };
    
    recognition.onend = () => {
        isRecognizing = false;
        startVoiceBtn.disabled = false;
        stopVoiceBtn.disabled = true;
        console.log('Speech recognition ended');
    };
}

// Start voice recognition
function startVoiceRecognition() {
    if (isRecognizing) return;
    
    try {
        recognition.start();
    } catch (error) {
        console.error('Error starting speech recognition:', error);
    }
}

// Stop voice recognition
function stopVoiceRecognition() {
    if (!isRecognizing) return;
    
    recognition.stop();
}

// Update form with speech recognition results
function updateFormWithSpeech(text) {
    // Simple heuristic to determine which field to populate
    const destinationField = document.getElementById('destination');
    const daysField = document.getElementById('days');
    const budgetField = document.getElementById('budget');
    const preferencesField = document.getElementById('preferences');
    
    // If fields are empty, populate them in order
    if (!destinationField.value) {
        destinationField.value = text;
    } else if (!daysField.value) {
        // Try to extract a number for days
        const daysMatch = text.match(/\d+/);
        if (daysMatch) {
            daysField.value = daysMatch[0];
        }
    } else if (!budgetField.value) {
        // Try to extract a number for budget
        const budgetMatch = text.match(/\d+/);
        if (budgetMatch) {
            budgetField.value = budgetMatch[0];
        }
    } else {
        // Append to preferences
        if (preferencesField.value) {
            preferencesField.value += '; ' + text;
        } else {
            preferencesField.value = text;
        }
    }
}