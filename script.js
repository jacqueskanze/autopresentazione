// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');

// Navigation functionality
function showPage(targetPageId) {
    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(targetPageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation active state
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === targetPageId) {
            item.classList.add('active');
        }
    });
    
    // Scroll to top smoothly
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Event listeners for navigation
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = item.dataset.page;
        showPage(targetPage);
        
        // Update URL hash without triggering scroll
        history.pushState(null, null, `#${targetPage}`);
    });
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showPage(hash);
    } else {
        showPage('home');
    }
});

// Initialize page based on URL hash
document.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showPage(hash);
    } else {
        showPage('home');
    }
    
    // Initialize animations and interactions
    initializeAnimations();
    initializeInteractions();
});

// Animation utilities
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all glassmorphism elements
    document.querySelectorAll('.glassmorphism').forEach(el => {
        observer.observe(el);
    });
}

// Interactive features
function initializeInteractions() {
    // Email click to copy functionality
    const emailElements = document.querySelectorAll('.email-value');
    emailElements.forEach(email => {
        email.style.cursor = 'pointer';
        email.title = 'Clicca per copiare';
        
        email.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(email.textContent);
                showNotification('Email copiata negli appunti!', 'success');
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = email.textContent;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('Email copiata negli appunti!', 'success');
            }
        });
    });
    
    // Social links interactions
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const socialName = link.querySelector('.social-name').textContent;
            showNotification(`${socialName} link - In sviluppo!`, 'info');
        });
    });
    
    // Smooth hover effects for cards
    const cards = document.querySelectorAll('.passion-card, .experience-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Grade animation on hover
    const gradeItems = document.querySelectorAll('.grade-item');
    gradeItems.forEach(item => {
        const grade = item.querySelector('.grade');
        
        item.addEventListener('mouseenter', () => {
            grade.style.transform = 'scale(1.2)';
            grade.style.textShadow = '0 0 10px rgba(0, 0, 255, 0.8)';
            grade.style.transition = 'all 0.3s ease';
        });
        
        item.addEventListener('mouseleave', () => {
            grade.style.transform = 'scale(1)';
            grade.style.textShadow = 'none';
        });
    });
    
    // Stats counter animation
    initializeStatsCounter();
    
    // Typing effect for main title
    initializeTypingEffect();
    
    // Parallax effect for background glows
    initializeParallaxEffect();
}

// Stats counter animation
function initializeStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (target.toString().includes('+')) {
                element.textContent = Math.floor(current) + '+';
            } else {
                element.textContent = Math.floor(current);
            }
        }, 50);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.textContent.replace('+', ''));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Typing effect for main title
function initializeTypingEffect() {
    const title = document.querySelector('.main-header h1');
    if (title) {
        const text = title.textContent;
        title.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Add blinking cursor
                title.innerHTML += '<span class="cursor">|</span>';
                
                // Add cursor animation
                const style = document.createElement('style');
                style.textContent = `
                    .cursor {
                        animation: blink 1s infinite;
                    }
                    @keyframes blink {
                        0%, 50% { opacity: 1; }
                        51%, 100% { opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
        };
        
        // Start typing after a short delay
        setTimeout(typeWriter, 500);
    }
}

// Parallax effect for background glows
function initializeParallaxEffect() {
    const glows = document.querySelectorAll('.glow');
    
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        glows.forEach((glow, index) => {
            const speed = (index + 1) * 0.5;
            const x = mouseX * speed * 50;
            const y = mouseY * speed * 50;
            
            glow.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(68, 68, 68, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(250, 250, 250, 0.1);
        border-radius: 12px;
        padding: 16px 20px;
        color: #fafafa;
        font-size: 13px;
        font-weight: 400;
        z-index: 2000;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;
    
    if (type === 'success') {
        notification.style.borderColor = 'rgba(0, 255, 0, 0.3)';
    } else if (type === 'error') {
        notification.style.borderColor = 'rgba(255, 0, 0, 0.3)';
    } else if (type === 'info') {
        notification.style.borderColor = 'rgba(0, 0, 255, 0.3)';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return '✅';
        case 'error':
            return '❌';
        case 'info':
            return 'ℹ️';
        default:
            return '📝';
    }
}

// Topbar scroll effect
let lastScrollTop = 0;
const topbar = document.querySelector('.topbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down - hide topbar
        topbar.style.transform = 'translateX(-50%) translateY(-100%)';
        topbar.style.opacity = '0.8';
    } else {
        // Scrolling up - show topbar
        topbar.style.transform = 'translateX(-50%) translateY(0)';
        topbar.style.opacity = '1';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Easter egg - Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length &&
        konamiCode.every((key, index) => key === konamiSequence[index])) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    showNotification('🎮 Konami Code attivato! Juventus Forever! ⚽', 'success');
    
    // Add special effect
    const body = document.body;
    body.style.animation = 'rainbow 2s ease-in-out';
    
    // Add rainbow keyframes if not already present
    if (!document.querySelector('#rainbow-keyframes')) {
        const style = document.createElement('style');
        style.id = 'rainbow-keyframes';
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                25% { filter: hue-rotate(90deg); }
                50% { filter: hue-rotate(180deg); }
                75% { filter: hue-rotate(270deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        body.style.animation = '';
    }, 2000);
}

// Performance optimization - Debounce resize events
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

// Handle window resize
const handleResize = debounce(() => {
    // Recalculate any size-dependent elements
    const profileImage = document.querySelector('.profile-image');
    if (profileImage && window.innerWidth < 768) {
        profileImage.style.objectPosition = 'center top';
    } else if (profileImage) {
        profileImage.style.objectPosition = 'center';
    }
}, 250);

window.addEventListener('resize', handleResize);

// Dark mode toggle (bonus feature)
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    const isDarkMode = !document.body.classList.contains('light-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    showNotification(
        isDarkMode ? '🌙 Modalità scura attivata' : '☀️ Modalità chiara attivata',
        'info'
    );
}

// Load saved theme preference
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'false') {
        document.body.classList.add('light-mode');
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Alt + number keys for quick navigation
    if (e.altKey && !e.ctrlKey && !e.shiftKey) {
        const keyNum = parseInt(e.key);
        const pages = ['home', 'passioni', 'scuola', 'esperienze', 'contatti'];
        
        if (keyNum >= 1 && keyNum <= 5) {
            e.preventDefault();
            showPage(pages[keyNum - 1]);
            showNotification(`Navigazione rapida: ${pages[keyNum - 1]}`, 'info');
        }
    }
    
    // Ctrl + D for dark mode toggle
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleDarkMode();
    }
});

// Initialize tooltip system
function initializeTooltips() {
    const elementsWithTitles = document.querySelectorAll('[title]');
    
    elementsWithTitles.forEach(element => {
        const title = element.getAttribute('title');
        element.removeAttribute('title');
        
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = title;
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                z-index: 10000;
                pointer-events: none;
                white-space: nowrap;
            `;
            
            document.body.appendChild(tooltip);
            
            const updateTooltipPosition = (e) => {
                tooltip.style.left = e.pageX + 10 + 'px';
                tooltip.style.top = e.pageY - 30 + 'px';
            };
            
            updateTooltipPosition(e);
            element.addEventListener('mousemove', updateTooltipPosition);
            
            element._tooltip = tooltip;
            element._updateTooltipPosition = updateTooltipPosition;
        });
        
        element.addEventListener('mouseleave', () => {
            if (element._tooltip) {
                element._tooltip.remove();
                element.removeEventListener('mousemove', element._updateTooltipPosition);
                delete element._tooltip;
                delete element._updateTooltipPosition;
            }
        });
    });
}

// Initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeTooltips();
    
    // Add loading animation end
    document.body.classList.add('loaded');
    
    console.log('🚀 Portfolio Jacques caricato con successo!');
    console.log('💡 Suggerimenti:');
    console.log('   - Alt + 1-5: Navigazione rapida');
    console.log('   - Ctrl + D: Toggle dark mode');
    console.log('   - Konami Code: Easter egg nascosto');
});