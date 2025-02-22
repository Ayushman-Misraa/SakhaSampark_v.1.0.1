// UI management module
export const ChatUI = {
    // DOM Elements
    elements: {
        loadingScreen: document.getElementById('loading-screen'),
        userSetup: document.getElementById('user-setup'),
        chatOptions: document.getElementById('chat-options'),
        privateChatScreen: document.getElementById('private-chat-screen'),
        myPeerId: document.getElementById('my-peer-id'),
        messagesContainer: document.getElementById('private-messages')
    },

    showLoadingScreen() {
        setTimeout(() => {
            gsap.to(this.elements.loadingScreen, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    this.elements.loadingScreen.classList.add('hidden');
                    this.elements.userSetup.classList.remove('hidden');
                    gsap.from(this.elements.userSetup, {
                        opacity: 0,
                        y: 20,
                        duration: 0.5
                    });
                }
            });
        }, 3000);
    },

    showScreen(screenId) {
        // Get all screens
        const screens = ['user-setup', 'chat-options', 'private-chat-screen'];
        const currentScreen = screens.find(id => !document.getElementById(id).classList.contains('hidden'));
        const screenToShow = document.getElementById(screenId);

        // If we're already on this screen, do nothing
        if (currentScreen === screenId) return;

        // Hide all screens first
        screens.forEach(id => {
            const screen = document.getElementById(id);
            if (screen && !screen.classList.contains('hidden')) {
                gsap.to(screen, {
                    opacity: 0,
                    y: -20,
                    duration: 0.3,
                    onComplete: () => {
                        screen.classList.add('hidden');
                        // Show the new screen
                        screenToShow.classList.remove('hidden');
                        gsap.fromTo(screenToShow,
                            { opacity: 0, y: 20 },
                            { opacity: 1, y: 0, duration: 0.3 }
                        );
                    }
                });
            }
        });
    },

    updatePeerId(id) {
        this.elements.myPeerId.textContent = id;
        this.setupCopyButton();
    },

    setupCopyButton() {
        const copyBtn = document.querySelector('.copy-btn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(this.elements.myPeerId.textContent).then(() => {
                copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>';
                setTimeout(() => {
                    copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2h8v2H4V2zM2 5h12v9H2V5zm2 2v5h8V7H4z"/></svg>';
                }, 2000);
            });
        });
    },

    updateConnectionStatus(isConnected, peerName = '') {
        const statusIndicator = document.querySelector('.connection-status .status-indicator');
        const statusText = document.querySelector('.connection-status .status-text');
        const connectedPeerIndicator = document.querySelector('.connected-peer .status-indicator');
        const connectedPeerName = document.getElementById('connected-peer-name');

        if (isConnected) {
            statusIndicator.classList.add('connected');
            statusText.textContent = 'Connected';
            connectedPeerIndicator.classList.add('connected');
            connectedPeerName.textContent = peerName;
        } else {
            statusIndicator.classList.remove('connected');
            statusText.textContent = 'Disconnected';
            connectedPeerIndicator.classList.remove('connected');
            connectedPeerName.textContent = 'Not connected';
        }
    },

    displayMessage(message, isSent) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isSent ? 'sent' : 'received'}`;

        const time = new Date(message.timestamp);
        const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = time.toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
            year: time.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        });

        messageElement.innerHTML = `
            <div class="message-content">
                <p>${message.text}</p>
                <div class="message-meta">
                    <span class="sender">${message.sender}</span>
                    <span class="time">${timeStr}</span>
                    <span class="date">${dateStr}</span>
                </div>
            </div>
        `;

        this.elements.messagesContainer.appendChild(messageElement);
        this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;

        // Animate message
        gsap.from(messageElement, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
    }
};