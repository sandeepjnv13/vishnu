// Contact Form Handler with Airtable Integration
(function() {
    'use strict';

    // ============================================
    // AIRTABLE CONFIGURATION
    // ============================================
    const AIRTABLE_CONFIG = {
        apiToken: 'pat9gUCwScODWuZHh.e888153317f4fbff89fc4703a54e538c45c2abf15087ecbba745876626d01274',
        baseId: 'appjaLQj1wDUiVSex',
        tableName: 'Contacts'
    };

    // Check if Airtable is configured
    const isAirtableConfigured =
        AIRTABLE_CONFIG.apiToken &&
        AIRTABLE_CONFIG.baseId &&
        AIRTABLE_CONFIG.tableName;

    // Get form elements
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const messageDiv = document.getElementById('formMessage');

    if (!form || !submitBtn || !messageDiv) {
        console.error('Contact form elements not found');
        return;
    }

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            location: document.getElementById('location').value,
            message: document.getElementById('message').value.trim()
        };

        // Validate required fields
        if (!formData.name) {
            showMessage('Please enter your name.', 'error');
            return;
        }

        if (!formData.location) {
            showMessage('Please select your location.', 'error');
            return;
        }

        if (!formData.message) {
            showMessage('Please enter your message.', 'error');
            return;
        }

        // Check if at least email OR phone is provided
        if (!formData.email && !formData.phone) {
            showMessage('Please provide either your email address or phone number so we can reach you.', 'error');
            return;
        }

        // Validate email format if provided
        if (formData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span>Sending...';
        hideMessage();

        try {
            if (isAirtableConfigured) {
                // Send to Airtable
                await submitToAirtable(formData);
            } else {
                // Fallback: Log to console
                console.log('Form submitted (Airtable not configured):', formData);
            }

            // Show success message
            showMessage('✓ Thank you for contacting us! We will get back to you shortly.', 'success');

            // Reset form
            form.reset();

            // Hide success message after 5 seconds
            setTimeout(() => {
                hideMessage();
            }, 5000);

        } catch (error) {
            console.error('Submission error:', error);

            let errorMessage = '✗ Sorry, something went wrong. ';

            if (error.message.includes('NOT_FOUND')) {
                errorMessage += 'Configuration error - please contact support.';
            } else if (error.message.includes('INVALID_REQUEST')) {
                errorMessage += 'Invalid form data - please check your inputs.';
            } else if (error.message.includes('UNAUTHORIZED')) {
                errorMessage += 'Authentication error - please contact support.';
            } else if (error.message.includes('Network')) {
                errorMessage += 'Network error - please check your connection and try again.';
            } else {
                errorMessage += 'Please try again later or contact us directly.';
            }

            showMessage(errorMessage, 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message';
        }
    });

    // Submit to Airtable
    async function submitToAirtable(formData) {
        const airtableData = {
            records: [
                {
                    fields: {
                        Name: formData.name,
                        Email: formData.email || 'Not provided',
                        Phone: formData.phone || 'Not provided',
                        Location: formData.location,
                        Message: formData.message,
                        Timestamp: new Date().toISOString()
                    }
                }
            ]
        };

        const response = await fetch(
            `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${encodeURIComponent(AIRTABLE_CONFIG.tableName)}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_CONFIG.apiToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(airtableData)
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to submit form');
        }

        return await response.json();
    }

    // Show message function
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `form-message ${type} show`;
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Hide message function
    function hideMessage() {
        messageDiv.className = 'form-message';
    }

    // Optional: Keyboard shortcut (Ctrl/Cmd + Enter in message field)
    const messageField = document.getElementById('message');
    if (messageField) {
        messageField.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                form.dispatchEvent(new Event('submit'));
            }
        });
    }

    // Log configuration status
    if (isAirtableConfigured) {
        console.log('✓ Contact form ready with Airtable integration');
    } else {
        console.warn('⚠ Airtable not configured - form submissions will be logged to console only');
    }

})();