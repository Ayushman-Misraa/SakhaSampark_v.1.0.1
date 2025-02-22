// Firebase Authentication Module
const firebaseConfig = {
    apiKey: "AIzaSyBJYf2RrH7Skg3ER7bmD89GplGx7hw6j54",
    authDomain: "main-sakha-web.firebaseapp.com",
    projectId: "main-sakha-web",
    storageBucket: "main-sakha-web.firebasestorage.app",
    messagingSenderId: "129577284391",
    appId: "1:129577284391:web:f000a99f5c9017fbc9ef02",
    measurementId: "G-W64WYRW8QH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const AuthManager = {
    async signUp(displayName, username, password) {
        try {
            // Create user with email (username) and password
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(
                `${username}@sakhasamprk.com`, // Using a domain to convert username to email
                password
            );

            // Update user profile with display name
            await userCredential.user.updateProfile({
                displayName: displayName
            });

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },

    async login(username, password) {
        try {
            // Login with email (username) and password
            await firebase.auth().signInWithEmailAndPassword(
                `${username}@sakhasamprk.com`,
                password
            );

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },

    async logout() {
        try {
            await firebase.auth().signOut();
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },

    getCurrentUser() {
        return firebase.auth().currentUser;
    },

    onAuthStateChanged(callback) {
        return firebase.auth().onAuthStateChanged(callback);
    }
};