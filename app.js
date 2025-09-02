// Waitlist Application JavaScript for Your Twin Mind
// Zoptymalizowana obsługa formularza + statusów (bez zmian w HTML)

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ---
    const form = document.getElementById('waitlistForm');
    const emailInput = document.getElementById('email');
    const consentCheckbox = document.getElementById('consent');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    const loadingSpinner = document.getElementById('loadingSpinner');
  
    const emailError = document.getElementById('email-error');
    const consentError = document.getElementById('consent-error');
  
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
  
    const privacyModal = document.getElementById('privacyModal');
    const privacyPolicyBtn = document.getElementById('privacyPolicyBtn');
    const closeModal = document.getElementById('closeModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalBackdrop = document.getElementById('modalBackdrop');
  
    // --- Teksty w jednym miejscu ---
    const MESSAGES = {
      success: 'Artur... masakra z Tobą :-) umiesz mnie zmotywować!',
      errorGeneric: 'Wystąpił błąd. Spróbuj ponownie.',
      errorValidationAll: 'Wypełnij wszystkie wymagane pola poprawnie',
      errorEmailInvalid: 'Podaj prawidłowy adres e-mail',
      errorConsentMissing: 'Musisz wyrazić zgodę na przetwarzanie danych',
      errorNetwork: 'Wystąpił nieoczekiwany błąd. Sprawdź połączenie internetowe i spróbuj ponownie.',
      submitting: 'Wysyłanie...',
      submitIdle: 'Dołącz do waitlisty',
    };
  
    // --- Ustaw a11y/liveregion bez zmiany HTML ---
    if (successMessage) {
      successMessage.setAttribute('role', 'status');
      successMessage.setAttribute('aria-live', 'polite');
    }
    if (errorMessage) {
      errorMessage.setAttribute('role', 'alert');
      errorMessage.setAttribute('aria-live', 'assertive');
    }
  
    // --- Pomocnicze ---
    let __successHideTimeout = null;

    function hideStatusMessages() {
      if (successMessage) {
        successMessage.classList.add('hidden');
        successMessage.style.display = 'none';
      }
      if (errorMessage) {
        errorMessage.classList.add('hidden');
        errorMessage.style.display = 'none';
      }
      if (__successHideTimeout) {
        clearTimeout(__successHideTimeout);
        __successHideTimeout = null;
      }
    }
    
    function showSuccessMessage(text = MESSAGES.success) {
      // schowaj error zanim pokażesz success
      if (errorMessage) {
        errorMessage.classList.add('hidden');
        errorMessage.style.display = 'none';
      }
      if (successMessage) {
        setText(successMessage, text);
        successMessage.classList.remove('hidden');
        successMessage.style.display = 'flex';   // <- pokaż na pewno
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
        if (__successHideTimeout) clearTimeout(__successHideTimeout);
        __successHideTimeout = setTimeout(() => {
          successMessage.classList.add('hidden');
          successMessage.style.display = 'none';
          __successHideTimeout = null;
        }, 8000);
      }
    }
    
    function showErrorMessage(text = MESSAGES.errorGeneric) {
      // schowaj success zanim pokażesz error
      if (successMessage) {
        successMessage.classList.add('hidden');
        successMessage.style.display = 'none';
      }
      if (errorMessage) {
        setText(errorMessage, text);
        errorMessage.classList.remove('hidden');
        errorMessage.style.display = 'flex';     // <- pokaż na pewno
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  
    const showFieldError = (el, text) => {
      if (!el) return;
      el.textContent = text;
      el.style.display = 'block';
    };
  
    const clearFieldError = (el) => {
      if (!el) return;
      el.textContent = '';
      el.style.display = 'none';
    };
  
    const clearAllErrors = () => {
      clearFieldError(emailError);
      clearFieldError(consentError);
    };
  
    // --- Walidacja (jak u Ciebie, lekko uporządkowana) ---
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length > 5 && email.length < 255; // :contentReference[oaicite:2]{index=2}
  
    const validateEmail = () => {
      const email = (emailInput?.value || '').trim();
      if (!email) {
        showFieldError(emailError, 'Adres e-mail jest wymagany');
        return false;
      }
      if (!isValidEmail(email)) {
        showFieldError(emailError, MESSAGES.errorEmailInvalid);
        return false;
      }
      clearFieldError(emailError);
      return true;
    };
  
    const validateConsent = () => {
      if (!consentCheckbox?.checked) {
        showFieldError(consentError, MESSAGES.errorConsentMissing);
        return false;
      }
      clearFieldError(consentError);
      return true;
    };
  
    // --- Wysyłka (Formspree) ---
    async function sendToEndpoint(email) {
      // To jest ten sam endpoint, którego używasz (Formspree). Zostawiłam jak było. :contentReference[oaicite:3]{index=3}
      const url = 'https://formspree.io/f/mblaaygr'; // jeśli zmienisz – zadziała dalej tak samo
  
      const payload = {
        email,
        zgoda_rodo: 'Tak',
        data_zapisu: new Date().toISOString(),
        źródło: 'Your Twin Mind Landing page waitlist',
        company: 'Your Twin Mind',
        język: 'polski',
        font_support: document.body.classList.contains('horizon-loaded') ? 'HORIZON' : 'Fallback',
      };
  
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      // traktuj **wyłącznie** 2xx jako sukces
      if (!res.ok) {
        // zbierz więcej info o błędzie
        let detail = '';
        try {
          detail = await res.text();
        } catch {}
        const err = new Error(`Formspree error ${res.status}${detail ? `: ${detail}` : ''}`);
        err.status = res.status;
        throw err;
      }
    }
  
    // --- Submit handler (spójny przepływ sukces/błąd) ---
    async function handleFormSubmission(e) {
      e.preventDefault();
      if (!form) return;
  
      hideStatusMessages();
      clearAllErrors();
  
      const emailOk = validateEmail();
      const consentOk = validateConsent();
  
      if (!emailOk || !consentOk) {
        if (!emailOk && !consentOk) showErrorMessage(MESSAGES.errorValidationAll);
        else if (!emailOk) showErrorMessage(MESSAGES.errorEmailInvalid);
        else showErrorMessage(MESSAGES.errorConsentMissing);
        return;
      }
  
      // blokada podwójnego wysłania i spinner
      setLoadingState(true);
  
      try {
        const email = emailInput.value.trim();
        await sendToEndpoint(email); // jeśli nie rzuci błędu → SUKCES
  
        // SUKCES
        showSuccessMessage(MESSAGES.success); // „Dziękujemy! Zostałeś/aś dodany/a …”
        form.reset();
        clearAllErrors();
  
        // Analytics (zostawione jak miałeś, tylko bardziej bezpiecznie) :contentReference[oaicite:4]{index=4}
        if (typeof gtag === 'function') {
          gtag('event', 'waitlist_signup', {
            event_category: 'engagement',
            event_label: 'your_twin_mind_waitlist_pl',
            custom_parameters: {
              company: 'Your Twin Mind',
              language: 'pl',
              font_loaded: document.body.classList.contains('horizon-loaded') ? 'horizon' : 'fallback',
              has_polish_chars: /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(email),
            },
          });
        }
        if (typeof fbq === 'function') {
          fbq('track', 'Lead', {
            content_name: 'Your Twin Mind Waitlist PL',
            content_category: 'AI Products',
            content_subcategory: 'Polish Market',
          });
        }
      } catch (err) {
        console.error('Błąd zapisu:', err);
        // BŁĄD – pokaż ogólny komunikat (możesz podmienić na bardziej szczegółowy)
        const text =
          err && typeof err.status === 'number'
            ? `${MESSAGES.errorGeneric} (kod: ${err.status})`
            : MESSAGES.errorNetwork;
        showErrorMessage(text);
      } finally {
        setLoadingState(false);
      }
    }
  
    // --- Zdarzenia ---
    if (form) form.addEventListener('submit', handleFormSubmission);
  
    if (emailInput) {
      emailInput.addEventListener('blur', validateEmail);
      emailInput.addEventListener('input', () => {
        if (emailError?.textContent) validateEmail();
      });
      // Enter w polu e-mail uruchamia submit z walidacją
      emailInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          form.requestSubmit();
        }
      });
    }
  
    if (consentCheckbox) {
      consentCheckbox.addEventListener('change', () => {
        if (consentError?.textContent) validateConsent();
      });
    }
  
    // --- Modal Polityki Prywatności (bez zmian w HTML) ---
    const openModal = () => {
      if (!privacyModal) return;
      privacyModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeModal?.focus(), 100);
      closeModal?.setAttribute('aria-label', 'Zamknij okno polityki prywatności');
    };
  
    const closeModalHandler = () => {
      if (!privacyModal) return;
      privacyModal.classList.add('hidden');
      document.body.style.overflow = '';
      setTimeout(() => privacyPolicyBtn?.focus(), 100);
    };
  
    if (privacyPolicyBtn) {
      privacyPolicyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal();
      });
      privacyPolicyBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          openModal();
        }
      });
      privacyPolicyBtn.addEventListener('focus', function () {
        this.style.outline = '2px solid var(--color-primary)';
        this.style.outlineOffset = '2px';
      });
      privacyPolicyBtn.addEventListener('blur', function () {
        this.style.outline = '';
        this.style.outlineOffset = '';
      });
    }
  
    closeModal?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeModalHandler();
    });
    closeModalBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeModalHandler();
    });
    modalBackdrop?.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModalHandler();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && privacyModal && !privacyModal.classList.contains('hidden')) {
        closeModalHandler();
      }
    });
  
    // --- (opcjonalnie) oznacz font HORIZON jak w Twojej wersji ---
    (function checkHorizonFontLoading() {
      const testEl = document.createElement('span');
      testEl.style.fontFamily = 'Horizon, Arial Black, sans-serif';
      testEl.style.fontSize = '1px';
      testEl.style.opacity = '0';
      testEl.style.position = 'absolute';
      testEl.style.top = '-9999px';
      testEl.textContent = 'ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ';
      document.body.appendChild(testEl);
      setTimeout(() => {
        const family = window.getComputedStyle(testEl).fontFamily || '';
        if (family.includes('Horizon')) document.body.classList.add('horizon-loaded');
        else document.body.classList.add('horizon-fallback');
        testEl.remove();
      }, 2000);
    })();
  });
  