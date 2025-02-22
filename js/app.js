// Main application file
import { ChatManager } from './modules/chat.js';
import { AuthManager } from './modules/auth.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication state
    AuthManager.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        // Initialize chat with user info
        ChatManager.initialize(user);
    });
});