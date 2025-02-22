// Chat functionality module
import { UserManager } from './user.js';
import { PeerManager } from './peer.js';
import { ChatUI } from './ui.js';
import { AuthManager } from './auth.js';

export const ChatManager = {
    initialize(user) {
        this.setupEventListeners();
        ChatUI.showLoadingScreen();

        // Set the user's display name from Firebase Auth
        UserManager.setCurrentUser(user.displayName);

        // Skip the user setup screen since we have the display name
        PeerManager.initializePeer();
        ChatUI.showScreen('chat-options');
    },

    setupEventListeners() {
        // User Setup
        document.getElementById('start-chat').addEventListener('click', this.handleUserSetup.bind(this));

        // Chat Options
        document.getElementById('private-chat').addEventListener('click', () => ChatUI.showScreen('private-chat-screen'));

        // Back buttons
        const backButtons = document.querySelectorAll('.back-btn');
        backButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                ChatUI.showScreen('chat-options');
            });
        });

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                try {
                    const result = await AuthManager.logout();
                    if (result.success) {
                        window.location.href = 'login.html';
                    } else {
                        alert('Logout failed. Please try again.');
                    }
                } catch (error) {
                    console.error('Logout error:', error);
                    alert('Logout failed. Please try again.');
                }
            });
        }

        // Private Chat
        document.getElementById('connect-peer').addEventListener('click', () => {
            const peerId = document.getElementById('peer-id-input').value;
            PeerManager.connectToPeer(peerId);
        });

        document.getElementById('send-private').addEventListener('click', this.sendPrivateMessage.bind(this));

        // Message input enter key handling
        document.getElementById('private-msg-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendPrivateMessage();
        });
    },

    handleUserSetup() {
        const displayName = document.getElementById('display-name').value.trim();
        if (!displayName) {
            alert('Please enter a display name');
            return;
        }

        UserManager.setCurrentUser(displayName);
        PeerManager.initializePeer();
        ChatUI.showScreen('chat-options');
    },

    sendPrivateMessage() {
        const input = document.getElementById('private-msg-input');
        const message = input.value.trim();
        
        if (message) {
            PeerManager.sendMessage(message);
            input.value = '';
        }
    }
};