// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Form Validation and Submission (Client-side only; hook to backend on deploy)
const form = document.getElementById('enquiry-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Basic validation (already handled by HTML required, but reinforce)
    if (!data.name || !data.email || !data.interest || !data.message) {
        alert('Please fill all fields.');
        return;
    }
    
    // Simulate submission (replace with fetch to endpoint like Formspree on deploy)
    console.log('Form submitted:', data); // For local testing
    alert('Thank you! We\'ll connect soon.'); // Replace with success UI
    form.reset();
});
// EmailJS Init (Replace with your keys)
emailjs.init('YOUR_PUBLIC_KEY'); // From EmailJS dashboard

// Form Submission with Animations
const form = document.getElementById('enquiry-form');
const loadingOverlay = document.createElement('div');
loadingOverlay.className = 'loading-overlay';
loadingOverlay.innerHTML = '<div class="spinner"></div>';
document.body.appendChild(loadingOverlay);

const successModal = document.createElement('div');
successModal.className = 'feedback-modal success-modal';
successModal.innerHTML = `
    <div class="success-emoji">🎉</div>
    <h3>Message Sent Successfully!</h3>
    <p>We'll get back to you soon to discuss your innovative journey.</p>
`;
const errorModal = document.createElement('div');
errorModal.className = 'feedback-modal error-modal';
errorModal.innerHTML = `
    <div class="sad-emoji">😞</div>
    <h3>Oops! Something Went Wrong</h3>
    <p>Failed to send your message. Please try again.</p>
    <button class="retry-btn" onclick="retryForm()">Try Again</button>
`;
const modalOverlay = document.createElement('div');
modalOverlay.className = 'modal-overlay';
document.body.appendChild(modalOverlay);

// Show Modal Function
function showModal(modal) {
    modalOverlay.style.display = 'block';
    modal.style.display = 'block';
    document.body.appendChild(modal);
    setTimeout(() => {
        hideModal(modal);
    }, 3000); // Auto-close after 3s (success only; error stays till retry)
}

// Hide Modal
function hideModal(modal) {
    modal.style.display = 'none';
    modalOverlay.style.display = 'none';
}

// Retry Function
function retryForm() {
    form.reset();
    hideModal(errorModal);
}

// Form Handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validation (existing)
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    if (!data.name || !data.email || !data.interest || !data.message) {
        alert('Please fill all required fields.');
        return;
    }
    if (data.phone && !/^[0-9]{10,}$/.test(data.phone.trim())) {
        alert('Please enter a valid phone number (at least 10 digits, numbers only).');
        return;
    }
    
    // Show Loading
    loadingOverlay.style.display = 'flex';
    
    try {
        // EmailJS Send (Replace with your IDs)
        await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
            from_name: data.name,
            from_email: data.email,
            from_phone: data.phone || 'Not provided',
            interest: data.interest,
            message: data.message
        });
        
        // Success: Confetti + Modal
        loadingOverlay.style.display = 'none';
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        showModal(successModal);
        form.reset();
        
    } catch (error) {
        console.error('EmailJS Error:', error);
        loadingOverlay.style.display = 'none';
        showModal(errorModal);
    }
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
        // Close mobile menu if open
        navMenu.classList.remove('active');
    });
});