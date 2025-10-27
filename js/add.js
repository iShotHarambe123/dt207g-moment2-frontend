// API-konfiguration,pekar på Render backend
const API_BASE_URL = 'https://dt207g-moment2-backend-rofh.onrender.com/api';

// Hämtar DOM-element som vi behöver
const addForm = document.getElementById('add-work-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const retryBtn = document.getElementById('retry-btn');
const addAnotherBtn = document.getElementById('add-another');

// Startar appen när sidan laddats
document.addEventListener('DOMContentLoaded', function () {
    setupEventListeners();
});

// Sätter upp event listeners
function setupEventListeners() {
    addForm.addEventListener('submit', handleFormSubmit);
    retryBtn.addEventListener('click', hideError);
    addAnotherBtn.addEventListener('click', resetForm);
}

// Hanterar formulärinskickning
async function handleFormSubmit(e) {
    e.preventDefault();

    // Rensar tidigare fel
    clearAllErrors();

    // Hämtar formulärdata
    const formData = new FormData(addForm);
    const workData = {
        companyname: formData.get('companyname').trim(),
        jobtitle: formData.get('jobtitle').trim(),
        location: formData.get('location').trim(),
        startdate: formData.get('startdate'),
        enddate: formData.get('enddate') || null,
        description: formData.get('description').trim()
    };

    // Validerar formulärdata
    const validationErrors = validateFormData(workData);
    if (validationErrors.length > 0) {
        displayValidationErrors(validationErrors);
        return;
    }

    // Visar laddningstillstånd
    setLoadingState(true);

    try {
        console.log('Skickar data till API...');
        const response = await fetch(`${API_BASE_URL}/workexperience`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(workData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showSuccess();
            addForm.reset();
        } else {
            // Hanterar valideringsfel från servern
            if (result.details && Array.isArray(result.details)) {
                displayServerErrors(result.details);
            } else {
                throw new Error(result.message || 'Kunde inte spara arbetslivserfarenhet');
            }
        }

    } catch (error) {
        console.error('Fel vid tillägg av arbetserfarenhet:', error);
        showError('Fel vid sparande: ' + error.message);
    } finally {
        setLoadingState(false);
    }
}

// Valideringsfunktioner
function validateFormData(data) {
    const errors = [];

    if (!data.companyname) {
        errors.push({ field: 'companyname', message: 'Företagsnamn är obligatoriskt' });
    }

    if (!data.jobtitle) {
        errors.push({ field: 'jobtitle', message: 'Jobbtitel är obligatorisk' });
    }

    if (!data.location) {
        errors.push({ field: 'location', message: 'Plats är obligatorisk' });
    }

    if (!data.startdate) {
        errors.push({ field: 'startdate', message: 'Startdatum är obligatoriskt' });
    }

    if (!data.description) {
        errors.push({ field: 'description', message: 'Beskrivning är obligatorisk' });
    }

    // Validerar datumlogik
    if (data.startdate && data.enddate) {
        const startDate = new Date(data.startdate);
        const endDate = new Date(data.enddate);

        if (endDate <= startDate) {
            errors.push({ field: 'enddate', message: 'Slutdatum måste vara efter startdatum' });
        }
    }

    return errors;
}

// Felhanteringsfunktioner
function displayValidationErrors(errors) {
    errors.forEach(error => {
        showFieldError(error.field, error.message);
    });
}

function displayServerErrors(errors) {
    errors.forEach(errorMessage => {
        if (errorMessage.includes('Företagsnamn') || errorMessage.includes('Company name')) {
            showFieldError('companyname', errorMessage);
        } else if (errorMessage.includes('Jobbtitel') || errorMessage.includes('Job title')) {
            showFieldError('jobtitle', errorMessage);
        } else if (errorMessage.includes('Plats') || errorMessage.includes('Location')) {
            showFieldError('location', errorMessage);
        } else if (errorMessage.includes('Startdatum') || errorMessage.includes('Start date')) {
            showFieldError('startdate', errorMessage);
        } else if (errorMessage.includes('Slutdatum') || errorMessage.includes('End date')) {
            showFieldError('enddate', errorMessage);
        } else if (errorMessage.includes('Beskrivning') || errorMessage.includes('Description')) {
            showFieldError('description', errorMessage);
        } else {
            showError(errorMessage);
        }
    });
}

function showFieldError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearFieldError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

function clearAllErrors() {
    const fieldNames = ['companyname', 'jobtitle', 'location', 'startdate', 'enddate', 'description'];
    fieldNames.forEach(fieldName => {
        clearFieldError(fieldName);
    });
    hideError();
}

// UI-tillstånd
function setLoadingState(loading) {
    if (loading) {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
    } else {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

function showSuccess() {
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
    addForm.style.display = 'none';
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function resetForm() {
    addForm.reset();
    addForm.style.display = 'block';
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    clearAllErrors();
}