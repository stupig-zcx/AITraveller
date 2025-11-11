// DOM Elements
const travelForm = document.getElementById('travel-form');
const welcomeSection = document.getElementById('welcome-section');
const planSection = document.getElementById('plan-section');
const travelPlanDiv = document.getElementById('travel-plan');
const settingsModal = document.getElementById('settings-modal');
const settingsBtn = document.getElementById('settings-btn');
const historyBtn = document.getElementById('history-btn'); // 添加历史记录按钮
const historyModal = document.getElementById('history-modal'); // 添加历史记录模态框
const historyList = document.getElementById('history-list'); // 添加历史记录列表

// 新增历史记录页面元素
const historySection = document.getElementById('history-section');
const historyCardsContainer = document.getElementById('history-cards-container');

// 新的登录/注册元素
const authSection = document.getElementById('auth-section');
const directLoginForm = document.getElementById('direct-login-form');
const directRegisterForm = document.getElementById('direct-register-form');
const showRegisterDirect = document.getElementById('show-register-direct');
const showLoginDirect = document.getElementById('show-login-direct');

// Modal close buttons
const closeButtons = document.querySelectorAll('.close');

// Settings form elements
const settingsForm = document.getElementById('settings-form');
const deepseekApiKeyInput = document.getElementById('deepseek-api-key');

// Speech recognition variables
let recognition;
let isRecognizing = false;

// User state
let currentUser = null;
let userTravelPlans = [];

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
    
    // History modal
    if (historyBtn) {
        historyBtn.addEventListener('click', () => {
            console.log('History button clicked');
            showHistoryPage();
        });
    } else {
        console.error('historyBtn not found');
    }
    
    // Back to form button
    const backToFormBtn = document.getElementById('back-to-form');
    if (backToFormBtn) {
        backToFormBtn.addEventListener('click', () => {
            console.log('Back to form button clicked');
            planSection.classList.add('hidden');
            welcomeSection.classList.remove('hidden');
        });
    } else {
        console.error('backToFormBtn not found');
    }
    
    // Back to history button
    const backToHistoryBtn = document.getElementById('back-to-history');
    if (backToHistoryBtn) {
        backToHistoryBtn.addEventListener('click', () => {
            console.log('Back to history button clicked');
            planSection.classList.add('hidden');
            historySection.classList.remove('hidden');
        });
    } else {
        console.error('backToHistoryBtn not found');
    }
    
    // Back to welcome button
    const backToWelcomeBtn = document.getElementById('back-to-welcome');
    if (backToWelcomeBtn) {
        backToWelcomeBtn.addEventListener('click', () => {
            console.log('Back to welcome button clicked');
            historySection.classList.add('hidden');
            welcomeSection.classList.remove('hidden');
        });
    } else {
        console.error('backToWelcomeBtn not found');
    }
    
    // Show register form (direct)
    if (showRegisterDirect) {
        showRegisterDirect.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Show register direct clicked');
            if (directLoginForm && directRegisterForm) {
                directLoginForm.closest('div').classList.add('hidden');
                directRegisterForm.closest('div').classList.remove('hidden');
            } else {
                console.error('Direct form divs not found');
            }
        });
    } else {
        console.error('showRegisterDirect not found');
    }
    
    // Show login form (direct)
    if (showLoginDirect) {
        showLoginDirect.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Show login direct clicked');
            if (directRegisterForm && directLoginForm) {
                directRegisterForm.closest('div').classList.add('hidden');
                directLoginForm.closest('div').classList.remove('hidden');
            } else {
                console.error('Direct form divs not found');
            }
        });
    } else {
        console.error('showLoginDirect not found');
    }
    
    // Close modals
    if (closeButtons && closeButtons.length > 0) {
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                console.log('Close button clicked');
                if (settingsModal) settingsModal.classList.add('hidden');
                if (historyModal) historyModal.classList.add('hidden');
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
        if (historyModal && e.target === historyModal) {
            historyModal.classList.add('hidden');
        }
    });
    
    // Settings form submission
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsFormSubmit);
    } else {
        console.error('settingsForm not found');
    }
    
    // Direct auth form submissions
    if (directLoginForm) {
        directLoginForm.addEventListener('submit', handleDirectLogin);
    } else {
        console.error('directLoginForm not found');
    }
    
    if (directRegisterForm) {
        directRegisterForm.addEventListener('submit', handleDirectRegister);
    } else {
        console.error('directRegisterForm not found');
    }
    
    // Voice recognition buttons
    if (supportsSpeechRecognition) {
        const startVoiceBtn = document.getElementById('start-voice-btn');
        const stopVoiceBtn = document.getElementById('stop-voice-btn');
        
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
    
    // If user is logged in, fetch their travel plans
    if (currentUser) {
        fetchUserTravelPlans();
    }
}

// Update authentication UI
function updateAuthUI() {
    if (currentUser) {
        // User is logged in
        historyBtn.style.display = 'inline-block'; // 显示历史记录按钮
        
        // Hide auth section and show welcome section
        if (authSection) {
            authSection.classList.add('hidden');
        }
        if (welcomeSection) {
            welcomeSection.classList.remove('hidden');
        }
        
        // Also hide other sections
        if (historySection) {
            historySection.classList.add('hidden');
        }
        if (planSection) {
            planSection.classList.add('hidden');
        }
    } else {
        // User is not logged in
        historyBtn.style.display = 'none'; // 隐藏历史记录按钮
        
        // Show auth section and hide other sections
        if (authSection) {
            authSection.classList.remove('hidden');
        }
        if (welcomeSection) {
            welcomeSection.classList.add('hidden');
        }
        if (historySection) {
            historySection.classList.add('hidden');
        }
        if (planSection) {
            planSection.classList.add('hidden');
        }
    }
}

// Handle direct login
async function handleDirectLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('direct-login-username').value;
    const password = document.getElementById('direct-login-password').value;
    
    try {
        // 修改为使用用户名和密码登录
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        // 检查响应状态
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '登录失败');
        }
        
        const data = await response.json();
        
        currentUser = {
            id: data.user.id,
            username: data.user.username
        };
        
        // 获取用户的旅游计划
        await fetchUserTravelPlans();
        
        // Update UI
        updateAuthUI();
        
        alert('登录成功!');
    } catch (error) {
        console.error('Login error:', error);
        alert('登录失败: ' + error.message);
    }
}

// Handle direct registration
async function handleDirectRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('direct-register-username').value;
    const password = document.getElementById('direct-register-password').value;
    
    try {
        // 修改为使用用户名和密码注册
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        // 检查响应状态
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '注册失败');
        }
        
        const data = await response.json();
        
        alert('注册成功! 请登录您的账户。');
        
        // Switch to login form
        directRegisterForm.closest('div').classList.add('hidden');
        directLoginForm.closest('div').classList.remove('hidden');
    } catch (error) {
        console.error('Registration error:', error);
        alert('注册失败: ' + error.message);
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
            console.log('User is logged in, saving travel plan...');
            const saveResult = await saveTravelPlanToBackend(travelPlan);
            console.log('Save result:', saveResult);
            // Refresh user's travel plans
            await fetchUserTravelPlans();
        } else {
            console.log('User is not logged in, not saving travel plan');
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
          "transportation": "当日交通方式汇总",
          "accommodation": "住宿信息",
          "accommodation_cost": "住宿费用（人民币）",
          "attractions": [
            {
              "name": "景点名称",
              "time": "游览时间（如10:00）",
              "transportation": "前往该景点的交通方式",
              "transportation_cost": "前往该景点的交通费用（人民币）",
              "ticket_price": "门票价格（人民币）",
              "introduction": "景点介绍",
              "address": "景点地址"
            }
          ],
          "food": [
            {
              "name": "餐厅或食物名称",
              "time": "用餐时间（如12:30）",
              "transportation": "前往餐厅的交通方式",
              "transportation_cost": "前往餐厅的交通费用（人民币）",
              "price_per_person": "人均消费（人民币）",
              "recommendation": "推荐理由"
            }
          ],
          "activities": [
            {
              "name": "活动名称",
              "time": "活动时间（如15:00）",
              "transportation": "前往活动地点的交通方式",
              "transportation_cost": "前往活动地点的交通费用（人民币）",
              "cost": "活动费用（人民币）",
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
      "transportation": "当日交通方式汇总",
      "accommodation": "住宿地点和信息",
      "accommodation_cost": "住宿费用（人民币）",
      "attractions": [
        {
          "name": "景点名称",
          "time": "游览时间（如10:00）",
          "transportation": "前往该景点的交通方式",
          "transportation_cost": "前往该景点的交通费用（人民币）",
          "ticket_price": "景点门票价格",
          "introduction": "景点简要介绍",
          "address": "景点的具体地址"
        }
      ],
      "food": [
        {
          "name": "餐厅或食物名称",
          "time": "用餐时间（如12:30）",
          "transportation": "前往餐厅的交通方式",
          "transportation_cost": "前往餐厅的交通费用（人民币）",
          "price_per_person": "人均消费",
          "recommendation": "推荐原因"
        }
      ],
      "activities": [
        {
          "name": "活动名称",
          "time": "活动时间（如15:00）",
          "transportation": "前往活动地点的交通方式",
          "transportation_cost": "前往活动地点的交通费用（人民币）",
          "cost": "活动费用",
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
   - transportation: 当日交通方式汇总
   - accommodation: 住宿地点和信息
   - accommodation_cost: 住宿费用（人民币）
   - attractions: 访问的景点列表
     - name: 景点名称
     - time: 游览时间（如10:00）
     - transportation: 前往该景点的交通方式
     - transportation_cost: 前往该景点的交通费用（人民币）
     - ticket_price: 景点门票价格
     - introduction: 景点简要介绍（不超过100字）
     - address: 景点的具体地址
   - food: 餐饮安排列表
     - name: 餐厅或特色食品名称
     - time: 用餐时间（如12:30）
     - transportation: 前往餐厅的交通方式
     - transportation_cost: 前往餐厅的交通费用（人民币）
     - price_per_person: 人均消费
     - recommendation: 推荐原因（不超过50字）
   - activities: 其他活动安排
     - name: 活动名称
     - time: 活动时间（如15:00）
     - transportation: 前往活动地点的交通方式
     - transportation_cost: 前往活动地点的交通费用（人民币）
     - cost: 活动费用
     - description: 活动简要描述

注意事项：
1. 所有价格必须以人民币（元）为单位
2. 保证JSON格式的有效性和完整性
3. 内容需真实可靠，符合实际情况
4. 根据用户输入的预算合理分配各项开支
5. 行程安排应考虑时间和地理位置的合理性
6. 每个地点必须包含时间（time）和交通方式（transportation）信息
7. 每个地点应包含交通费用（transportation_cost）信息
8. 每天的住宿信息应包含住宿费用（accommodation_cost）`
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
        <h2 class="plan-title">${plan.title}</h2>
        <p class="consumption">总消费估算: ${plan.total_consumption}</p>
    `;
    
    plan.days_detail.forEach((day, index) => {
        planHTML += `
            <div class="day-card">
                <div class="day-card-header">
                    <h3>第${index + 1}天`;
        
        if (day.date) {
            planHTML += ` (${day.date})`;
        }
        
        planHTML += `</h3>
                </div>
                <div class="day-card-body">
        `;
        
        // 显示住宿信息和费用
        if (day.accommodation) {
            let accommodationInfo = `<strong>住宿：</strong>${day.accommodation}`;
            
            // 如果有住宿费用信息，则显示费用
            if (day.accommodation_cost) {
                accommodationInfo += ` <span class="accommodation-cost">费用: ${day.accommodation_cost}元</span>`;
            }
            
            planHTML += `
                <div class="accommodation-info">
                    ${accommodationInfo}
                </div>
            `;
        }
        
        // 显示交通信息
        if (day.transportation) {
            planHTML += `
                <div class="day-info">
                    <div class="day-info-item">
                        <strong>当日交通方式：</strong>${day.transportation}
                    </div>
                </div>
            `;
        }
        
        // 创建地点表格
        planHTML += `
            <table class="location-table">
                <thead>
                    <tr>
                        <th>地点序列</th>
                        <th>地点与活动</th>
                        <th>时间</th>
                        <th>活动详情</th>
                        <th>交通方式</th>
                        <th>费用(元)</th>
                        <th>费用说明</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        let locationIndex = 1;
        let locations = [];
        
        // 收集所有地点信息
        if (day.attractions && day.attractions.length > 0) {
            day.attractions.forEach(attraction => {
                // 计算总费用（门票费用 + 交通费用）
                let ticketPrice = parseFloat(attraction.ticket_price) || 0;
                let transportationCost = parseFloat(attraction.transportation_cost) || 0;
                let totalCost = ticketPrice + transportationCost;
                
                // 构建费用说明
                let costDescription = '景点门票';
                if (transportationCost > 0) {
                    costDescription += ` + 交通费${transportationCost}元`;
                }
                
                locations.push({
                    type: '景点',
                    name: attraction.name,
                    time: attraction.time || '',
                    description: attraction.introduction || '',
                    transportation: attraction.transportation || '',
                    cost: totalCost,
                    costDescription: costDescription
                });
            });
        }
        
        // 添加餐饮信息到表格
        if (day.food && day.food.length > 0) {
            day.food.forEach(food => {
                // 计算总费用（餐饮费用 + 交通费用）
                let foodPrice = parseFloat(food.price_per_person) || 0;
                let transportationCost = parseFloat(food.transportation_cost) || 0;
                let totalCost = foodPrice + transportationCost;
                
                // 构建费用说明
                let costDescription = '餐饮费用';
                if (transportationCost > 0) {
                    costDescription += ` + 交通费${transportationCost}元`;
                }
                
                locations.push({
                    type: '餐饮',
                    name: food.name,
                    time: food.time || '',
                    description: food.recommendation || '',
                    transportation: food.transportation || '',
                    cost: totalCost,
                    costDescription: costDescription
                });
            });
        }
        
        // 添加活动信息到表格
        if (day.activities && day.activities.length > 0) {
            day.activities.forEach(activity => {
                // 计算总费用（活动费用 + 交通费用）
                let activityCost = parseFloat(activity.cost) || 0;
                let transportationCost = parseFloat(activity.transportation_cost) || 0;
                let totalCost = activityCost + transportationCost;
                
                // 构建费用说明
                let costDescription = '活动费用';
                if (transportationCost > 0) {
                    costDescription += ` + 交通费${transportationCost}元`;
                }
                
                locations.push({
                    type: '活动',
                    name: activity.name,
                    time: activity.time || '',
                    description: activity.description || '',
                    transportation: activity.transportation || '',
                    cost: totalCost,
                    costDescription: costDescription
                });
            });
        }
        
        // 按时间排序地点
        locations.sort((a, b) => {
            if (a.time && b.time) {
                return a.time.localeCompare(b.time);
            }
            return 0;
        });
        
        // 添加地点到表格
        locations.forEach((location, idx) => {
            planHTML += `
                <tr>
                    <td>地点${idx + 1}</td>
                    <td class="location-name">${location.name}</td>
                    <td>${location.time || ''}</td>
                    <td class="location-description">${location.description || ''}</td>
                    <td>${location.transportation || ''}</td>
                    <td class="location-cost">${location.cost || '0'}</td>
                    <td>${location.costDescription || ''}</td>
                </tr>
            `;
        });
        
        planHTML += `
                </tbody>
            </table>
        </div>
    </div>
        `;
    });
    
    travelPlanDiv.innerHTML = planHTML;
}

// Save travel plan to backend
async function saveTravelPlanToBackend(travelPlan) {
    try {
        console.log('Saving travel plan to backend for user:', currentUser.id);
        console.log('Travel plan data:', travelPlan);
        
        const response = await fetch(`${API_BASE_URL}/travel-plans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc2V6dmdra3d3cHZiZGtkdXNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4NjU5MywiZXhwIjoyMDc4MzYyNTkzfQ.KkheVrm_lrhtDIcg0FOaCnTCbhD20uakiTCQg7mxS4s'
            },
            body: JSON.stringify({
                userId: currentUser.id,
                travelPlan: travelPlan
            })
        });
        
        console.log('Save travel plan response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to save travel plan. Error response:', errorText);
            throw new Error(`Failed to save travel plan: ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Travel plan saved successfully:', result);
        return result;
    } catch (error) {
        console.error('Error saving travel plan:', error);
        alert('保存旅行计划时出错: ' + error.message);
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
        const startVoiceBtn = document.getElementById('start-voice-btn');
        const stopVoiceBtn = document.getElementById('stop-voice-btn');
        if (startVoiceBtn) startVoiceBtn.disabled = true;
        if (stopVoiceBtn) stopVoiceBtn.disabled = false;
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
        const startVoiceBtn = document.getElementById('start-voice-btn');
        const stopVoiceBtn = document.getElementById('stop-voice-btn');
        if (startVoiceBtn) startVoiceBtn.disabled = false;
        if (stopVoiceBtn) stopVoiceBtn.disabled = true;
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

// Fetch user's travel plans
async function fetchUserTravelPlans() {
    if (!currentUser) return;
    
    try {
        console.log('Fetching travel plans for user:', currentUser.id);
        const response = await fetch(`${API_BASE_URL}/travel-plans/${currentUser.id}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || '获取用户信息失败');
        }
        
        userTravelPlans = data.plans || [];
        console.log('User travel plans:', userTravelPlans);
    } catch (error) {
        console.error('Error fetching user travel plans:', error);
    }
}

// 显示历史记录页面
async function showHistoryPage() {
    if (!currentUser) {
        alert('请先登录以查看历史记录');
        return;
    }

    // 获取最新的用户旅行计划
    await fetchUserTravelPlans();
    console.log('Fetched user travel plans for history display:', userTravelPlans);

    // 清空历史记录容器
    historyCardsContainer.innerHTML = '';

    if (!userTravelPlans || userTravelPlans.length === 0) {
        historyCardsContainer.innerHTML = '<p>暂无历史旅行计划</p>';
    } else {
        // 创建历史记录卡片
        const historyHTML = userTravelPlans.map(plan => `
            <div class="history-card" data-plan-id="${plan.id}">
                <h3>${plan.title}</h3>
                <p class="plan-cost">总消费: ${plan.total_consumption}</p>
                <p class="plan-date">创建时间: ${new Date(plan.created_at).toLocaleString()}</p>
            </div>
        `).join('');

        historyCardsContainer.innerHTML = historyHTML;

        // 为每个卡片添加点击事件监听器
        document.querySelectorAll('.history-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const planId = e.currentTarget.getAttribute('data-plan-id');
                viewDetailedPlanFromHistory(planId);
            });
        });
    }

    // 隐藏欢迎页面并显示历史记录页面
    welcomeSection.classList.add('hidden');
    historySection.classList.remove('hidden');
}

// 从历史记录查看详细计划
function viewDetailedPlanFromHistory(planId) {
    const plan = userTravelPlans.find(p => p.id === planId);
    if (plan) {
        // 显示旅行计划
        displayTravelPlan(plan);
        
        // 切换到计划展示区域
        historySection.classList.add('hidden');
        planSection.classList.remove('hidden');
    }
}

// 查看详细计划（从模态框）
function viewDetailedPlan(planId) {
    const plan = userTravelPlans.find(p => p.id === planId);
    if (plan) {
        // 隐藏历史记录模态框
        historyModal.classList.add('hidden');
        
        // 显示旅行计划
        displayTravelPlan(plan);
        
        // 切换到计划展示区域
        welcomeSection.classList.add('hidden');
        planSection.classList.remove('hidden');
    }
}
