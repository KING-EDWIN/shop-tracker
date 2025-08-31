// File: /shop-analyser/shop-analyser/src/js/userLogs.js

const userLogs = {
    logs: [],

    // Function to add a new log entry
    addLog: function(action, timestamp) {
        const logEntry = {
            action: action,
            timestamp: timestamp
        };
        this.logs.push(logEntry);
        this.saveLogs();
    },

    // Function to save logs to local storage or a file
    saveLogs: function() {
        // Here you would typically save to a file or database
        // For this MVP, we'll use local storage
        localStorage.setItem('userLogs', JSON.stringify(this.logs));
    },

    // Function to retrieve logs from local storage or a file
    retrieveLogs: function() {
        const storedLogs = localStorage.getItem('userLogs');
        if (storedLogs) {
            this.logs = JSON.parse(storedLogs);
        }
    },

    // Function to display logs in the console (or on the dashboard)
    displayLogs: function() {
        this.logs.forEach(log => {
            console.log(`${log.timestamp}: ${log.action}`);
        });
    }
};

// Initialize user logs on page load
document.addEventListener('DOMContentLoaded', () => {
    userLogs.retrieveLogs();
});

// Export the userLogs object for use in other modules
export default userLogs;