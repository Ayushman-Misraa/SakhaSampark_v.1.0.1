// Peer connection handling module
import { UserManager } from './user.js';
import { ChatUI } from './ui.js';

let peer = null;
let connections = new Map();

export const PeerManager = {
    initializePeer() {
        const currentUser = UserManager.getCurrentUser();
        if (!currentUser) return null;

        peer = new Peer(currentUser.id);
        this.setupPeerEvents();
        return peer;
    },

    setupPeerEvents() {
        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
            ChatUI.updatePeerId(id);
            ChatUI.updateConnectionStatus(false);
        });

        peer.on('connection', this.handleIncomingConnection);
        peer.on('error', (err) => {
            console.error('PeerJS error:', err);
            ChatUI.updateConnectionStatus(false);
        });
    },

    connectToPeer(peerId) {
        if (!peerId.trim()) {
            alert('Please enter a peer ID');
            return;
        }

        const conn = peer.connect(peerId);
        this.setupConnection(conn);
    },

    handleIncomingConnection(conn) {
        PeerManager.setupConnection(conn);
    },

    setupConnection(conn) {
        conn.on('open', () => {
            connections.set(conn.peer, conn);
            conn.send({
                type: 'user-info',
                data: { name: UserManager.getCurrentUser().name }
            });
            ChatUI.updateConnectionStatus(true);
        });

        conn.on('data', (data) => {
            if (data.type === 'message') {
                ChatUI.displayMessage(data.data, false);
            } else if (data.type === 'user-info') {
                ChatUI.updateConnectionStatus(true, data.data.name);
            }
        });

        conn.on('close', () => {
            connections.delete(conn.peer);
            ChatUI.updateConnectionStatus(false);
        });

        conn.on('error', () => {
            connections.delete(conn.peer);
            ChatUI.updateConnectionStatus(false);
        });
    },

    sendMessage(message) {
        if (!message.trim()) return;

        const messageData = {
            text: message,
            sender: UserManager.getCurrentUser().name,
            timestamp: new Date().toISOString()
        };

        connections.forEach(conn => {
            conn.send({
                type: 'message',
                data: messageData
            });
        });

        ChatUI.displayMessage(messageData, true);
    }
};