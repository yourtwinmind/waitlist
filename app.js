// Waitlist Application JavaScript for Your Twin Mind
// Obsługuje formularz waitlisty z pełnym wsparciem polskich znaków

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('waitlistForm');
    const emailInput = document.getElementById('email');
    const consentCheckbox = document.getElementById('consent');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Error message elements
    const emailError = document.getElementById('email-error');
    const consentError = document.getElementById('consent-error');
    
    // Status message elements
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // Modal elements
    const privacyModal = document.getElementById('privacyModal');
    const privacyPolicyBtn = document.getElementById('privacyPolicyBtn');
    const closeModal = document.getElementById('closeModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalBackdrop = document.getElementById('modalBackdrop');

    // Font loading check for HORIZON
    function checkHorizonFontLoading() {
        const testElement = document.createElement('span');
        testElement.style.fontFamily = 'Horizon, Arial Black, sans-serif';
        testElement.style.fontSize = '1px';
        testElement.style.opacity = '0';
        testElement.style.position = 'absolute';
        testElement.style.top = '-9999px';
        testElement.textContent = 'ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ'; // Test with Polish characters
        document.body.appendChild(testElement);

        // Check if font loaded after 2 seconds
        setTimeout(() => {
            const computedStyle = window.getComputedStyle(testElement);
            const fontFamily = computedStyle.fontFamily;
            
            if (fontFamily.includes('Horizon')) {
                console.log('Font HORIZON załadowany pomyślnie z wsparciem polskich znaków');
                document.body.classList.add('horizon-loaded');
            } else {
                console.warn('Font HORIZON nie został załadowany, używany fallback');
                document.body.classList.add('horizon-fallback');
            }
            
            document.body.removeChild(testElement);
        }, 2000);
    }

    // Initialize font checking
    checkHorizonFontLoading();

    // Enhanced email input configuration for Polish characters
    if (emailInput) {
        // Ensure proper charset and encoding handling
        emailInput.setAttribute('accept-charset', 'UTF-8');
        emailInput.removeAttribute('readonly');
        emailInput.removeAttribute('disabled');
        
        // Force proper text rendering
        emailInput.style.color = 'var(--color-text)';
        emailInput.style.webkitTextFillColor = 'var(--color-text)';
        emailInput.style.fontFeatureSettings = '"liga" 1, "kern" 1';
        emailInput.style.textRendering = 'optimizeLegibility';
        
        // Handle Polish character input properly
        emailInput.addEventListener('input', function(e) {
            // Preserve the cursor position
            const selectionStart = this.selectionStart;
            const selectionEnd = this.selectionEnd;
            
            // Ensure proper rendering of Polish characters
            this.style.color = 'var(--color-text)';
            this.style.webkitTextFillColor = 'var(--color-text)';
            
            // Restore cursor position
            setTimeout(() => {
                this.setSelectionRange(selectionStart, selectionEnd);
            }, 0);
        });
        
        // Handle paste events with Polish characters
        emailInput.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            
            // Insert pasted text properly
            const selectionStart = this.selectionStart;
            const selectionEnd = this.selectionEnd;
            const currentValue = this.value;
            
            const newValue = currentValue.substring(0, selectionStart) + pastedText + currentValue.substring(selectionEnd);
            this.value = newValue;
            
            // Set cursor position after pasted text
            const newCursorPosition = selectionStart + pastedText.length;
            setTimeout(() => {
                this.setSelectionRange(newCursorPosition, newCursorPosition);
                this.style.color = 'var(--color-text)';
                this.style.webkitTextFillColor = 'var(--color-text)';
            }, 0);
            
            // Trigger input event for validation
            this.dispatchEvent(new Event('input', { bubbles: true }));
        });
    }
    
    // Form validation functions
    function isValidEmail(email) {
        // Enhanced email regex that properly handles Polish domains and characters
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length > 5 && email.length < 255;
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        
        if (!email) {
            showFieldError(emailError, 'Adres e-mail jest wymagany');
            return false;
        }
        
        if (!isValidEmail(email)) {
            showFieldError(emailError, 'Podaj prawidłowy adres e-mail');
            return false;
        }
        
        clearFieldError(emailError);
        return true;
    }

    function validateConsent() {
        if (!consentCheckbox.checked) {
            showFieldError(consentError, 'Musisz wyrazić zgodę na przetwarzanie danych');
            return false;
        }
        
        clearFieldError(consentError);
        return true;
    }

    function showFieldError(errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function clearFieldError(errorElement) {
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    function clearAllErrors() {
        clearFieldError(emailError);
        clearFieldError(consentError);
    }

    // Status message functions
    function showSuccessMessage() {
        hideStatusMessages();
        if (successMessage) {
            successMessage.classList.remove('hidden');
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Auto-hide success message after 8 seconds
            setTimeout(() => {
                if (successMessage && !successMessage.classList.contains('hidden')) {
                    successMessage.classList.add('hidden');
                }
            }, 8000);
        }
    }

    function showErrorMessage(customMessage = null) {
        hideStatusMessages();
        if (errorMessage) {
            if (customMessage) {
                const messageText = errorMessage.querySelector('p');
                if (messageText) {
                    messageText.textContent = customMessage;
                }
            }
            errorMessage.classList.remove('hidden');
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function hideStatusMessages() {
        if (successMessage) successMessage.classList.add('hidden');
        if (errorMessage) errorMessage.classList.add('hidden');
    }

    // Loading state management
    function setLoadingState(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.textContent = 'Wysyłanie...';
            loadingSpinner.classList.remove('hidden');
            form.classList.add('form-submitting');
        } else {
            submitBtn.disabled = false;
            btnText.textContent = 'Dołącz do waitlisty';
            loadingSpinner.classList.add('hidden');
            form.classList.remove('form-submitting');
        }
    }

   // FormSpree integration with Polish character support
async function submitToNotion(email) {
    try {
        // FormSpree endpoint - ZMIEŃ NA SWÓJ ENDPOINT!
        const response = await fetch('https://formspree.io/f/TWOJ_ENDPOINT_ID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                zgoda_rodo: 'Tak',
                data_zapisu: new Date().toISOString(),
                źródło: 'Your Twin Mind Landing page waitlist',
                company: 'Your Twin Mind',
                język: 'polski',
                font_support: document.body.classList.contains('horizon-loaded') ? 'HORIZON' : 'Fallback'
            })
        });

        if (response.ok) {
            console.log('Email pomyślnie wysłany przez FormSpree:', email);
            return {
                success: true,
                email: email,
                message: 'Pomyślnie dodano do listy oczekujących Your Twin Mind'
            };
        } else {
            const errorText = await response.text();
            throw new Error(`FormSpree error: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        console.error('Błąd podczas wysyłania przez FormSpree:', error);
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}


    // Form submission handler
    async function handleFormSubmission(event) {
        event.preventDefault();
        
        // Clear previous messages and errors
        hideStatusMessages();
        clearAllErrors();
        
        // Validate form
        const isEmailValid = validateEmail();
        const isConsentValid = validateConsent();
        
        if (!isEmailValid || !isConsentValid) {
            if (!isEmailValid && !isConsentValid) {
                showErrorMessage('Wypełnij wszystkie wymagane pola poprawnie');
            } else if (!isEmailValid) {
                showErrorMessage('Podaj prawidłowy adres e-mail');
            } else if (!isConsentValid) {
                showErrorMessage('Musisz wyrazić zgodę na przetwarzanie danych');
            }
            return;
        }
        
        // Set loading state
        setLoadingState(true);
        
        try {
            const email = emailInput.value.trim();
            const result = await submitToNotion(email);
            
            if (result.success) {
                showSuccessMessage();
                form.reset(); // Clear form on success
                clearAllErrors(); // Clear any remaining error messages
                
                // Analytics tracking with Polish character support
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'waitlist_signup', {
                        event_category: 'engagement',
                        event_label: 'your_twin_mind_waitlist_pl',
                        custom_parameters: {
                            company: 'Your Twin Mind',
                            language: 'pl',
                            font_loaded: document.body.classList.contains('horizon-loaded') ? 'horizon' : 'fallback',
                            has_polish_chars: /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(email)
                        }
                    });
                }
                
                // Facebook Pixel tracking
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', {
                        content_name: 'Your Twin Mind Waitlist PL',
                        content_category: 'AI Products',
                        content_subcategory: 'Polish Market'
                    });
                }
                
            } else {
                showErrorMessage('Wystąpił błąd podczas zapisywania. Spróbuj ponownie za chwilę.');
                console.error('Submission failed:', result.error);
            }
            
        } catch (error) {
            console.error('Nieoczekiwany błąd:', error);
            showErrorMessage('Wystąpił nieoczekiwany błąd. Sprawdź połączenie internetowe i spróbuj ponownie.');
        } finally {
            setLoadingState(false);
        }
    }

    // Modal functions with enhanced accessibility and fixed event handling
    function openModal() {
        console.log('Otwieranie okna polityki prywatności...');
        if (privacyModal) {
            privacyModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Focus management for accessibility
            setTimeout(() => {
                if (closeModal) {
                    closeModal.focus();
                }
            }, 100);
            
            // Announce to screen readers
            if (closeModal) {
                closeModal.setAttribute('aria-label', 'Zamknij okno polityki prywatności');
            }
        }
    }

    function closeModalHandler() {
        console.log('Zamykanie okna polityki prywatności...');
        if (privacyModal) {
            privacyModal.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
            
            // Return focus to the privacy policy button
            setTimeout(() => {
                if (privacyPolicyBtn) {
                    privacyPolicyBtn.focus();
                }
            }, 100);
        }
    }

    // Event listeners
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
    
    // Real-time validation with enhanced Polish character support
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
        emailInput.addEventListener('input', function() {
            // Real-time validation if there was an error before
            if (emailError && emailError.textContent) {
                validateEmail();
            }
            
            // Log Polish character input for debugging
            const hasPolishChars = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(this.value);
            if (hasPolishChars) {
                console.log('Polskie znaki wprowadzane poprawnie:', this.value);
            }
        });
        
        // Prevent form submission on keydown in email field
        emailInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                form.requestSubmit(); // Use requestSubmit instead of submit to trigger validation
            }
        });
    }
    
    if (consentCheckbox) {
        consentCheckbox.addEventListener('change', function() {
            if (consentError && consentError.textContent) {
                validateConsent();
            }
        });
    }
    
    // Enhanced privacy policy button event listeners - FIXED
    if (privacyPolicyBtn) {
        // Handle click events
        privacyPolicyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Privacy policy span clicked');
            openModal();
        });
        
        // Handle keyboard events (Enter and Space)
        privacyPolicyBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                console.log('Privacy policy span activated via keyboard');
                openModal();
            }
        });
        
        // Add visual focus indicator
        privacyPolicyBtn.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--color-primary)';
            this.style.outlineOffset = '2px';
        });
        
        privacyPolicyBtn.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    }
    
    // Modal close event listeners
    if (closeModal) {
        closeModal.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeModalHandler();
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeModalHandler();
        });
    }
    
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', function(e) {
            if (e.target === modalBackdrop) {
                closeModalHandler();
            }
        });
    }
    
    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && privacyModal && !privacyModal.classList.contains('hidden')) {
            closeModalHandler();
        }
    });

    // Enhanced logo interactivity with HORIZON font awareness
    function enhanceLogoInteractivity() {
        const logoSvg = document.querySelector('.logo-svg');
        const nodes = document.querySelectorAll('.node, .node-output');
        const heroTitle = document.querySelector('.hero-title');
        
        if (logoSvg && nodes.length > 0) {
            logoSvg.addEventListener('mouseenter', function() {
                nodes.forEach((node, index) => {
                    setTimeout(() => {
                        node.style.animation = 'nodeGlow 2s ease-in-out infinite';
                    }, index * 100);
                });
                
                // Enhance title glow if HORIZON is loaded
                if (heroTitle && document.body.classList.contains('horizon-loaded')) {
                    heroTitle.style.textShadow = '0 0 30px rgba(50, 184, 198, 0.5)';
                }
            });
            
            logoSvg.addEventListener('mouseleave', function() {
                nodes.forEach(node => {
                    node.style.animation = 'nodeGlow 4s ease-in-out infinite';
                });
                
                if (heroTitle) {
                    heroTitle.style.textShadow = '0 0 20px rgba(50, 184, 198, 0.3)';
                }
            });
        }
    }

    // Initialize logo interactivity
    enhanceLogoInteractivity();

    // Polish character testing and debugging
    function testPolishCharacterSupport() {
        const testStrings = [
            'ąćęłńóśźż',
            'ĄĆĘŁŃÓŚŹŻ',
            'test@ąćęłń.pl',
            'Żółć gęsi jaźń'
        ];
        
        console.log('=== TEST POLSKICH ZNAKÓW ===');
        testStrings.forEach(testString => {
            console.log(`"${testString}" - długość: ${testString.length} znaków`);
        });
        
        // Test clipboard functionality
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('test@ąćęłń.pl').then(() => {
                console.log('Test email z polskimi znakami skopiowany do schowka');
            }).catch(err => {
                console.log('Schowek niedostępny:', err);
            });
        }
    }

    // Run Polish character support test
    setTimeout(testPolishCharacterSupport, 1000);

    // Debug information
    console.log('=== YOUR TWIN MIND WAITLIST INICJALIZACJA ===');
    console.log('Wsparcie polskich znaków: AKTYWNE');
    console.log('Fonty: HORIZON (tytuł) + Montserrat (tekst)');
    console.log('Elementy DOM:', {
        emailInput: !!emailInput,
        form: !!form,
        privacyModal: !!privacyModal,
        privacyPolicyBtn: !!privacyPolicyBtn,
        logoSvg: !!document.querySelector('.logo-svg'),
        heroTitle: !!document.querySelector('.hero-title')
    });
    
    // Final font loading and character support check
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const computedFont = window.getComputedStyle(heroTitle).fontFamily;
            console.log('Aktualny font tytułu:', computedFont);
            
            if (computedFont.toLowerCase().includes('horizon')) {
                console.log('✓ Font HORIZON załadowany i aktywny');
                heroTitle.setAttribute('data-font-status', 'horizon-loaded');
            } else {
                console.log('⚠ Używany font zastępczy dla tytułu');
                heroTitle.setAttribute('data-font-status', 'fallback-active');
            }
        }
        
        // Test final Polish character rendering
        if (emailInput) {
            const testValue = emailInput.value;
            if (testValue) {
                const hasPolish = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(testValue);
                console.log(`Email field value: "${testValue}" (polskie znaki: ${hasPolish})`);
            }
        }
        
        console.log('=== INICJALIZACJA ZAKOŃCZONA POMYŚLNIE ===');
    }, 3000);
});
