/**
 * Royalty Studioz Website JavaScript
 * Handles navigation, form validation, and smooth scrolling
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initSmoothScrolling();
    initContactForm();
    initAnimations();
});

/**
 * Navigation functionality
 * Handles mobile menu toggle with proper accessibility
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', function() {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        
        // Toggle aria-expanded attribute
        navToggle.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle active class on menu
        navMenu.classList.toggle('active');
        
        // Update hamburger animation
        navToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.classList.remove('active');
        }
    });
}

/**
 * Smooth scrolling for internal anchor links
 */
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Set focus to target element for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
            }
        });
    });
}

/**
 * Contact form validation and handling
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const feedbackDiv = document.getElementById('form-feedback');
    
    // Form validation rules
    const validators = {
        name: {
            element: nameInput,
            rules: [
                {
                    test: (value) => value.trim().length >= 2,
                    message: 'Name must be at least 2 characters long.'
                },
                {
                    test: (value) => value.trim() !== '',
                    message: 'Name is required.'
                }
            ]
        },
        email: {
            element: emailInput,
            rules: [
                {
                    test: (value) => value.trim() !== '',
                    message: 'Email is required.'
                },
                {
                    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                    message: 'Please enter a valid email address.'
                }
            ]
        },
        message: {
            element: messageInput,
            rules: [
                {
                    test: (value) => value.trim() !== '',
                    message: 'Message is required.'
                },
                {
                    test: (value) => value.trim().length >= 10,
                    message: 'Message must be at least 10 characters long.'
                }
            ]
        }
    };
    
    // Real-time validation on input
    Object.keys(validators).forEach(fieldName => {
        const validator = validators[fieldName];
        const input = validator.element;
        
        input.addEventListener('blur', () => validateField(fieldName, validators));
        input.addEventListener('input', () => {
            // Clear error state on input
            clearFieldError(fieldName);
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        let firstInvalidField = null;
        
        // Validate all fields
        Object.keys(validators).forEach(fieldName => {
            const fieldValid = validateField(fieldName, validators);
            if (!fieldValid) {
                isValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = validators[fieldName].element;
                }
            }
        });
        
        if (isValid) {
            handleFormSuccess();
        } else {
            handleFormError();
            // Focus first invalid field
            if (firstInvalidField) {
                firstInvalidField.focus();
            }
        }
    });
    
    /**
     * Validate individual field
     */
    function validateField(fieldName, validators) {
        const validator = validators[fieldName];
        const input = validator.element;
        const value = input.value;
        
        // Clear previous errors
        clearFieldError(fieldName);
        
        // Run validation rules
        for (let rule of validator.rules) {
            if (!rule.test(value)) {
                showFieldError(fieldName, rule.message);
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Show field error
     */
    function showFieldError(fieldName, message) {
        const input = validators[fieldName].element;
        const errorDiv = document.getElementById(`${fieldName}-error`);
        
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
        }
        
        input.setAttribute('aria-invalid', 'true');
        input.classList.add('error');
    }
    
    /**
     * Clear field error
     */
    function clearFieldError(fieldName) {
        const input = validators[fieldName].element;
        const errorDiv = document.getElementById(`${fieldName}-error`);
        
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.classList.remove('show');
        }
        
        input.removeAttribute('aria-invalid');
        input.classList.remove('error');
    }
    
    /**
     * Handle successful form submission
     */
    function handleFormSuccess() {
        // Show success message
        showFeedback('Thank you for your message! We\'ll get back to you within 24-48 hours.', 'success');
        
        // Reset form
        form.reset();
        
        // Clear any remaining error states
        Object.keys(validators).forEach(fieldName => {
            clearFieldError(fieldName);
        });
        
        // Scroll to feedback message
        feedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    /**
     * Handle form validation error
     */
    function handleFormError() {
        showFeedback('Please fix the errors below and try again.', 'error');
        feedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    /**
     * Show feedback message
     */
    function showFeedback(message, type) {
        feedbackDiv.textContent = message;
        feedbackDiv.className = `form-feedback ${type}`;
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                feedbackDiv.className = 'form-feedback';
                feedbackDiv.textContent = '';
            }, 5000);
        }
    }
}

/**
 * Initialize scroll-triggered animations
 */
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Intersection Observer for fade-in animations
    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        element.style.animationPlayState = 'paused';
        fadeObserver.observe(element);
    });
}

/**
 * Utility function to debounce events
 * Useful for scroll and resize event handlers
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Handle window resize events
 */
window.addEventListener('resize', debounce(function() {
    // Close mobile menu on resize to desktop
    const navMenu = document.querySelector('.nav__menu');
    const navToggle = document.querySelector('.nav__toggle');
    
    if (window.innerWidth > 768 && navMenu && navToggle) {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
    }
}, 250));

/**
 * Keyboard navigation improvements
 */
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav__menu');
        const navToggle = document.querySelector('.nav__toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('active');
                navToggle.focus();
            }
        }
    }
});