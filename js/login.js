import { AuthManager } from './modules/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    AuthManager.onAuthStateChanged((user) => {
        if (user) {
            window.location.href = 'index.html';
        }
    });

    const loginBtn = document.getElementById('login-btn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    loginBtn.addEventListener('click', async () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            alert('Please fill in all fields');
            return;
        }

        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';

        const result = await AuthManager.login(username, password);

        if (result.success) {
            window.location.href = 'index.html';
        } else {
            alert(result.error || 'Login failed. Please try again.');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }
    });

    // Handle enter key press
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });
});