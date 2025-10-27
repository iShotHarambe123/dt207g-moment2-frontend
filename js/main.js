// API-konfiguration,pekar på Render backend
const API_URL = 'https://dt207g-moment2-backend-rofh.onrender.com/api';

// Hämtar DOM-element
const workList = document.getElementById('work-list');
const loadingElement = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const emptyState = document.getElementById('empty-state');
const retryBtn = document.getElementById('retry-btn');

// Håll koll på alla arbetserfarenheter
let workExperiences = [];

// Startar appen när sidan laddats
document.addEventListener('DOMContentLoaded', function () {
    console.log('Sidan laddad, hämtar arbetserfarenheter...');
    loadWorkExperiences();
    setupEventListeners();
});

// event listeners
function setupEventListeners() {
    retryBtn.addEventListener('click', loadWorkExperiences);
}

// Laddar arbetserfarenheter från API:et
async function loadWorkExperiences() {
    showLoading();
    hideError();

    try {
        console.log('Hämtar data från API...');
        const response = await fetch(`${API_URL}/workexperience`);

        if (!response.ok) {
            throw new Error(`HTTP-fel! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            workExperiences = data.data;
            console.log(`Hämtade ${workExperiences.length} arbetserfarenheter`);
            displayWorkExperiences();
        } else {
            throw new Error('API:et returnerade ett fel');
        }

    } catch (error) {
        console.error('Fel vid laddning av arbetserfarenheter:', error);
        showError('Kunde inte ladda arbetserfarenheter. Kontrollera internetanslutningen eller att API-servern är tillgänglig.');
    } finally {
        hideLoading();
    }
}

// Visar arbetserfarenheterna på sidan
function displayWorkExperiences() {
    if (workExperiences.length === 0) {
        showEmptyState();
        return;
    }

    hideEmptyState();

    // Bygger HTML för alla arbetserfarenheter
    workList.innerHTML = workExperiences.map(work => `
        <div class="work-item">
            <h3>${escapeHtml(work.jobtitle)}</h3>
            <div class="work-company">${escapeHtml(work.companyname)}</div>
            <div class="work-meta">
                <strong>Plats:</strong> ${escapeHtml(work.location)} | 
                <strong>Period:</strong> ${formatDatePeriod(work.startdate, work.enddate)}
            </div>
            <div class="work-description">
                ${escapeHtml(work.description)}
            </div>
            <div class="work-actions">
                <button class="btn btn-danger" onclick="deleteWork(${work.id})">Ta bort</button>
            </div>
        </div>
    `).join('');
}

// Raderar en arbetslivserfarenhet
async function deleteWork(id) {
    const work = workExperiences.find(w => w.id === id);
    if (!work) {
        showError('Arbetslivserfarenhet hittades inte');
        return;
    }

    const confirmMessage = `Är du säker på att du vill ta bort "${work.jobtitle}" på ${work.companyname}?`;

    if (!confirm(confirmMessage)) {
        return; // Användaren ångrade sig
    }

    try {
        console.log('Raderar jobb med ID:', id);
        const response = await fetch(`${API_URL}/workexperience/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok && result.success) {
            loadWorkExperiences(); // Laddar om listan
            alert('Arbetslivserfarenhet borttagen!');
        } else {
            throw new Error(result.message || 'Kunde inte ta bort arbetslivserfarenhet');
        }

    } catch (error) {
        console.error('Fel vid radering:', error);
        showError('Fel vid borttagning: ' + error.message);
    }
}

// Hjälpfunktioner för UI
function showLoading() {
    loadingElement.style.display = 'block';
    workList.style.display = 'none';
    hideError();
    hideEmptyState();
}

function hideLoading() {
    loadingElement.style.display = 'none';
    workList.style.display = 'block';
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'block';
    hideLoading();
    hideEmptyState();
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showEmptyState() {
    emptyState.style.display = 'block';
    workList.style.display = 'none';
}

function hideEmptyState() {
    emptyState.style.display = 'none';
    workList.style.display = 'block';
}

function formatDatePeriod(startDate, endDate) {
    const start = new Date(startDate).toLocaleDateString('sv-SE');
    const end = endDate ? new Date(endDate).toLocaleDateString('sv-SE') : 'Pågående';
    return `${start} - ${end}`;
}

// Hjälpfunktion textvisning
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Gör funktionen tillgänglig globalt så HTML kan anropa den
window.deleteWork = deleteWork;