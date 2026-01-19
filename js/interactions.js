/* ============================================
   INTERACTIONS.JS — UI Interactions & Reveals
   ============================================ */

/**
 * Initialize all reveal blocks on the page
 */
function initRevealBlocks() {
    const triggers = document.querySelectorAll('.reveal-trigger');

    triggers.forEach(trigger => {
        const contentId = trigger.getAttribute('aria-controls');
        const content = document.getElementById(contentId);

        if (!content) return;

        // Set initial state
        trigger.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');

        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

            trigger.setAttribute('aria-expanded', !isExpanded);
            content.setAttribute('aria-hidden', isExpanded);
        });
    });
}

/**
 * Initialize slider with value display
 * @param {string} sliderId - ID of the slider input
 * @param {string} displayId - ID of the element to show value in
 * @param {Function} formatFn - Optional function to format the display value
 */
function initSlider(sliderId, displayId, formatFn = null) {
    const slider = document.getElementById(sliderId);
    const display = document.getElementById(displayId);

    if (!slider || !display) return;

    function updateDisplay() {
        const value = parseInt(slider.value, 10);
        if (formatFn) {
            display.textContent = formatFn(value);
        } else {
            display.textContent = value + '%';
        }
    }

    slider.addEventListener('input', updateDisplay);
    updateDisplay(); // Initial display
}

/**
 * Format slider value as innate/constructed percentage
 * @param {number} value - Slider value 0-100
 * @returns {string} Formatted string
 */
function formatConscienceSlider(value) {
    const innatePercent = value;
    const constructedPercent = 100 - value;

    if (value === 50) {
        return 'Exactly balanced';
    } else if (value < 50) {
        return `${constructedPercent}% Constructed`;
    } else {
        return `${innatePercent}% Innate`;
    }
}

/**
 * Initialize character counter for textareas
 * @param {string} textareaId - ID of the textarea
 * @param {string} counterId - ID of the counter display element
 * @param {number} minChars - Minimum character count
 * @param {number} maxChars - Maximum character count
 */
function initCharCounter(textareaId, counterId, minChars = 100, maxChars = 500) {
    const textarea = document.getElementById(textareaId);
    const counter = document.getElementById(counterId);

    if (!textarea || !counter) return;

    function updateCounter() {
        const length = textarea.value.length;
        counter.textContent = `${length} / ${maxChars} characters`;

        if (length < minChars) {
            counter.style.color = 'var(--color-text-muted)';
        } else if (length <= maxChars) {
            counter.style.color = 'var(--color-success)';
        } else {
            counter.style.color = 'var(--color-warning)';
        }
    }

    textarea.addEventListener('input', updateCounter);
    updateCounter(); // Initial count
}

/**
 * Initialize progress bar based on completed pages
 */
function initProgressBar() {
    const progressFill = document.querySelector('.progress-bar__fill');
    const progressText = document.querySelector('.progress-indicator__text');

    if (!progressFill) return;

    const percentage = getProgressPercentage();
    progressFill.style.width = percentage + '%';

    if (progressText) {
        progressText.textContent = percentage + '% complete';
    }
}

/**
 * Smooth scroll to an element
 * @param {string} elementId - ID of the element to scroll to
 */
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Initialize page navigation
 */
function initPageNavigation() {
    // Add keyboard navigation for arrow keys
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
            return; // Don't intercept when typing
        }

        const prevLink = document.querySelector('.page-nav__link--prev');
        const nextLink = document.querySelector('.page-nav__link--next');

        if (e.key === 'ArrowLeft' && prevLink) {
            prevLink.click();
        } else if (e.key === 'ArrowRight' && nextLink) {
            nextLink.click();
        }
    });
}

/**
 * Show a confirmation message
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success' or 'info'
 */
function showConfirmation(message, type = 'success') {
    // Remove any existing confirmation
    const existing = document.querySelector('.confirmation-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'confirmation-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
    <span class="confirmation-toast__icon">${type === 'success' ? '✓' : 'ℹ'}</span>
    <span class="confirmation-toast__message">${message}</span>
  `;

    // Add toast styles if not already present
    if (!document.getElementById('toast-styles')) {
        const styles = document.createElement('style');
        styles.id = 'toast-styles';
        styles.textContent = `
      .confirmation-toast {
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: var(--color-surface-elevated);
        border: 1px solid var(--color-accent);
        border-radius: var(--border-radius);
        color: var(--color-text);
        font-size: var(--text-sm);
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
        animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s forwards;
        z-index: 1000;
      }
      
      .confirmation-toast__icon {
        color: var(--color-accent);
        font-weight: bold;
      }
      
      @keyframes toastIn {
        from { opacity: 0; transform: translateX(-50%) translateY(1rem); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
      
      @keyframes toastOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(1rem); }
      }
    `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(toast);

    // Remove after animation
    setTimeout(() => toast.remove(), 3000);
}

/**
 * Initialize common page elements
 */
function initCommonElements() {
    initRevealBlocks();
    initProgressBar();
    initPageNavigation();
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initCommonElements);
