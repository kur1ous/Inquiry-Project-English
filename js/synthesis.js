/* ============================================
   SYNTHESIS.JS — Synthesis Page Logic
   ============================================ */

/**
 * Initialize the synthesis page
 */
function initSynthesisPage() {
    loadUserJourney();
    initSynthesisForm();
}

/**
 * Load and display user's journey data
 */
function loadUserJourney() {
    const responses = getAllResponses();

    // Display original slider position
    const originalSliderDisplay = document.getElementById('original-slider-value');
    if (originalSliderDisplay) {
        originalSliderDisplay.textContent = formatConscienceSlider(responses.initialSlider);
    }

    // Display original reasoning
    const originalReasonDisplay = document.getElementById('original-reason-display');
    if (originalReasonDisplay && responses.initialReason) {
        originalReasonDisplay.textContent = responses.initialReason;
    }

    // Populate evidence summary
    populateEvidenceSummary(responses);
}

/**
 * Populate the evidence summary section
 * @param {Object} responses - User responses object
 */
function populateEvidenceSummary(responses) {
    const summaryContainer = document.getElementById('evidence-summary');
    if (!summaryContainer) return;

    const pillars = [
        { key: 'biologyReflection', name: 'The Social Brain', page: 'biology' },
        { key: 'infantsReflection', name: 'Infant Fairness', page: 'infants' },
        { key: 'traumaReflection', name: 'Epigenetic Trauma', page: 'trauma' },
        { key: 'familyReflection', name: 'Family & Morality', page: 'family' },
        { key: 'starvationReflection', name: 'Starvation Study', page: 'starvation' },
        { key: 'philosophyReflection', name: 'Philosophy', page: 'philosophy' }
    ];

    let html = '';

    pillars.forEach(pillar => {
        const response = responses[pillar.key];
        if (response && response.trim()) {
            html += `
        <div class="evidence-summary__item">
          <h4 class="evidence-summary__title">${pillar.name}</h4>
          <p class="evidence-summary__text">${escapeHtml(response)}</p>
        </div>
      `;
        }
    });

    if (html) {
        summaryContainer.innerHTML = html;
    } else {
        summaryContainer.innerHTML = '<p class="text-muted">No reflections recorded yet. Consider revisiting the evidence pages.</p>';
    }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Initialize the synthesis form
 */
function initSynthesisForm() {
    const form = document.getElementById('synthesis-form');
    if (!form) return;

    // Load any previously saved synthesis
    const savedSynthesis = loadFromStorage('synthesis_statement', '');
    const savedSlider = loadFromStorage('final_slider', 50);

    const synthesisTextarea = document.getElementById('synthesis-statement');
    const finalSlider = document.getElementById('final-slider');

    if (synthesisTextarea && savedSynthesis) {
        synthesisTextarea.value = savedSynthesis;
    }

    if (finalSlider && savedSlider !== null) {
        finalSlider.value = savedSlider;
        // Manually trigger display update
        const event = new Event('input', { bubbles: true });
        finalSlider.dispatchEvent(event);
    }

    // Auto-save on change
    if (synthesisTextarea) {
        synthesisTextarea.addEventListener('input', debounce(() => {
            saveToStorage('synthesis_statement', synthesisTextarea.value);
        }, 500));
    }

    if (finalSlider) {
        finalSlider.addEventListener('input', () => {
            saveToStorage('final_slider', parseInt(finalSlider.value, 10));
        });
    }

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const synthesisValue = synthesisTextarea ? synthesisTextarea.value.trim() : '';
        const sliderValue = finalSlider ? parseInt(finalSlider.value, 10) : 50;

        if (synthesisValue.length < 100) {
            showConfirmation('Please write at least 100 characters for your synthesis.', 'info');
            return;
        }

        saveToStorage('synthesis_statement', synthesisValue);
        saveToStorage('final_slider', sliderValue);
        markPageCompleted('synthesis');

        showConfirmation('Synthesis saved. Proceeding to conclusion...');

        setTimeout(() => {
            window.location.href = 'conclusion.html';
        }, 1500);
    });
}

/**
 * Debounce function for auto-save
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
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
 * Generate a printable/exportable version of the synthesis
 */
function exportSynthesis() {
    const responses = getAllResponses();

    let text = `CONSCIENCE INQUIRY — PERSONAL SYNTHESIS\n`;
    text += `${'='.repeat(50)}\n\n`;
    text += `Date: ${new Date().toLocaleDateString()}\n\n`;

    text += `INITIAL POSITION\n`;
    text += `-`.repeat(30) + `\n`;
    text += `Slider: ${formatConscienceSlider(responses.initialSlider)}\n`;
    text += `Reasoning: ${responses.initialReason || 'Not recorded'}\n\n`;

    text += `FINAL POSITION\n`;
    text += `-`.repeat(30) + `\n`;
    text += `Slider: ${formatConscienceSlider(responses.finalSlider || 50)}\n`;
    text += `Synthesis: ${responses.synthesisStatement || 'Not recorded'}\n\n`;

    text += `JOURNEY REFLECTIONS\n`;
    text += `-`.repeat(30) + `\n`;

    const pillars = [
        { key: 'biologyReflection', name: 'The Social Brain' },
        { key: 'infantsReflection', name: 'Infant Fairness' },
        { key: 'traumaReflection', name: 'Epigenetic Trauma' },
        { key: 'familyReflection', name: 'Family & Morality' },
        { key: 'starvationReflection', name: 'Starvation Study' },
        { key: 'philosophyReflection', name: 'Philosophy' }
    ];

    pillars.forEach(pillar => {
        const response = responses[pillar.key];
        if (response && response.trim()) {
            text += `\n${pillar.name}:\n${response}\n`;
        }
    });

    // Create download
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conscience-inquiry-synthesis.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showConfirmation('Synthesis exported successfully.');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('synthesis-form')) {
        initSynthesisPage();
    }
});
