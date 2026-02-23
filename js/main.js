// js/main.js – POLYGON EDUCITY Contact Form & Navigation

// CONFIG
const CONFIG = {
    emailjs: {
        publicKey:  'AwQ8OM1muQtAYe2-e',
        serviceID:  'service_y0nj4ef',
        templateID: 'template_gpw14fk'
    },
    formSuccessAutoCloseMs: 4000,
    confetti: {
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
    }
};

// STATE
let elements = {};

// ────────────────────────────────────────────────
// DOM UTILITIES
// ────────────────────────────────────────────────
function createLoadingOverlay() {
    const el = document.createElement('div');
    el.className = 'loading-overlay';
    el.innerHTML = '<div class="spinner"></div>';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    return el;
}

function createSuccessModal() {
    const el = document.createElement('div');
    el.className = 'feedback-modal success-modal';
    el.setAttribute('role', 'alertdialog');
    el.setAttribute('aria-labelledby', 'success-title');
    el.innerHTML = `
        <div class="success-emoji">🎉</div>
        <h3 id="success-title">Message Sent Successfully!</h3>
        <p>We'll get back to you soon to discuss your innovative journey.</p>
    `;
    document.body.appendChild(el);
    return el;
}

function createErrorModal() {
    const el = document.createElement('div');
    el.className = 'feedback-modal error-modal';
    el.setAttribute('role', 'alertdialog');
    el.setAttribute('aria-labelledby', 'error-title');
    el.innerHTML = `
        <div class="sad-emoji">😞</div>
        <h3 id="error-title">Oops! Something Went Wrong</h3>
        <p>Failed to send your message. Please try again.</p>
        <button class="retry-btn" type="button">Try Again</button>
    `;
    document.body.appendChild(el);
    return el;
}

function createModalOverlay() {
    const el = document.createElement('div');
    el.className = 'modal-overlay';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    return el;
}

function showModal(modal, autoClose = false) {
    elements.modalOverlay.style.display = 'block';
    modal.style.display = 'block';
    modal.focus();

    if (autoClose) {
        setTimeout(() => hideModal(modal), CONFIG.formSuccessAutoCloseMs);
    }
}

function hideModal(modal) {
    modal.style.display = 'none';
    elements.modalOverlay.style.display = 'none';
    elements.form.querySelector('[name="name"]').focus();
}

function playConfetti() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    confetti(CONFIG.confetti);
}

// ────────────────────────────────────────────────
// FORM LOGIC
// ────────────────────────────────────────────────
function validateFormData(data) {
    if (!data.name?.trim() || !data.email?.trim() || !data.phone?.trim() || !data.interest?.trim() || !data.message?.trim()) {
        return { valid: false, message: 'Please fill all required fields.' };
    }

    if (!/^[0-9\s\-\+()]{10,15}$/.test(data.phone.trim())) {
        return { valid: false, message: 'Please enter a valid phone number (10–15 digits).' };
    }

    return { valid: true };
}

async function submitForm() {
    const formData = new FormData(elements.form);
    const data = Object.fromEntries(formData);

    const validation = validateFormData(data);
    if (!validation.valid) {
        alert(validation.message);
        return;
    }

    elements.loadingOverlay.style.display = 'flex';

    try {
        await emailjs.send(
            CONFIG.emailjs.serviceID,
            CONFIG.emailjs.templateID,
            {
                from_name:    data.name,
                from_email:   data.email,
                from_phone:   data.phone,
                interest:     data.interest,
                message:      data.message
            }
        );

        elements.loadingOverlay.style.display = 'none';
        playConfetti();
        showModal(elements.successModal, true);
        elements.form.reset();

    } catch (err) {
        console.error('Email send failed:', err);
        elements.loadingOverlay.style.display = 'none';
        showModal(elements.errorModal);
    }
}

// ────────────────────────────────────────────────
// EVENT BINDING
// ────────────────────────────────────────────────
function initEventListeners() {
    elements.hamburger?.addEventListener('click', () => {
        elements.navMenu.classList.toggle('active');
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            elements.navMenu?.classList.remove('active');
        });
    });

    elements.form.addEventListener('submit', async e => {
        e.preventDefault();
        await submitForm();
    });

    elements.errorModal.querySelector('.retry-btn')?.addEventListener('click', () => {
        hideModal(elements.errorModal);
        elements.form.reset();
        elements.form.querySelector('[name="name"]').focus();
    });
}

// ────────────────────────────────────────────────
// INIT
// ────────────────────────────────────────────────
function init() {
    elements = {
        hamburger:      document.querySelector('.hamburger'),
        navMenu:        document.querySelector('.nav-menu'),
        form:           document.getElementById('enquiry-form'),
        loadingOverlay: createLoadingOverlay(),
        successModal:   createSuccessModal(),
        errorModal:     createErrorModal(),
        modalOverlay:   createModalOverlay()
    };

    if (!CONFIG.emailjs.publicKey.includes('YOUR_')) {
        emailjs.init(CONFIG.emailjs.publicKey);
    } else {
        console.warn('EmailJS not configured – emails will not be sent.');
    }

    initEventListeners();
    initDarkMode();
    console.log('POLYGON EDUCITY frontend initialized');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Dark Mode Toggle – single icon swap + persistence
function initDarkMode() {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) {
        console.warn('Theme toggle button not found');
        return;
    }

    const icon = toggle.querySelector('.theme-icon');
    if (!icon) {
        console.warn('Theme icon span not found');
        return;
    }

    // Load saved preference or system preference
    let savedMode = localStorage.getItem('darkMode');
    if (!savedMode) {
        savedMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        localStorage.setItem('darkMode', savedMode);
    }

    // Apply initial state
    if (savedMode === 'dark') {
        document.body.classList.add('dark');
        icon.textContent = '☀️'; // sun in dark mode
    } else {
        icon.textContent = '🌙'; // moon in light mode
    }

    // Click handler
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        icon.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('darkMode', isDark ? 'dark' : 'light');

        // Gentle click feedback
        toggle.style.transform = 'scale(1.2)';
        setTimeout(() => { toggle.style.transform = ''; }, 150);
    });

    console.log('Dark mode initialized – current mode:', savedMode);
}

