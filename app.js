// Your Twin Mind Website JavaScript — FIXED (NO-SPA)
// Zmiany: usunięto SPA-routing (popstate, startowe go()), nawigacja działa przez zwykłe <a>
// Formularze, animacje, CTA, notify-buttons — pozostają bez zmian.
// Jeśli chcesz ładne slugi (/produkty), zrób to regułami serwera (.htaccess/Nginx).

// ========================================
// In-memory data (no localStorage)
// ========================================
let waitlistData = [];
let contactMessages = [];
let productNotifications = [];

// ========================================
// Formspree config
// ========================================
const FORMSPREE_FORM_ID = 'mblaaygr';
const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

// ========================================
// Helpers
// ========================================
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

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
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        error: errorData.error || errorData.errors || 'Błąd serwera',
        status: response.status 
      };
    }
  } catch (error) {
    console.error('Błąd połączenia z Formspree:', error);
    return { success: false, error: 'Problem z połączeniem internetowym' };
  }
}

function safeInit(name, fn) {
  try { fn(); console.log(`[init] ${name}: OK`); }
  catch (err) { console.error(`[init] ${name}: FAILED`, err); }
}

// ========================================
// App init (NO-SPA) — bez setActiveTab('home'), bez go(initialTab)
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('Your Twin Mind website initializing (NO-SPA)...');

  setTimeout(() => {
    safeInit('navigation', initializeNavigation);        // tylko dla .nav-btn (jeśli są)
    safeInit('forms', initializeForms);
    safeInit('scroll-animations', initializeScrollAnimations);
    safeInit('hero-cta', initializeHeroCta);
    safeInit('notify-buttons', initializeNotifyButtons);
    safeInit('comet-link', initializeCometLink);
    console.log('Your Twin Mind website initialized successfully (NO-SPA).');
  }, 50);
});

// ========================================
// Navigation (buttons optional) — brak SPA
// ========================================
function initializeNavigation() {
  // Jeśli używasz <a href="/products.html"> to tu nic nie trzeba.
  // Ten kod obsłuży stare przyciski .nav-btn (jeśli jeszcze są w HTML).
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    btn.onclick = null;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = btn.getAttribute('data-tab');
      go(tabName); // zwykła nawigacja na pliki .html (mapa niżej)
    });
  });
}

// Uproszczony "go" — bez pushState; przekierowanie na pliki .html
function go(tab) {
  const map = {
    home: './index.html',
    products: './products.html', // Jeśli chcesz /produkty → ustaw regułę na serwerze
    about: './about.html',
  };
  window.location.href = map[tab] || './index.html';
}

// UWAGA: usuwamy SPA-routing, bo powodował pętle / przeładowania.
// ----- USUNIĘTE -----
// window.addEventListener('popstate', ...);
// document.addEventListener('DOMContentLoaded', () => { go(initialTab, true) });
// setActiveTab('home') na starcie
// --------------------

// ========================================
// (Opcjonalne) funkcje tabów — zostawione dla kompatybilności debug/test
// ========================================
function setActiveTab(tabName) {
  // Bez SPA nie jest to potrzebne, ale niech pozostanie no-op jeśli brak elementów
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // Update nav buttons (jeśli są)
  navButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
  });

  // Update tab content (jeśli są)
  if (tabContents.length) {
    tabContents.forEach(tab => { tab.classList.remove('active'); tab.style.display = 'none'; });
    const activeTab = document.getElementById(`${tabName}-tab`);
    if (activeTab) {
      activeTab.classList.add('active');
      activeTab.style.display = 'block';
      activeTab.style.opacity = '1';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => triggerFadeInAnimations(activeTab), 150);
    }
  }
}

function pathToTab(pathname) {
  const seg = pathname.replace(/\/+$/, '').split('/')[1] || 'home';
  return ['home','products','about'].includes(seg) ? seg : 'home';
}

// ========================================
// COMET link — nie blokujemy domyślnego zachowania
// ========================================
function initializeCometLink() {
  const cometLink = document.querySelector('a[href="https://payhip.com/b/MbAR4"]');
  if (cometLink) {
    cometLink.addEventListener('click', function() {
      console.log('COMET link clicked (Payhip).');
      // Nie robimy preventDefault — link działa normalnie (najlepiej z target="_blank" w HTML)
    });
  }
}

// ========================================
// Hero CTA — scroll do sekcji waitlist (obsługa #waitlist-section lub #waitlist)
// ========================================
function initializeHeroCta() {
  const heroCta = document.getElementById('hero-cta');
  if (!heroCta) return;
  heroCta.addEventListener('click', function(e) {
    e.preventDefault();
    const waitlistSection = document.getElementById('waitlist-section') || document.getElementById('waitlist');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.error('Waitlist section not found!');
    }
  });
}

// ========================================
// Forms
// ========================================
function initializeForms() {
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

  document.querySelectorAll('input, select, textarea').forEach(input => {
    input.style.pointerEvents = 'auto';
    input.style.userSelect = 'text';
    input.style.cursor = input.tagName.toLowerCase() === 'select' ? 'pointer' : 'text';
    input.disabled = false;
    input.readOnly = false;
    input.classList.remove('loading');
    input.addEventListener('focus', function() {
      this.style.borderColor = '#21808d';
      this.style.outline = '2px solid #21808d';
    });
    input.addEventListener('blur', function() {
      this.style.borderColor = '';
      this.style.outline = '';
    });
  });
}

async function handleWaitlistSubmission(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const email = formData.get('waitlist-email');
  const name = formData.get('waitlist-name');
  const product = formData.get('waitlist-product') || 'Ogólne zainteresowanie';

  if (!name || name.trim() === '') return showMessage(form, 'Podaj swoje imię', 'error');
  if (!email || !validateEmail(email)) return showMessage(form, 'Podaj prawidłowy adres e-mail', 'error');

  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Wysyłanie...';
  submitButton.disabled = true;

  const payload = {
    email, name, product,
    source: 'Your Twin Mind Waitlist',
    timestamp: new Date().toISOString(),
    language: 'pl',
    subject: 'Nowy zapis na waitlistę - Your Twin Mind'
  };

  const result = await submitToFormspree(payload);
  if (result.success) {
    const successMessage = document.getElementById('waitlist-success');
    if (successMessage) {
      successMessage.classList.remove('hidden');
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => successMessage.classList.add('hidden'), 8000);
    }
    form.reset();
  } else {
    console.error('Formspree error:', result.error);
    showMessage(form, 'Wystąpił błąd podczas zapisywania. Spróbuj ponownie za chwilę.', 'error');
  }

  submitButton.textContent = originalText;
  submitButton.disabled = false;
}

async function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const fd = new FormData(form);
  const name = fd.get('contact-name');
  const email = fd.get('contact-email'); 
  const subject = fd.get('contact-subject');
  const message = fd.get('contact-message');

  // Clear previous errors
  clearFieldErrors();
  
  // Validate each field separately
  let hasErrors = false;
  
  if (!name || name.trim() === '') {
    showFieldError('name-error');
    hasErrors = true;
  }
  
  if (!email || email.trim() === '') {
    showFieldError('email-error');
    hasErrors = true;
  } else if (!validateEmail(email)) {
    showFieldError('email-error');
    hasErrors = true;
  }
  
  if (!subject || subject.trim() === '') {
    showFieldError('subject-error');
    hasErrors = true;
  }
  
  if (!message || message.trim() === '') {
    showFieldError('message-error');
    hasErrors = true;
  }
  
  if (hasErrors) {
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Wysyłanie...';
  submitButton.disabled = true;

  const payload = {
    name, email, subject, message,
    _replyto: email,
    _to: 'yourtwinmind@gmail.com',  // docelowy email odbiorczy
    source: 'Your Twin Mind Contact Form',
    timestamp: new Date().toISOString(),
    language: 'pl'
  };

  const result = await submitToFormspree(payload);
  if (result.success) {
    const successMessage = document.getElementById('contact-success');
    if (successMessage) {
      successMessage.classList.remove('hidden');
      successMessage.style.display = 'block';
      setTimeout(() => successMessage.classList.add('hidden'), 8000);
    }
    form.reset();
  } else {
    console.error('Contact form error:', result.error);
    showMessage(form, 'Wystąpił błąd podczas wysyłania. Spróbuj ponownie za chwilę.', 'error');
  }

  submitButton.textContent = originalText;
  submitButton.disabled = false;
}

// Helper functions for field-level validation
function showFieldError(errorId) {
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.classList.remove('hidden');
    errorElement.style.display = 'block';
  }
}

function clearFieldErrors() {
  const errorElements = document.querySelectorAll('.field-error');
  errorElements.forEach(el => {
    el.classList.add('hidden');
    el.style.display = 'none';
  });
}

// ========================================
// Messages & notifications
// ========================================
function showMessage(formEl, message, type = 'info') {
  document.querySelectorAll('.form-message').forEach(msg => msg.remove());

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

  const activeForm = (formEl && formEl.closest ? formEl.closest('form') : formEl) || document.getElementById('waitlist-form') || document.getElementById('contact-form');
  if (activeForm) {
    activeForm.appendChild(messageDiv);
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (type === 'success') setTimeout(() => { if (messageDiv.parentNode) messageDiv.remove(); }, 5000);
  }
}

function initializeNotifyButtons() {
  setupNotifyButtons();
  setTimeout(setupNotifyButtons, 500);
}

function setupNotifyButtons() {
  const notifyButtons = document.querySelectorAll('.notify-btn');
  notifyButtons.forEach((button) => {
    button.onclick = null;
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const productName = this.getAttribute('data-product') || 'Produkt';
      handleProductNotification(productName, this);
    });
  });
}

function handleProductNotification(productName, button) {
  const existing = productNotifications.find(n => n.product === productName);
  if (existing) return showProductNotification('Jesteś już zapisany na powiadomienia dla tego produktu!', 'info');

  const entry = { id: Date.now(), product: productName, timestamp: new Date().toISOString() };
  productNotifications.push(entry);

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

  showProductNotification('Otrzymasz powiadomienie gdy produkt będzie dostępny!', 'success');
}

function showProductNotification(message, type) {
  const notificationElement = document.getElementById('product-notification');
  if (!notificationElement) return;
  const statusElement = notificationElement.querySelector('.status');
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.className = `status status--${type}`;
  }
  notificationElement.classList.remove('hidden');
  notificationElement.style.display = 'block';
  notificationElement.style.opacity = '1';
  setTimeout(() => {
    notificationElement.style.opacity = '0';
    setTimeout(() => {
      notificationElement.classList.add('hidden');
      notificationElement.style.display = 'none';
      notificationElement.style.opacity = '';
    }, 300);
  }, 4000);
}

// ========================================
// Animations
// ========================================
function initializeScrollAnimations() {
  const animatedElements = document.querySelectorAll('.product-card, .waitlist-form, .contact-form, .company-info');
  animatedElements.forEach(element => element.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  animatedElements.forEach(element => observer.observe(element));
}

function triggerFadeInAnimations(container) {
  const animatedElements = container.querySelectorAll('.fade-in');
  animatedElements.forEach((element, index) => {
    setTimeout(() => element.classList.add('visible'), index * 100);
  });
}

// ========================================
// Esc to hide visible messages
// ========================================
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

// ========================================
// Global click handler (safe)
// ========================================
document.addEventListener('click', function(e) {
  const t = e.target;
  console.log('Global click on:', t.tagName, t.className);

  // Nie blokujemy linku do Payhip
  if (t.tagName && t.tagName.toLowerCase() === 'a' && t.href && t.href.includes('payhip.com')) {
    return; // pozwól przeglądarce obsłużyć link
  }

  // Jeżeli ktoś kliknie .nav-btn — przejdź na plik .html
  if (t.classList && t.classList.contains('nav-btn')) {
    e.preventDefault();
    const tabName = t.getAttribute('data-tab');
    if (tabName) go(tabName);
  }

  // Notify
  if (t.classList && t.classList.contains('notify-btn')) {
    e.preventDefault();
    const productName = t.getAttribute('data-product');
    handleProductNotification(productName, t);
  }
});

// ========================================
// Debug (ograniczone)
// ========================================
window.YourTwinMindDebug = {
  getWaitlistData: () => waitlistData,
  getContactMessages: () => contactMessages,
  getProductNotifications: () => productNotifications,
  clearData: () => { waitlistData = []; contactMessages = []; productNotifications = []; console.log('All data cleared'); },
  switchTab: (tabName) => setActiveTab(tabName) // pozostałość do testów, nie wpływa na nawigację
};

console.log('Debug functions available: YourTwinMindDebug (NO-SPA).');