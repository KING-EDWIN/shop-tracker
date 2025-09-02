// Enterprise Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        console.log('🔐 Initializing Enterprise Authentication System...');
        this.checkAuthStatus();
        this.setupEventListeners();
        console.log('✅ Authentication System initialized!');
    }

    // User database (in production, this would be a secure backend)
    users = {
        'admin': {
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            name: 'John Doe',
            email: 'john@shopanalyser.com',
            permissions: ['all'],
            avatar: '👑',
            lastLogin: null
        },
        'manager': {
            username: 'manager',
            password: 'manager123',
            role: 'manager',
            name: 'Sarah Smith',
            email: 'sarah@shopanalyser.com',
            permissions: ['dashboard', 'products', 'analytics', 'accountability', 'taxes', 'wholesalers', 'adverts', 'reports', 'business-insights'],
            avatar: '👔',
            lastLogin: null
        },
        'cashier': {
            username: 'cashier',
            password: 'cashier123',
            role: 'cashier',
            name: 'Mike Johnson',
            email: 'mike@shopanalyser.com',
            permissions: ['dashboard', 'products', 'sales-entry', 'inventory-update', 'daily-summary', 'basic-analytics'],
            avatar: '💼',
            lastLogin: null
        }
    };

    setupEventListeners() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    }

    async handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        if (!username || !password) {
            this.showError('Please enter both username and password');
            return;
        }

        // Show loading state
        const loginBtn = document.querySelector('.login-btn');
        const originalText = loginBtn.innerHTML;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        loginBtn.disabled = true;

        try {
            const user = await this.authenticateUser(username, password);
            if (user) {
                this.loginSuccess(user, rememberMe);
            } else {
                this.showError('Invalid username or password');
                // Reset button
                loginBtn.innerHTML = originalText;
                loginBtn.disabled = false;
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('An error occurred during login');
            // Reset button
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
        }
    }

    async authenticateUser(username, password) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const user = this.users[username];
        if (user && user.password === password) {
            return user;
        }
        return null;
    }

    loginSuccess(user, rememberMe) {
        // Update user's last login
        user.lastLogin = new Date().toISOString();
        
        // Store user session
        const sessionData = {
            user: {
                username: user.username,
                role: user.role,
                name: user.name,
                email: user.email,
                permissions: user.permissions,
                avatar: user.avatar
            },
            loginTime: new Date().toISOString(),
            rememberMe: rememberMe
        };

        if (rememberMe) {
            localStorage.setItem('shopAnalyserSession', JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem('shopAnalyserSession', JSON.stringify(sessionData));
        }

        this.currentUser = sessionData.user;
        this.isAuthenticated = true;

        // Show success message
        this.showSuccess(`Welcome back, ${user.name}!`);
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    }

    loginAs(role) {
        console.log('🔐 AuthSystem.loginAs called with role:', role);
        const user = this.users[role];
        console.log('👤 User found:', user);
        
        if (user) {
            // Show feedback that demo account was selected
            this.showSuccess(`Logging in as ${user.name} (${user.role})...`);
            
            // Fill in the credentials
            const usernameField = document.getElementById('username');
            const passwordField = document.getElementById('password');
            
            if (usernameField && passwordField) {
                usernameField.value = user.username;
                passwordField.value = user.password;
                console.log('✅ Credentials filled in');
                
                // Automatically trigger login
                setTimeout(() => {
                    console.log('🚀 Triggering automatic login...');
                    this.handleLogin();
                }, 500);
            } else {
                console.error('❌ Username or password fields not found!');
                this.showError('Login form fields not found');
            }
        } else {
            console.error('❌ User not found for role:', role);
            this.showError(`Demo account for ${role} not found`);
        }
    }

    checkAuthStatus() {
        const sessionData = localStorage.getItem('shopAnalyserSession') || sessionStorage.getItem('shopAnalyserSession');
        
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const loginTime = new Date(session.loginTime);
                const now = new Date();
                const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);

                // Check if session is still valid (24 hours for remember me, 8 hours for regular)
                const maxHours = session.rememberMe ? 24 : 8;
                
                if (hoursSinceLogin < maxHours) {
                    this.currentUser = session.user;
                    this.isAuthenticated = true;
                    console.log('✅ User session restored:', this.currentUser.name);
                } else {
                    // Session expired
                    this.logout();
                    console.log('⏰ User session expired');
                }
            } catch (error) {
                console.error('Error parsing session data:', error);
                this.logout();
            }
        }
    }

    logout() {
        // Clear session data
        localStorage.removeItem('shopAnalyserSession');
        sessionStorage.removeItem('shopAnalyserSession');
        
        // Clear current user
        this.currentUser = null;
        this.isAuthenticated = false;
        
        // Redirect to login
        window.location.href = '/login';
    }

    requireAuth() {
        if (!this.isAuthenticated) {
            window.location.href = '/login';
            return false;
        }
        return true;
    }

    checkPermission(permission) {
        if (!this.isAuthenticated || !this.currentUser) {
            return false;
        }
        
        if (this.currentUser.permissions.includes('all')) {
            return true;
        }
        
        return this.currentUser.permissions.includes(permission);
    }

    updateUIForUser() {
        if (!this.currentUser) return;

        // Update user profile in sidebar
        const userProfile = document.querySelector('.user-profile');
        if (userProfile) {
            userProfile.innerHTML = `
                <div class="user-avatar">
                    <span style="font-size: 24px;">${this.currentUser.avatar}</span>
                </div>
                <div class="user-info">
                    <div class="user-name">${this.currentUser.name}</div>
                    <div class="user-role">${this.capitalizeFirst(this.currentUser.role)}</div>
                </div>
            `;
        }

        // Update header user info
        const headerUserInfo = document.querySelector('.user-details');
        if (headerUserInfo) {
            headerUserInfo.innerHTML = `
                <span class="user-name">${this.currentUser.name}</span>
                <span class="user-email">${this.currentUser.email}</span>
            `;
        }

        // Update page title
        const pageTitle = document.querySelector('title');
        if (pageTitle) {
            pageTitle.textContent = `Shop Analyser Enterprise - ${this.currentUser.name}`;
        }

        // Show/hide navigation items based on permissions
        this.updateNavigationPermissions();
    }

    updateNavigationPermissions() {
        if (!this.currentUser) return;

        console.log('🔐 Updating navigation permissions for:', this.currentUser.role);

        // Define role-based navigation visibility
        const roleNavigation = {
            'admin': ['dashboard', 'products', 'ai-insights', 'analytics', 'accountability', 'taxes', 'wholesalers', 'adverts', 'system-settings'],
            'manager': ['dashboard', 'products', 'analytics', 'accountability', 'taxes', 'wholesalers', 'adverts', 'business-reports'],
            'cashier': ['dashboard', 'products', 'inventory-entry', 'sales-entry', 'daily-summary', 'basic-analytics']
        };

        const allowedPages = roleNavigation[this.currentUser.role] || [];
        console.log('✅ Allowed pages for', this.currentUser.role, ':', allowedPages);

        // Hide/show navigation items based on role
        const navItems = document.querySelectorAll('.nav-link');
        navItems.forEach(item => {
            const pageName = item.getAttribute('data-page');
            if (pageName && !allowedPages.includes(pageName)) {
                item.style.display = 'none';
                console.log('🚫 Hiding navigation item:', pageName);
            } else {
                item.style.display = 'flex';
                console.log('✅ Showing navigation item:', pageName);
            }
        });
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `auth-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Session management
    refreshSession() {
        if (this.isAuthenticated && this.currentUser) {
            const sessionData = {
                user: this.currentUser,
                loginTime: new Date().toISOString(),
                rememberMe: true
            };
            
            localStorage.setItem('shopAnalyserSession', JSON.stringify(sessionData));
        }
    }

    // User management methods
    changePassword(oldPassword, newPassword) {
        if (!this.isAuthenticated) return false;
        
        const user = this.users[this.currentUser.username];
        if (user && user.password === oldPassword) {
            user.password = newPassword;
            this.showSuccess('Password changed successfully');
            return true;
        } else {
            this.showError('Current password is incorrect');
            return false;
        }
    }

    updateProfile(updates) {
        if (!this.isAuthenticated) return false;
        
        const user = this.users[this.currentUser.username];
        if (user) {
            Object.assign(user, updates);
            this.currentUser = { ...this.currentUser, ...updates };
            this.showSuccess('Profile updated successfully');
            return true;
        }
        return false;
    }
}

// Global authentication instance
window.authSystem = new AuthSystem();

// Expose loginAs function globally for demo accounts
window.loginAs = function(role) {
    console.log('🔐 Demo login requested for role:', role);
    if (window.authSystem) {
        console.log('✅ AuthSystem found, calling loginAs...');
        window.authSystem.loginAs(role);
    } else {
        console.error('❌ AuthSystem not found!');
    }
};

// Utility functions
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const passwordIcon = document.getElementById('password-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        passwordIcon.className = 'fas fa-eye';
    }
}

function showSignup() {
    alert('Please contact our sales team at sales@shopanalyser.ug for enterprise account setup.');
}

// Auto-logout on inactivity (30 minutes)
let inactivityTimer;
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        if (window.authSystem && window.authSystem.isAuthenticated) {
            window.authSystem.showError('Session expired due to inactivity');
            window.authSystem.logout();
        }
    }, 30 * 60 * 1000); // 30 minutes
}

// Reset timer on user activity
document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);
document.addEventListener('click', resetInactivityTimer);
document.addEventListener('scroll', resetInactivityTimer);

// Initialize timer
resetInactivityTimer();

// Check auth status when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (window.authSystem) {
        window.authSystem.checkAuthStatus();
    }
});
