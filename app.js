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

// Speech recognition processing modal
const processingModal = document.getElementById('processing-modal');

// Speech recognition variables for iFlytek
let iflytekRecognizer = null;
let isRecognizing = false;

// User state
let currentUser = null;
let userTravelPlans = [];

// Backend API base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Check if browser supports speech recognition
const supportsSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window || (navigator.mediaDevices && window.MediaRecorder);

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Load settings from localStorage
    loadSettings();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize iFlytek speech recognition
    initIFlytekSpeechRecognition();
    
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
    // Check if browser supports speech recognition
    const supportsSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window || (navigator.mediaDevices && window.MediaRecorder);
    
    if (supportsSpeechRecognition) {
        const startVoiceBtn = document.getElementById('start-voice-btn');
        const stopVoiceBtn = document.getElementById('stop-voice-btn');
        
        if (startVoiceBtn) {
            startVoiceBtn.addEventListener('click', startCustomVoiceRecognition);
        } else {
            console.error('startVoiceBtn not found');
        }
        
        if (stopVoiceBtn) {
            stopVoiceBtn.addEventListener('click', stopCustomVoiceRecognition);
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
        
        // 移除了登录成功的弹窗提示，直接跳转
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
  "title": "旅行的整体标题",
  "total_consumption": "整个旅行的预估总消费，以人民币为单位",
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
        // If direct parsing fails, try to extract JSON from code blocks
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

// Initialize iFlytek speech recognition
function initIFlytekSpeechRecognition() {
    console.log('Initializing iFlytek speech recognition via backend API');
    
    // Check for browser support
    if (!navigator.mediaDevices || !window.MediaRecorder) {
        console.warn('浏览器不支持录音功能');
        setupManualSpeechInput();
        return;
    }
    
    // Instead of using browser speech recognition, we'll use our own implementation
    // that sends audio data to our backend which uses iFlytek API
    console.log('Using custom iFlytek implementation via backend');
    
    // We'll add event listeners to the voice buttons
    const startVoiceBtn = document.getElementById('start-voice-btn');
    const stopVoiceBtn = document.getElementById('stop-voice-btn');
    
    if (startVoiceBtn && stopVoiceBtn) {
        // 添加新的事件监听器
        startVoiceBtn.addEventListener('click', startCustomVoiceRecognition);
        stopVoiceBtn.addEventListener('click', stopCustomVoiceRecognition);
        
        console.log('Voice recognition event listeners added');
    } else {
        console.error('Voice buttons not found');
        setupManualSpeechInput();
    }
}

// Variables for custom voice recognition
let mediaRecorder;
let audioChunks = [];
let debugAudioBlob = null; // 用于存储录制的音频blob用于调试
let audioStream;

// Start custom voice recognition
async function startCustomVoiceRecognition() {
    console.log('Starting custom voice recognition');
    
    // Check if we're on a secure context (HTTPS or localhost)
    if (!isSecureContext) {
        const message = '当前环境不支持录音功能。请确保通过HTTPS或localhost访问此页面。';
        console.warn(message);
        showStatusMessage(message, 'error');
        return;
    }
    
    try {
        // Clean up any previous recording
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
        
        if (audioStream) {
            audioStream.getTracks().forEach(track => track.stop());
        }
        
        // Reset variables
        audioChunks = [];
        debugAudioBlob = null;
        
        // Get microphone access with more compatible constraints
        const constraints = {
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        };
        
        // Try to get stream with constraints
        audioStream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('Microphone access granted');
        
        // Create media recorder with better browser compatibility
        let mimeType = '';
        
        // Check for supported MIME types in order of preference
        const mimeTypes = [
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/ogg;codecs=opus',
            'audio/ogg',
            'audio/mp4'
        ];
        
        for (const type of mimeTypes) {
            if (MediaRecorder.isTypeSupported(type)) {
                mimeType = type;
                break;
            }
        }
        
        // For Chrome, we might need to use the default MIME type
        const options = mimeType ? { mimeType } : {};
        console.log('Using MIME type:', mimeType || 'default');
        
        mediaRecorder = new MediaRecorder(audioStream, options);
        
        // Set up event handlers
        mediaRecorder.ondataavailable = event => {
            console.log('Data available, size:', event.data.size);
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = async () => {
            console.log('MediaRecorder stopped');
            // Process collected audio data
            if (audioChunks.length > 0 && audioChunks.some(chunk => chunk.size > 0)) {
                const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType || 'audio/webm' });
                console.log('Created audio blob, size:', audioBlob.size, 'type:', audioBlob.type);
                debugAudioBlob = audioBlob;
                // 设置全局变量latestAudioBlob
                window.latestAudioBlob = audioBlob;
                showDebugAudioPlayer(audioBlob);
                
                // Convert to base64 for sending to backend
                try {
                    const base64Data = await convertBlobToBase64(audioBlob);
                    console.log('音频数据转换完成，base64长度:', base64Data.length);
                    
                    // Send to backend for speech recognition
                    sendAudioToBackend(base64Data);
                } catch (error) {
                    console.error('Error converting audio to base64:', error);
                    showStatusMessage('音频转换失败: ' + error.message, 'error');
                    hideDebugAudioPlayer();
                }
            } else {
                console.log('没有录制到音频数据');
                showStatusMessage('没有录制到音频数据', 'error');
                hideDebugAudioPlayer();
            }
        };
        
        // Error handling
        mediaRecorder.onerror = (event) => {
            console.error('MediaRecorder error:', event.error);
            showStatusMessage('录音出错: ' + (event.error?.message || '未知错误'), 'error');
            isRecognizing = false;
            updateVoiceButtonState(false);
        };
        
        // Start recording with time slicing to ensure data is available
        // Use smaller time slice for better compatibility
        mediaRecorder.start(250); // Collect data every 250ms
        isRecognizing = true;
        updateVoiceButtonState(true);
        showStatusMessage('正在录音，请说话...', 'info');
        
        console.log('Started recording with MediaRecorder');
        
        // Set recording timeout
        setTimeout(() => {
            if (isRecognizing) {
                stopCustomVoiceRecognition();
            }
        }, 15000); // 15秒自动停止
        
    } catch (error) {
        console.error('Error starting voice recognition:', error);
        let message = '无法访问麦克风: ' + error.message;
        
        // Provide specific guidance for common issues
        if (error.name === 'NotAllowedError') {
            message = '麦克风访问被拒绝。请检查浏览器权限设置并允许访问麦克风。';
        } else if (error.name === 'NotFoundError') {
            message = '未找到可用的麦克风设备。请检查设备连接。';
        } else if (error.name === 'NotSupportedError') {
            message = '当前环境不支持录音功能。请确保通过HTTPS或localhost访问此页面。';
        }
        
        showStatusMessage(message, 'error');
        isRecognizing = false;
        updateVoiceButtonState(false);
    }
}

// Stop custom voice recognition
function stopCustomVoiceRecognition() {
    console.log('Stopping voice recognition');
    
    try {
        // Stop media recorder
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            console.log('MediaRecorder stop command sent');
        }
        
        // Stop all tracks
        if (audioStream) {
            audioStream.getTracks().forEach(track => {
                console.log('Stopping track:', track.kind);
                track.stop();
            });
        }
        
        isRecognizing = false;
        updateVoiceButtonState(false);
        console.log('Stopped recording');
    } catch (error) {
        console.error('Error stopping voice recognition:', error);
        showStatusMessage('停止录音时出错: ' + error.message, 'error');
        isRecognizing = false;
        updateVoiceButtonState(false);
        hideDebugAudioPlayer();
    }
}

// Show debug audio player
function showDebugAudioPlayer(blob) {
    const debugElement = document.getElementById('audio-debug');
    const audioPlayer = document.getElementById('debug-audio-player');
    
    if (debugElement && audioPlayer) {
        // Revoke previous object URLs to free memory
        if (audioPlayer.src) {
            URL.revokeObjectURL(audioPlayer.src);
        }
        
        const url = URL.createObjectURL(blob);
        audioPlayer.src = url;
        debugElement.style.display = 'block';
        
        // Ensure the audio is loaded
        audioPlayer.load();
        
        // Add event listener to play button
        const playButton = document.getElementById('play-debug-audio');
        if (playButton) {
            playButton.onclick = () => {
                // Reset playback position
                audioPlayer.currentTime = 0;
                
                // Make sure to handle the play promise
                const playPromise = audioPlayer.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('音频播放成功');
                            showStatusMessage('音频播放成功', 'success');
                        })
                        .catch(error => {
                            console.error('音频播放失败:', error);
                            showStatusMessage('音频播放失败: ' + error.message, 'error');
                        });
                }
            };
        }
        
        // Add download button for debugging
        let downloadButton = document.getElementById('download-debug-audio');
        if (!downloadButton) {
            downloadButton = document.createElement('button');
            downloadButton.id = 'download-debug-audio';
            downloadButton.textContent = '下载音频文件';
            downloadButton.style.marginLeft = '10px';
            downloadButton.onclick = () => {
                const a = document.createElement('a');
                a.href = url;
                a.download = 'recorded-audio.webm';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
            debugElement.appendChild(downloadButton);
        }
        
        // Add save base64 button for backend testing
        let saveBase64Button = document.getElementById('save-base64-audio');
        if (!saveBase64Button) {
            saveBase64Button = document.createElement('button');
            saveBase64Button.id = 'save-base64-audio';
            saveBase64Button.textContent = '保存Base64数据';
            saveBase64Button.style.marginLeft = '10px';
            saveBase64Button.onclick = saveAudioDataBase64;
            debugElement.appendChild(saveBase64Button);
        }
    }
}

// Save audio data as base64 for backend testing
function saveAudioDataBase64() {
    if (debugAudioBlob) {
        const reader = new FileReader();
        reader.onload = function() {
            const base64Data = reader.result.split(',')[1]; // Remove data URL prefix
            // Send to backend for saving
            fetch(`${API_BASE_URL}/new-speech/save-audio-debug`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ audioData: base64Data })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showStatusMessage('音频数据已保存到服务器', 'success');
                } else {
                    showStatusMessage('保存失败: ' + data.message, 'error');
                }
            })
            .catch(error => {
                console.error('保存音频数据时出错:', error);
                showStatusMessage('保存失败: ' + error.message, 'error');
            });
        };
        reader.readAsDataURL(debugAudioBlob);
    }
}

// Hide debug audio player
function hideDebugAudioPlayer() {
    const debugElement = document.getElementById('audio-debug');
    if (debugElement) {
        debugElement.style.display = 'none';
    }
}

// Send audio data to backend
async function sendAudioToBackend(audioBase64) {
    showProcessingModal();
    
    try {
        console.log('Sending speech recognition request to:', `${API_BASE_URL}/new-speech/new-speech-to-text`);
        const response = await fetch(`${API_BASE_URL}/new-speech/new-speech-to-text`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                audioData: audioBase64
            })
        });
        
        console.log('Received response, status:', response.status);
        console.log('Response Content-Type:', response.headers.get('content-type'));
        
        // Check if response is JSON format
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            // If not JSON response, get text content to see what was actually returned
            const textResponse = await response.text();
            console.error('Non-JSON response, actual content:', textResponse.substring(0, 500));
            throw new Error(`Server returned non-JSON response (Status: ${response.status})`);
        }
        
        const result = await response.json();
        console.log('Speech recognition response:', result);
        
        if (response.ok && result.success) {
            console.log('Speech recognition successful, text length:', result.text.length);
            updateFormWithSpeech(result.text);
            showStatusMessage('语音识别成功', 'success');
        } else {
            console.log('Speech recognition failed:', result.message);
            showStatusMessage('语音识别失败: ' + (result.message || '未知错误'), 'error');
        }
    } catch (error) {
        console.error('Error sending audio to backend:', error);
        showStatusMessage('语音识别请求失败: ' + error.message, 'error');
    } finally {
        hideProcessingModal();
    }
}

// Convert blob to base64
function convertBlobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]); // Remove data URL prefix
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Convert WebM blob to raw PCM data for科大讯飞(iFlytek) API
async function convertWebMToRawPCM(audioBuffer) {
  console.warn("警告：当前实现不包含完整的WebM到PCM转换，仅为测试用途");
  
  // 这里应该实现完整的WebM到PCM转换
  // 但在当前实现中，我们直接返回buffer，由后端处理转换
  return audioBuffer;
}

// Convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Show processing modal
function showProcessingModal() {
  if (processingModal) {
    processingModal.classList.remove('hidden');
  }
}

// Hide processing modal
function hideProcessingModal() {
  if (processingModal) {
    processingModal.classList.add('hidden');
  }
}

// Show status message
function showStatusMessage(message, type) {
  // 移除可能已存在的状态消息
  const existingMessage = document.querySelector('.status-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // 创建新的状态消息元素
  const statusMessage = document.createElement('div');
  statusMessage.className = `status-message ${type}`;
  statusMessage.textContent = message;
  statusMessage.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    z-index: 10000;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  `;
  
  // 根据消息类型设置背景色
  if (type === 'error') {
    statusMessage.style.backgroundColor = '#e74c3c';
  } else if (type === 'info') {
    statusMessage.style.backgroundColor = '#3498db';
  } else {
    statusMessage.style.backgroundColor = '#2ecc71';
  }
  
  // 添加到页面
  document.body.appendChild(statusMessage);
  
  // 3秒后自动移除
  setTimeout(() => {
    if (statusMessage.parentNode) {
      statusMessage.parentNode.removeChild(statusMessage);
    }
  }, 3000);
}

// Update voice button state
function updateVoiceButtonState(isRecording) {
  const startVoiceBtn = document.getElementById('start-voice-btn');
  const stopVoiceBtn = document.getElementById('stop-voice-btn');
  
  if (startVoiceBtn && stopVoiceBtn) {
    if (isRecording) {
      startVoiceBtn.disabled = true;
      stopVoiceBtn.disabled = false;
      startVoiceBtn.textContent = '录音中...';
    } else {
      startVoiceBtn.disabled = false;
      stopVoiceBtn.disabled = true;
      startVoiceBtn.textContent = '开始语音输入';
    }
  }
}

// Update form with speech recognition result
function updateFormWithSpeech(text) {
  const preferencesInput = document.getElementById('preferences');
  if (preferencesInput) {
    // 如果输入框中已有内容，则将新内容追加到现有内容后面
    if (preferencesInput.value) {
      preferencesInput.value += ' ' + text;
    } else {
      preferencesInput.value = text;
    }
  } else {
    console.error('无法找到ID为preferences的输入框');
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
