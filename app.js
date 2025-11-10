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
        document.querySelector('[for="voice-input"]')?.closest('.form-group')?.style.display = 'none';
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
    // Form submission
    travelForm.addEventListener('submit', handleTravelFormSubmit);
    
    // Settings modal
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
    });
    
    // Auth modals
    loginBtn.addEventListener('click', () => {
        authModal.classList.remove('hidden');
        loginFormDiv.classList.remove('hidden');
        registerFormDiv.classList.add('hidden');
    });
    
    registerBtn.addEventListener('click', () => {
        authModal.classList.remove('hidden');
        loginFormDiv.classList.add('hidden');
        registerFormDiv.classList.remove('hidden');
    });
    
    // Show register form
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormDiv.classList.add('hidden');
        registerFormDiv.classList.remove('hidden');
    });
    
    // Show login form
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerFormDiv.classList.add('hidden');
        loginFormDiv.classList.remove('hidden');
    });
    
    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
            authModal.classList.add('hidden');
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
        if (e.target === authModal) {
            authModal.classList.add('hidden');
        }
    });
    
    // Settings form submission
    settingsForm.addEventListener('submit', handleSettingsFormSubmit);
    
    // Auth form submissions
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    
    // Voice recognition buttons
    if (supportsSpeechRecognition) {
        startVoiceBtn.addEventListener('click', startVoiceRecognition);
        stopVoiceBtn.addEventListener('click', stopVoiceRecognition);
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
      "ID": "随机字符串",
      "Title": "${destination}旅行计划",
      "totalConsumption": "总消费估算",
      "DaysDetail": [
        {
          "Title": "第1天",
          "Consumption": "当天消费估算",
          "Stay": "住宿信息",
          "Locations": [
            {
              "name": "地点名称",
              "time": "时间安排",
              "content": "活动详情",
              "transportation": "交通方式",
              "consumption": "消费金额",
              "consumptionSource": "消费项目",
              "img": "图片链接或null"
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
                { role: "system", content: "你是一个专业的旅行规划师，能根据用户需求生成详细的旅行计划。" },
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
        <h2>${plan.Title}</h2>
        <p class="consumption">总消费估算: ${plan.totalConsumption}</p>
    `;
    
    plan.DaysDetail.forEach(day => {
        planHTML += `
            <div class="day">
                <h3>${day.Title}</h3>
                <p class="consumption">当日消费: ${day.Consumption}</p>
                <p><strong>住宿:</strong> ${day.Stay}</p>
        `;
        
        day.Locations.forEach(location => {
            planHTML += `
                <div class="location">
                    <h4>${location.name}</h4>
                    <p><strong>时间:</strong> ${location.time}</p>
                    <p>${location.content}</p>
                    <p class="transportation">交通: ${location.transportation}</p>
                    <p class="consumption">消费: ${location.consumption} (${location.consumptionSource})</p>
                    ${location.img ? `<img src="${location.img}" alt="${location.name}">` : ''}
                </div>
            `;
        });
        
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