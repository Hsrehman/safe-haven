function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Add your login logic here
    console.log('Login attempt:3', { email, password });
    // script.js

    // Validation helper functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    
    const validatePassword = (password) => {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };
    
    const validateName = (name) => {
        // At least 2 characters, only letters and spaces
        const nameRegex = /^[A-Za-z\s]{2,}$/;
        return nameRegex.test(name);
    };
    
    // Show error message
    const showError = (inputElement, message) => {
        const errorDiv = inputElement.nextElementSibling;
        if (!errorDiv || !errorDiv.classList.contains('error-message')) {
            const div = document.createElement('div');
            div.className = 'error-message text-red-500 text-sm mt-1';
            div.textContent = message;
            inputElement.parentNode.insertBefore(div, inputElement.nextSibling);
        } else {
            errorDiv.textContent = message;
        }
        inputElement.classList.add('border-red-500');
    };
    
    // Clear error message
    const clearError = (inputElement) => {
        const errorDiv = inputElement.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.remove();
        }
        inputElement.classList.remove('border-red-500');
    };
    
    // Real-time validation for login form
    document.getElementById('login-email').addEventListener('input', function(e) {
        if (!validateEmail(this.value)) {
            showError(this, 'Please enter a valid email address');
        } else {
            clearError(this);
        }
    });
    
    document.getElementById('login-password').addEventListener('input', function(e) {
        if (this.value.length < 8) {
            showError(this, 'Password must be at least 8 characters long');
        } else {
            clearError(this);
        }
    });
    
    // Real-time validation for signup form
    document.getElementById('signup-name').addEventListener('input', function(e) {
        if (!validateName(this.value)) {
            showError(this, 'Name must contain only letters and be at least 2 characters long');
        } else {
            clearError(this);
        }
    });
    
    document.getElementById('signup-email').addEventListener('input', function(e) {
        if (!validateEmail(this.value)) {
            showError(this, 'Please enter a valid email address');
        } else {
            clearError(this);
        }
    });
    
    document.getElementById('signup-password').addEventListener('input', function(e) {
        if (!validatePassword(this.value)) {
            showError(this, 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character');
        } else {
            clearError(this);
        }
    });
    
    document.getElementById('signup-confirm-password').addEventListener('input', function(e) {
        const password = document.getElementById('signup-password').value;
        if (this.value !== password) {
            showError(this, 'Passwords do not match');
        } else {
            clearError(this);
        }
    });
    
    // Handle login form submission
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email');
        const password = document.getElementById('login-password');
        let isValid = true;
    
        // Clear previous errors
        clearError(email);
        clearError(password);
    
        // Validate email
        if (!validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }
    
        // Validate password
        if (password.value.length < 8) {
            showError(password, 'Password must be at least 8 characters long');
            isValid = false;
        }
    
        if (isValid) {
            // Add your login logic here
            console.log('Login attempt:', { email: email.value, password: password.value });
            closeModal('loginModal');
            
            // Reset form
            this.reset();
        }
    });
    
    // Handle signup form submission
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signup-name');
        const email = document.getElementById('signup-email');
        const password = document.getElementById('signup-password');
        const confirmPassword = document.getElementById('signup-confirm-password');
        let isValid = true;
    
        // Clear previous errors
        clearError(name);
        clearError(email);
        clearError(password);
        clearError(confirmPassword);
    
        // Validate name
        if (!validateName(name.value)) {
            showError(name, 'Name must contain only letters and be at least 2 characters long');
            isValid = false;
        }
    
        // Validate email
        if (!validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }
    
        // Validate password
        if (!validatePassword(password.value)) {
            showError(password, 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character');
            isValid = false;
        }
    
        // Validate confirm password
        if (password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Passwords do not match');
            isValid = false;
        }
    
        if (isValid) {
            // Add your signup logic here
            console.log('Signup attempt:', {
                name: name.value,
                email: email.value,
                password: password.value
            });
            closeModal('signupModal');
            
            // Reset form
            this.reset();
        }
    });
    
    // Close the modal after submission
    closeModal('loginModal');
});

// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Add your signup logic here
    console.log('Signup attempt:', { name, email, password });

    // Add to script.js

    async function registerUser(formData) {
        try {
            const response = await fetch('/register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Registration successful! Please check your email to verify your account.');
                closeModal('signupModal');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during registration');
        }
    }

    // Update the signup form submission handler
    document.getElementById('signupForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = {
                name: document.getElementById('signup-name').value,
                email: document.getElementById('signup-email').value,
                password: document.getElementById('signup-password').value
            };
            
            await registerUser(formData);
        }
    });
    
    // Close the modal after submission
    closeModal('signupModal');
});
