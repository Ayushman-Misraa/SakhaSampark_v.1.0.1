import { AuthManager } from './modules/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    AuthManager.onAuthStateChanged((user) => {
        if (user) {
            window.location.href = 'index.html';
        }
    });

    const signupBtn = document.getElementById('signup-btn');
    const displayNameInput = document.getElementById('display-name');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    signupBtn.addEventListener('click', async () => {
        const displayName = displayNameInput.value.trim();
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Validation
        if (!displayName || !username || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        signupBtn.disabled = true;
        signupBtn.textContent = 'Creating Account...';

        const result = await AuthManager.signUp(displayName, username, password);

        if (result.success) {
            window.location.href = 'index.html';
        } else {
            alert(result.error || 'Sign up failed. Please try again.');
            signupBtn.disabled = false;
            signupBtn.textContent = 'Create Account';
        }
    });

    // Handle enter key press
    confirmPasswordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            signupBtn.click();
        }
    });
});