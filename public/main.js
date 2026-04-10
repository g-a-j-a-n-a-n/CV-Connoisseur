
/**
 * CV Connoisseur - Frontend Logic
 * This script handles authentication, dark mode, sidebar history, and AI interaction.
 * Uses localStorage for simple persistence.
 */

// DOM Elements
const inputBox = document.querySelector('#resumeInput');
const sendBtn = document.querySelector('#reviewBtn');
const chatArea = document.querySelector('#chatArea');
const sidebar = document.querySelector('#sidebar');
const toggleBtn = document.querySelector('#toggleSidebarBtn');
const historyList = document.querySelector('#historyList');
const themeToggle = document.querySelector('#themeToggle');
const authOverlay = document.querySelector('#authOverlay');
const authForm = document.querySelector('#authForm');
const authTitle = document.querySelector('#authTitle');
const authSubmitBtn = document.querySelector('#authSubmitBtn');
const authToggleLink = document.querySelector('#authToggleLink');
const logoutBtn = document.querySelector('#logoutBtn');
const displayUsername = document.querySelector('#displayUsername');
const fileInput = document.querySelector('#fileInput');
const fileStatus = document.querySelector('#fileStatus');

// Application State
let currentUser = null;
let isRegistering = false;
let userHistory = [];

/**
 * Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    // Check for existing session
    const savedUser = localStorage.getItem('cv_connoisseur_session');
    if (savedUser) {
        loginUser(savedUser);
    } else {
        authOverlay.classList.remove('hidden');
    }

    // Apply saved theme
    const savedTheme = localStorage.getItem('cv_connoisseur_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
});

/**
 * Authentication Logic
 */

// Toggle between Login and Register modes
authToggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isRegistering = !isRegistering;
    authTitle.textContent = isRegistering ? "Registration" : "Head Chef's Entry";
    authSubmitBtn.textContent = isRegistering ? "Register" : "Login";
    document.querySelector('#authSubtitle').textContent = isRegistering ? "Join the team to season your resume" : "Login to season your resume, no matter your profession";
    authToggleLink.textContent = isRegistering ? "Login" : "Register";
    document.querySelector('#authToggleText').textContent = isRegistering ? "Already have an apron?" : "New to the kitchen?";
});

// Handle Auth Form Submission
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameInput = document.querySelector('#username');
    const passwordInput = document.querySelector('#password');
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) return alert("Please provide all credentials (ingredients)!");

    const users = JSON.parse(localStorage.getItem('cv_connoisseur_users') || '{}');

    if (isRegistering) {
        if (users[username]) return alert("This username is already taken!");
        users[username] = { password, history: [] };
        localStorage.setItem('cv_connoisseur_users', JSON.stringify(users));
        alert("Registration successful! Welcome to the kitchen.");
        isRegistering = false;
        authToggleLink.click();
    } else {
        if (users[username] && users[username].password === password) {
            loginUser(username);
            usernameInput.value = "";
            passwordInput.value = "";
        } else {
            alert("Invalid credentials. Did you forget your secret spice?");
        }
    }
});

function loginUser(username) {
    currentUser = username;
    displayUsername.textContent = username;
    localStorage.setItem('cv_connoisseur_session', username);
    authOverlay.classList.add('hidden');
    loadHistory();
}

logoutBtn.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('cv_connoisseur_session');
    authOverlay.classList.remove('hidden');
    chatArea.innerHTML = `
        <div class="ai-message message-bubble">
            <p class="mb-0">Welcome back to the kitchen! I'm your Head Chef. Paste your resume below, and I'll help you season it to perfection.</p>
        </div>`;
    historyList.innerHTML = '';
});

/**
 * History Management
 */

function loadHistory() {
    const users = JSON.parse(localStorage.getItem('cv_connoisseur_users') || '{}');
    userHistory = users[currentUser]?.history || [];
    renderHistory();
}

function saveToHistory(prompt, response) {
    const users = JSON.parse(localStorage.getItem('cv_connoisseur_users') || '{}');
    const entry = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        prompt: prompt,
        response: response
    };
    
    if (!users[currentUser].history) users[currentUser].history = [];
    users[currentUser].history.unshift(entry);
    localStorage.setItem('cv_connoisseur_users', JSON.stringify(users));
    
    userHistory = users[currentUser].history;
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    userHistory.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'sidebar-item';
        // Use the first few words of the resume as title
        const title = item.prompt.substring(0, 30) + (item.prompt.length > 30 ? '...' : '');
        btn.innerHTML = `<strong>${title}</strong><br><small>${item.timestamp}</small>`;
        btn.addEventListener('click', () => {
            displayReview(item.prompt, item.response);
            if (window.innerWidth < 768) sidebar.classList.add('hidden');
        });
        historyList.appendChild(btn);
    });
}

function displayReview(prompt, response) {
    chatArea.innerHTML = ''; 
    
    const userBubble = document.createElement('div');
    userBubble.className = "message-bubble user-message";
    userBubble.textContent = prompt;
    chatArea.appendChild(userBubble);

    const aiBubble = document.createElement('div');
    aiBubble.className = "message-bubble ai-message";
    // Use marked for Markdown rendering
    aiBubble.innerHTML = typeof marked !== 'undefined' ? marked.parse(response) : response;
    chatArea.appendChild(aiBubble);
    
    chatArea.scrollTop = chatArea.scrollHeight;
}

/**
 * AI Review Logic
 */

sendBtn.addEventListener('click', async () => {
    let inputText = inputBox.value.trim();
    if(inputText.length === 0) return;

    // UI Feedback
    const userBubble = document.createElement('div');
    userBubble.textContent = inputText;
    userBubble.className = "message-bubble user-message";
    chatArea.appendChild(userBubble);
    inputBox.value = "";
    chatArea.scrollTop = chatArea.scrollHeight;

    // Loading State
    const aiBubble = document.createElement('div');
    aiBubble.className = "message-bubble ai-message";
    aiBubble.textContent = "Chef is tasting your resume... 🥣";
    chatArea.appendChild(aiBubble);

    try {
        const apiResponse = await fetch('/.netlify/functions/review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resume: inputText })
        });
        
        const data = await apiResponse.json();
        const reviewContent = data.choices[0].message.content;
        
        aiBubble.innerHTML = typeof marked !== 'undefined' ? marked.parse(reviewContent) : reviewContent;
        saveToHistory(inputText, reviewContent);
        
    } catch (error) {
        console.error("Error:", error);
        aiBubble.textContent = "Oops! The kitchen caught fire. Please try again later.";
    }
    // Clear file input and status
    fileInput.value = '';
    fileStatus.textContent = '';
    
    chatArea.scrollTop = chatArea.scrollHeight;
});

/**
 * File Upload and Parsing Logic
 */

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    fileStatus.textContent = `📍 Selected Ingredient: ${file.name} (Preparing...)`;
    
    try {
        let text = '';
        if (file.type === 'application/pdf') {
            text = await parsePDF(file);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            text = await parseDocx(file);
        } else {
            alert("This ingredient isn't on the menu! Please use PDF or DOCX.");
            fileInput.value = '';
            fileStatus.textContent = '';
            return;
        }

        if (text.trim()) {
            inputBox.value = text;
            fileStatus.textContent = `✅ ${file.name} seasoned and ready!`;
        } else {
            throw new Error("Could not extract any flavor (text) from this file.");
        }
    } catch (err) {
        console.error("File processing error:", err);
        alert("The Chef had trouble reading that file: " + err.message);
        fileStatus.textContent = "❌ Failed to read file.";
    }
});

async function parsePDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
    }
    return fullText;
}

async function parseDocx(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    return result.value;
}

/**
 * UI Controls
 */

// Toggle Sidebar
toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('cv_connoisseur_theme', newTheme);
});

