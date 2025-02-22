// User management module
let currentUser = null;

export const UserManager = {
    getCurrentUser() {
        return currentUser;
    },

    setCurrentUser(displayName) {
        currentUser = {
            name: displayName,
            id: `user-${Math.random().toString(36).substr(2, 9)}`
        };
        return currentUser;
    },

    clearCurrentUser() {
        currentUser = null;
    }
};