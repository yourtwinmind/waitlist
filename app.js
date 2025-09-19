// Your Twin Mind Website JavaScript

// Data storage in memory (no localStorage as per requirements)
let waitlistData = [];
let contactMessages = [];
let productNotifications = [];

// === FORMSPREE CONFIGURATION === 
const FORMSPREE_FORM_ID = 'mblaaygr'; 
const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

// Funkcja do wysyłania do Formspree
async function submitToFormspree(formData) {
    try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            return { success: true };
        } else {
            const errorData = await response.json();
            return { 
                success: false, 
                error: errorData.error || errorData.errors || 'Błąd serwera',
                status: response.status 
            };
        }
    } catch (error) {
        console.error('Błąd połączenia z Formspree:', error);
        return { 
            success: false, 
            error: 'Problem z połączeniem internetowym' 
        };
    }
}


// Safe initializer runner to prevent one failure from blocking others
function safeInit(name, fn) {
    try {
        fn();
        console.log(`[init] ${name}: OK`);
    } catch (err) {
        console.error(`[init] ${name}: FAILED`, err);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Your Twin Mind website initializing...');
    
    // Add small delay to ensure DOM is fully ready
    setTimeout(() => {
        safeInit('navigation', initializeNavigation);
        safeInit('forms', initializeForms);
        safeInit('scroll-animations', initializeScrollAnimations);
        safeInit('hero-cta', initializeHeroCta);
        safeInit('notify-buttons', initializeNotifyButtons);
        safeInit('comet-link', initializeCometLink);
        
        // Set default active tab and navigation
        safeInit('default-tab', () => setActiveTab('home'));
        
        console.log('Your Twin Mind website initialized successfully');
    }, 100);
});

// Initialize COMET product link
function initializeCometLink() {
    const cometLink = document.querySelector('a[href="https://payhip.com/b/MbAR4"]');
    if (cometLink) {
        console.log('COMET link found, ensuring proper functionality');
        
        // Ensure the link works by preventing any interference
        cometLink.addEventListener('click', function(e) {
            console.log('COMET link clicked, opening Payhip...');
            // Let the default behavior work (don't preventDefault)
            // The target="_blank" and rel="noopener noreferrer" will handle the rest
        });
        
        // Also add a backup method using window.open
        cometLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Opening COMET link via window.open...');
            window.open('https://payhip.com/b/MbAR4', '_blank', 'noopener,noreferrer');
        });
    }
}

// Navigation functionality
function initializeNavigation() {
    // const navButtons = document.querySelectorAll('.nav-btn');
    // navButtons.forEach(btn => {
    //   btn.onclick = null;
    //   btn.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     const tabName = btn.getAttribute('data-tab');
    //     go(tabName);
    //   });
    // });
  }
  
  // obsługa przycisku „wstecz”
//   window.addEventListener('popstate', (e) => {
//     const tab = e.state?.tab || pathToTab(location.pathname);
//     setActiveTab(tab);
//   });
  
  // inicjalizacja – ustaw widok zgodny z aktualną ścieżką
//   document.addEventListener('DOMContentLoaded', () => {
//     setTimeout(() => {
//       const initialTab = pathToTab(location.pathname);
//       go(initialTab, true);
//     }, 100);
//   });

function setActiveTab(tabName) {
    console.log('Setting active tab to:', tabName);
    
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log('Found nav buttons:', navButtons.length);
    console.log('Found tab contents:', tabContents.length);
    
    // Update navigation buttons
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
            console.log('Activated nav button for:', tabName);
        }
    });
    
    // Update tab content
    tabContents.forEach(tab => {
        tab.classList.remove('active');
        tab.style.display = 'none';
    });
    
    const activeTab = document.getElementById(`${tabName}-tab`);
    if (activeTab) {
        activeTab.classList.add('active');
        activeTab.style.display = 'block';
        activeTab.style.opacity = '1';
        console.log('Tab activated:', tabName);
        
        // Scroll to top when switching tabs
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Trigger animations
        setTimeout(() => {
            triggerFadeInAnimations(activeTab);
        }, 150);
        
        // Re-initialize COMET link when products tab is activated
        if (tabName === 'products') {
            setTimeout(() => {
                safeInit('comet-link', initializeCometLink);
            }, 200);
        }
    } else {
        console.error('Tab not found:', `${tabName}-tab`);
    }
}
function pathToTab(pathname) {
    const seg = pathname.replace(/\/+$/, '').split('/')[1] || 'home';
    return ['home','products','about'].includes(seg) ? seg : 'home';
  }
// --- HASH ROUTING ---
// function tabFromHash() {
//     const m = location.hash.match(/^#\/?([^/]+)/);
//     const t = (m && m[1]) || 'home';
//     return ['home','products','about'].includes(t) ? t : 'home';
//   }
  
//   window.addEventListener('hashchange', () => {
//     setActiveTab(tabFromHash());
//   });
  
//   // Przy starcie – ustaw hash i aktywną zakładkę
//   if (!location.hash) location.hash = '#/home';
//   setActiveTab(tabFromHash());
// Hero CTA functionality
function go(tab) {
    const map = {
      home: '/index.html',
      products: '/products.html',
      about: '/about.html',
    };
    window.location.href = map[tab] || '/index.html';
  }
//   document.addEventListener('DOMContentLoaded', () => {
//     const path = location.pathname.toLowerCase(); // np. /products.html
//     document.querySelectorAll('.navigation .nav-link').forEach(a => {
//       const href = (a.getAttribute('href') || '').toLowerCase();
//       // dopasuj /, /index.html, /products.html, /about.html
//       const isHome = (path === '/' || path.endsWith('/index.html')) && href.endsWith('/index.html');
//       const isSame = path.endsWith(href.replace(/^\//,''));
//       a.classList.toggle('active', isHome || isSame);
//     });
//   });
function initializeHeroCta() {
    const heroCta = document.getElementById('hero-cta');
    console.log('Hero CTA element:', heroCta); // DEBUG
    
    if (heroCta) {
        heroCta.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Hero CTA clicked - scrolling to waitlist'); // DEBUG
            
            const waitlistSection = document.getElementById('waitlist-section');
            console.log('Waitlist section found:', waitlistSection); // DEBUG
            
            if (waitlistSection) {
                waitlistSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            } else {
                console.error('Waitlist section not found!');
            }
        });
        console.log('Hero CTA initialized successfully');
    } else {
        console.error('Hero CTA button not found!');
    }
}


// Form initialization
function initializeForms() {
    console.log('Initializing forms...');
    
    const waitlistForm = document.getElementById('waitlist-form');
    const contactForm = document.getElementById('contact-form');
    
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', handleWaitlistSubmission);
        console.log('Waitlist form initialized');
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
        console.log('Contact form initialized');
    }
    
    // Ensure all form inputs are properly configured
    const allInputs = document.querySelectorAll('input, select, textarea');
    console.log('Found form inputs:', allInputs.length);
    
    allInputs.forEach((input, index) => {
        console.log(`Configuring input ${index}:`, input.type || input.tagName);
        
        // Reset any problematic styles
        input.style.pointerEvents = 'auto';
        input.style.userSelect = 'text';
        input.style.cursor = input.tagName.toLowerCase() === 'select' ? 'pointer' : 'text';
        input.disabled = false;
        input.readOnly = false;
        
        // Remove any loading states
        input.classList.remove('loading');
        
        // Add focus event handlers
        input.addEventListener('focus', function() {
            console.log('Input focused:', this.name || this.id);
            this.style.borderColor = '#21808d';
            this.style.outline = '2px solid #21808d';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = '';
            this.style.outline = '';
        });
        
        input.addEventListener('input', function() {
            console.log('Input changed:', this.name || this.id, this.value);
        });
    });
}


// Handle waitlist form submission
async function handleWaitlistSubmission(event) {
    event.preventDefault();
    console.log('Waitlist form submitted');
    
    // Pobierz dane z formularza - POPRAWNE NAZWY PÓL
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('waitlist-email');        // POPRAWKA
    const name = formData.get('waitlist-name');          // POPRAWKA  
    const product = formData.get('waitlist-product');    // POPRAWKA
    
    console.log('Form data:', { name, email, product }); // DEBUG
    
    // Podstawowa walidacja
    if (!name || name.trim() === '') {
        showMessage(form, 'Podaj swoje imię', 'error');
        return;
    }
    
    if (!email || !email.includes('@')) {
        showMessage(form, 'Podaj prawidłowy adres e-mail', 'error');
        return;
    }
    
    // Pokaż loading
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Wysyłanie...';
    submitButton.disabled = true;
    
    // Przygotuj dane dla Formspree
    const waitlistData = {
        email: email,
        name: name,
        product: product || 'Ogólne zainteresowanie',
        source: 'Your Twin Mind Waitlist',
        timestamp: new Date().toISOString(),
        language: 'pl',
        subject: 'Nowy zapis na waitlistę - Your Twin Mind'
    };
    
    try {
        // Wyślij do Formspree
        const result = await submitToFormspree(waitlistData);
        
        if (result.success) {
            // Sukces - pokaż komunikat w HTML
            const successMessage = document.getElementById('waitlist-success');
            if (successMessage) {
                successMessage.classList.remove('hidden');
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Auto-hide po 8 sekundach
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                }, 8000);
            }
            
            form.reset();
            console.log('Waitlist submission successful');
            
            // Google Analytics (jeśli masz)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'waitlist_signup', {
                    event_category: 'engagement',
                    event_label: 'your_twin_mind'
                });
            }
        } else {
            // Błąd
            console.error('Formspree error:', result.error);
            showMessage(form, 'Wystąpił błąd podczas zapisywania. Spróbuj ponownie za chwilę.', 'error');
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        showMessage(form, 'Wystąpił nieoczekiwany błąd. Sprawdź połączenie internetowe.', 'error');
    } finally {
        // Przywróć przycisk
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}


function showMessage(formEl, message, type = 'info') {
    // Usuń poprzednie wiadomości
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Stwórz nową wiadomość
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message--${type}`;
    messageDiv.style.cssText = `
        padding: 15px;
        margin: 15px 0;
        border-radius: 8px;
        font-weight: 500;
        text-align: center;
        ${type === 'success' 
            ? 'background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3);' 
            : 'background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3);'
        }
    `;
    messageDiv.textContent = message;
    
    // Wstaw wiadomość do aktywnego formularza
    const activeForm = (formEl && formEl.closest ? formEl.closest('form') : formEl) || document.getElementById('waitlist-form') || document.getElementById('contact-form');
    
    if (activeForm) {
        activeForm.appendChild(messageDiv);
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide po 5 sekundach dla sukcesu
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }
}

// Handle contact form submission
async function handleContactSubmit(event) {
    event.preventDefault();
    console.log('Contact form submitted');
    
    const form = event.target;
    const formData = new FormData(form);
    const name = formData.get('contact-name');
    const email = formData.get('contact-email'); 
    const subject = formData.get('contact-subject');
    const message = formData.get('contact-message');
    
    console.log('Contact data:', { name, email, subject, message });
    
    // Walidacja
    if (!name || !email || !subject || !message) {
        showMessage(form, 'Proszę wypełnić wszystkie pola.', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showMessage(form, 'Proszę podać prawidłowy adres e-mail.', 'error');
        return;
    }
    
    // Pokaż loading
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Wysyłanie...';
    submitButton.disabled = true;
    
    // Przygotuj dane dla Formspree
    const contactData = {
        name: name,
        email: email,
        subject: subject,
        message: message,
        _replyto: email,
        _to: 'yourtwinmind@gmail.com',  // TWÓJ EMAIL
        source: 'Your Twin Mind Contact Form',
        timestamp: new Date().toISOString(),
        language: 'pl'
    };
    
    try {
        // Wyślij do Formspree
        const result = await submitToFormspree(contactData);
        
        if (result.success) {
            // Sukces
            showMessage(form, 'Dziękujemy! Wiadomość została wysłana. Odpowiemy wkrótce.', 'success');
            form.reset();
            console.log('Contact form sent successfully');
        } else {
            // Błąd
            console.error('Contact form error:', result.error);
            showMessage(form, 'Wystąpił błąd podczas wysyłania. Spróbuj ponownie za chwilę.', 'error');
        }
    } catch (error) {
        console.error('Contact form unexpected error:', error);
        showMessage(form, 'Wystąpił nieoczekiwany błąd. Sprawdź połączenie internetowe.', 'error');
    } finally {
        // Przywróć przycisk
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}


// Initialize notify buttons
function initializeNotifyButtons() {
    console.log('Initializing notify buttons...');
    
    // Use both immediate and delayed initialization
    setupNotifyButtons();
    
    setTimeout(() => {
        setupNotifyButtons();
    }, 500);
}

function setupNotifyButtons() {
    const notifyButtons = document.querySelectorAll('.notify-btn');
    console.log('Found notify buttons:', notifyButtons.length);
    
    notifyButtons.forEach((button, index) => {
        console.log(`Setting up notify button ${index + 1}:`, button.getAttribute('data-product'));
        
        // Remove existing listeners
        button.onclick = null;
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productName = this.getAttribute('data-product');
            console.log('Notify button clicked for:', productName);
            handleProductNotification(productName, this);
        });
        
        // Backup onclick handler
        button.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productName = this.getAttribute('data-product');
            console.log('Notify button onclick for:', productName);
            handleProductNotification(productName, this);
        };
    });
}

// Handle product notification
function handleProductNotification(productName, button) {
    console.log('Handling product notification for:', productName);
    
    // Check if already notified
    const existingNotification = productNotifications.find(
        notification => notification.product === productName
    );
    
    if (existingNotification) {
        showProductNotification('Jesteś już zapisany na powiadomienia dla tego produktu!', 'info');
        return;
    }
    
    // Save notification request
    const notificationEntry = {
        id: Date.now(),
        product: productName,
        timestamp: new Date().toISOString()
    };
    
    productNotifications.push(notificationEntry);
    
    // Update button text temporarily
    const originalText = button.textContent;
    button.textContent = 'Zapisano!';
    button.disabled = true;
    button.style.backgroundColor = '#21808d';
    button.style.color = '#f8fafd';
    button.style.borderColor = '#21808d';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.style.backgroundColor = '';
        button.style.color = '';
        button.style.borderColor = '';
    }, 3000);
    
    // Show success message
    showProductNotification('Otrzymasz powiadomienie gdy produkt będzie dostępny!', 'success');
    
    console.log('Product notification added:', notificationEntry);
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show success message
function showSuccessMessage(elementId) {
    const successElement = document.getElementById(elementId);
    if (successElement) {
        successElement.classList.remove('hidden');
        successElement.style.display = 'block';
        successElement.style.opacity = '0';
        successElement.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            successElement.style.transition = 'all 0.3s ease';
            successElement.style.opacity = '1';
            successElement.style.transform = 'translateY(0)';
        }, 50);
        
        // Hide after 5 seconds
        setTimeout(() => {
            successElement.style.opacity = '0';
            successElement.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                successElement.classList.add('hidden');
                successElement.style.display = 'none';
            }, 300);
        }, 5000);
    }
}

// Show product notification
function showProductNotification(message, type) {
    const notificationElement = document.getElementById('product-notification');
    if (notificationElement) {
        const statusElement = notificationElement.querySelector('.status');
        
        statusElement.textContent = message;
        statusElement.className = `status status--${type}`;
        
        notificationElement.classList.remove('hidden');
        notificationElement.style.display = 'block';
        notificationElement.style.opacity = '0';
        notificationElement.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            notificationElement.style.transition = 'all 0.3s ease';
            notificationElement.style.opacity = '1';
            notificationElement.style.transform = 'translateY(0)';
        }, 50);
        
        setTimeout(() => {
            notificationElement.style.opacity = '0';
            notificationElement.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                notificationElement.classList.add('hidden');
                notificationElement.style.display = 'none';
            }, 300);
        }, 4000);
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `<div class="status status--error" style="padding: 12px 16px; border-radius: 8px; background: rgba(255, 84, 89, 0.15); color: #ff5459; border: 1px solid rgba(255, 84, 89, 0.25);">${message}</div>`;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.opacity = '1';
        errorDiv.style.transform = 'translateX(0)';
    }, 50);
    
    setTimeout(() => {
        errorDiv.style.opacity = '0';
        errorDiv.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                document.body.removeChild(errorDiv);
            }
        }, 300);
    }, 4000);
}

// Scroll animations
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.product-card, .waitlist-form, .contact-form, .company-info');
    
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Trigger fade-in animations
function triggerFadeInAnimations(container) {
    const animatedElements = container.querySelectorAll('.fade-in');
    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('visible');
        }, index * 100);
    });
}

// Handle escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const visibleMessages = document.querySelectorAll('.success-message:not(.hidden), .notification-message:not(.hidden)');
        visibleMessages.forEach(message => {
            message.style.opacity = '0';
            setTimeout(() => {
                message.classList.add('hidden');
                message.style.display = 'none';
            }, 300);
        });
    }
});

// Global click handler to ensure buttons work - but exclude COMET link
document.addEventListener('click', function(e) {
    console.log('Global click on:', e.target.tagName, e.target.className);
    
    // Don't interfere with external links
    if (e.target.tagName.toLowerCase() === 'a' && e.target.href.includes('payhip.com')) {
        console.log('COMET link clicked, allowing default behavior');
        return; // Let the link work normally
    }
    
    // Handle navigation buttons
    if (e.target.classList.contains('nav-btn')) {
        e.preventDefault();
        const tabName = e.target.getAttribute('data-tab');
        console.log('Global nav click:', tabName);
        setActiveTab(tabName);
    }
    
    // Handle notify buttons
    if (e.target.classList.contains('notify-btn')) {
        e.preventDefault();
        const productName = e.target.getAttribute('data-product');
        console.log('Global notify click:', productName);
        handleProductNotification(productName, e.target);
    }
});

// Debug functions
window.YourTwinMindDebug = {
    getWaitlistData: () => waitlistData,
    getContactMessages: () => contactMessages,
    getProductNotifications: () => productNotifications,
    clearData: () => {
        waitlistData = [];
        contactMessages = [];
        productNotifications = [];
        console.log('All data cleared');
    },
    switchTab: (tabName) => setActiveTab(tabName),
    testNavigation: () => {
        console.log('Testing navigation...');
        setActiveTab('products');
        setTimeout(() => setActiveTab('about'), 2000);
        setTimeout(() => setActiveTab('home'), 4000);
    },
    testCometLink: () => {
        console.log('Testing COMET link...');
        const cometLink = document.querySelector('a[href="https://payhip.com/b/MbAR4"]');
        if (cometLink) {
            cometLink.click();
        } else {
            console.error('COMET link not found');
        }
    }
};

console.log('Debug functions available: YourTwinMindDebug');

// Global click handler for hero CTA as a safety net (in addition to initializeHeroCta)
document.addEventListener('click', function(e) {
    const t = e.target;
    if (t && t.id === 'hero-cta') {
        // don't prevent default if it's a button, but avoid double scroll
        const waitlistSection = document.getElementById('waitlist-section');
        if (waitlistSection) {
            waitlistSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});
