// File: /shop-analyser/shop-analyser/src/js/userAuth.js

const users = JSON.parse(localStorage.getItem('users')) || [];

// Function to handle user signup
function signup(username, password) {
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return { success: false, message: 'Username already exists.' };
    }
    const newUser = { username, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, message: 'Signup successful!' };
}

// Function to handle user login
function login(username, password) {
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        sessionStorage.setItem('loggedInUser', username);
        return { success: true, message: 'Login successful!' };
    }
    return { success: false, message: 'Invalid username or password.' };
}

// Function to check if user is logged in
function isLoggedIn() {
    return sessionStorage.getItem('loggedInUser') !== null;
}

// Function to logout user
function logout() {
    sessionStorage.removeItem('loggedInUser');
}

// Exporting functions for use in other modules
export { signup, login, isLoggedIn, logout };