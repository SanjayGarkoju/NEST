import { designs, categories, budgetRanges, colours } from '../data.js';
import { navigate, getRoute } from '../state.js';
import { showToast } from '../components/DesignCard.js';
import { initScrollReveal } from '../components/ScrollReveal.js';

export function renderPersonalize() {
  const params = getRoute().params || {};
  const preselectedDesign = params.designId ? designs.find(d => d.id === parseInt(params.designId)) : null;

  const el = document.createElement('div');
  el.className = 'personalize-view page-fade-in';

  // Header
  const header = document.createElement('div');
  header.className = 'personalize-form-header reveal-up';
  header.innerHTML = `
    <div class="personalize-form-header-inner">
      <button class="detail-back" id="personalize-back" style="margin-bottom:var(--space-md);" aria-label="Go back to browse">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Browse
      </button>
      <p class="section-eyebrow">Personalization Experience</p>
      <h1 style="font-family:var(--font-serif);font-size:clamp(1.75rem,3vw,2.375rem);font-weight:500;color:var(--charcoal);letter-spacing:-0.01em;margin-bottom:var(--space-sm);">
        Adapt a Design to Your Space
      </h1>
      <p style="font-size:0.9375rem;color:var(--stone);max-width:540px;line-height:1.6;">
        Tell us about your room and your vision. We'll use your details to tailor a design recommendation to your specific home.
      </p>
    </div>
  `;

  header.querySelector('#personalize-back').addEventListener('click', () => navigate('browse'));
  el.appendChild(header);

  // Form body
  const body = document.createElement('div');
  body.className = 'personalize-form-body';

  // AI Notice
  body.innerHTML = `
    <div class="ai-notice reveal-up delay-100" role="note">
      <svg class="ai-notice-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p class="ai-notice-text">
        <strong>How personalization works:</strong> Share your room details below and our design team will review your preferences to create a tailored recommendation. AI-assisted generation will be available in a future update — your submission is saved and ready when that feature launches.
      </p>
    </div>
  `;

  const form = document.createElement('form');
  form.id = 'personalize-form';
  form.setAttribute('novalidate', '');
  form.setAttribute('aria-label', 'Space personalization form');

  // Section 1: Choose a Design
  const sec1 = document.createElement('div');
  sec1.className = 'form-section';
  sec1.innerHTML = `<h2 class="form-section-title">1. Choose a Design</h2>`;

  const designSelectField = document.createElement('div');
  designSelectField.className = 'form-field full-width';
  designSelectField.innerHTML = `
    <label for="design-select">Starting Design <span class="required" aria-label="required">*</span></label>
    <select class="form-select" id="design-select" name="design" required aria-required="true">
      <option value="">Select a design to personalize…</option>
      ${designs.map(d => `<option value="${d.id}" ${preselectedDesign && preselectedDesign.id === d.id ? 'selected' : ''}>${d.title} (${d.category} · ${d.style})</option>`).join('')}
    </select>
    <span class="form-error-msg" id="design-error" role="alert" style="display:none;">Please select a design.</span>
  `;

  // Preview
  const designPreview = document.createElement('div');
  designPreview.id = 'design-preview';
  designPreview.style.cssText = 'margin-top:var(--space-md);display:none;';
  designPreview.innerHTML = `
    <div style="display:flex;align-items:center;gap:var(--space-md);padding:var(--space-md);background:var(--ivory);border:1px solid var(--border-light);border-radius:var(--radius-md);">
      <img id="design-preview-img" src="" alt="" style="width:80px;height:60px;object-fit:cover;border-radius:var(--radius-sm);flex-shrink:0;" />
      <div>
        <p id="design-preview-title" style="font-family:var(--font-serif);font-weight:500;color:var(--charcoal);"></p>
        <p id="design-preview-meta" style="font-size:0.8125rem;color:var(--stone);margin-top:2px;"></p>
      </div>
    </div>
  `;

  sec1.appendChild(designSelectField);
  sec1.appendChild(designPreview);

  const designSelect = designSelectField.querySelector('#design-select');
  const updateDesignPreview = () => {
    const selected = designs.find(d => d.id === parseInt(designSelect.value));
    if (selected) {
      designPreview.style.display = 'block';
      designPreview.querySelector('#design-preview-img').src = selected.image;
      designPreview.querySelector('#design-preview-img').alt = selected.title;
      designPreview.querySelector('#design-preview-title').textContent = selected.title;
      designPreview.querySelector('#design-preview-meta').textContent = `${selected.category} · ${selected.style} · ${selected.budget}`;
    } else {
      designPreview.style.display = 'none';
    }
  };
  designSelect.addEventListener('change', updateDesignPreview);
  if (preselectedDesign) updateDesignPreview();

  form.appendChild(sec1);

  // Section 2: Room Details
  const sec2 = document.createElement('div');
  sec2.className = 'form-section';
  sec2.innerHTML = `
    <h2 class="form-section-title">2. Your Room</h2>
    <div class="form-grid">
      <div class="form-field">
        <label for="room-type">Room Type <span class="required" aria-label="required">*</span></label>
        <select class="form-select" id="room-type" name="room_type" required aria-required="true">
          <option value="">Select room type…</option>
          ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
        <span class="form-error-msg" id="room-type-error" role="alert" style="display:none;">Please select a room type.</span>
      </div>
      <div class="form-field">
        <label for="room-size">Room Size</label>
        <select class="form-select" id="room-size" name="room_size">
          <option value="">Select approximate size…</option>
          <option value="small">Small (under 150 sq ft)</option>
          <option value="medium">Medium (150 – 300 sq ft)</option>
          <option value="large">Large (300 – 500 sq ft)</option>
          <option value="xlarge">Extra Large (500+ sq ft)</option>
        </select>
      </div>
      <div class="form-field">
        <label for="room-width">Room Width (metres)</label>
        <input type="number" class="form-input" id="room-width" name="width" min="1" max="50" step="0.1" placeholder="e.g. 4.5" aria-label="Room width in metres" />
      </div>
      <div class="form-field">
        <label for="room-length">Room Length (metres)</label>
        <input type="number" class="form-input" id="room-length" name="length" min="1" max="50" step="0.1" placeholder="e.g. 6.2" aria-label="Room length in metres" />
      </div>
    </div>
  `;
  form.appendChild(sec2);

  // Section 3: Style & Colour
  const sec3 = document.createElement('div');
  sec3.className = 'form-section';
  sec3.innerHTML = `
    <h2 class="form-section-title">3. Style & Colour Preferences</h2>
    <div class="form-grid">
      <div class="form-field">
        <label for="style-pref">Preferred Style</label>
        <select class="form-select" id="style-pref" name="style">
          <option value="">No preference</option>
          <option value="modern">Modern</option>
          <option value="minimalist">Minimalist</option>
          <option value="scandinavian">Scandinavian</option>
          <option value="contemporary">Contemporary</option>
          <option value="industrial">Industrial</option>
          <option value="traditional">Traditional</option>
          <option value="luxury">Luxury</option>
        </select>
      </div>
      <div class="form-field">
        <label for="budget-pref">Budget Range <span class="required" aria-label="required">*</span></label>
        <select class="form-select" id="budget-pref" name="budget" required aria-required="true">
          <option value="">Select your budget…</option>
          ${budgetRanges.map(b => `<option value="${b.id}">${b.label} (${b.range})</option>`).join('')}
        </select>
        <span class="form-error-msg" id="budget-error" role="alert" style="display:none;">Please select a budget range.</span>
      </div>
      <div class="form-field full-width">
        <label>Wall Colour Preference</label>
        <div style="margin-top:var(--space-sm);">
          <div class="colour-picker" role="radiogroup" aria-label="Wall colour preference" id="colour-picker">
            ${colours.map(c => `
              <div
                class="colour-option"
                style="background:${c.hex};"
                data-colour="${c.id}"
                role="radio"
                aria-checked="false"
                aria-label="${c.name}"
                tabindex="0"
                title="${c.name}"
              >
                <span class="colour-option-label">${c.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Colour picker interactions
  sec3.querySelectorAll('.colour-option').forEach(opt => {
    opt.addEventListener('click', () => {
      sec3.querySelectorAll('.colour-option').forEach(o => {
        o.classList.remove('selected');
        o.setAttribute('aria-checked', 'false');
      });
      opt.classList.add('selected');
      opt.setAttribute('aria-checked', 'true');
    });
    opt.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        opt.click();
      }
    });
  });

  form.appendChild(sec3);

  // Section 4: Upload
  const sec4 = document.createElement('div');
  sec4.className = 'form-section';
  sec4.innerHTML = `
    <h2 class="form-section-title">4. Your Room Photo (Optional)</h2>
    <p style="font-size:0.875rem;color:var(--stone);margin-bottom:var(--space-lg);line-height:1.6;">Uploading a photo of your current room helps us understand the space and provide a more accurate design recommendation.</p>
    <div class="upload-area" id="upload-area" role="button" tabindex="0" aria-label="Upload a photo of your room">
      <div class="upload-area-icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      </div>
      <p class="upload-area-title">Drag and drop or click to upload</p>
      <p class="upload-area-sub">JPG, PNG, WEBP up to 10MB</p>
      <input type="file" id="room-photo" name="room_photo" accept="image/*" style="display:none;" aria-label="Upload room photo" />
    </div>
    <div class="upload-preview" id="upload-preview">
      <img id="upload-preview-img" src="" alt="Your uploaded room photo" />
      <button class="upload-preview-remove" id="upload-remove" type="button" aria-label="Remove uploaded photo">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `;

  const uploadArea = sec4.querySelector('#upload-area');
  const fileInput = sec4.querySelector('#room-photo');
  const preview = sec4.querySelector('#upload-preview');
  const previewImg = sec4.querySelector('#upload-preview-img');

  uploadArea.addEventListener('click', () => fileInput.click());
  uploadArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
  });

  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--forest-light)';
  });
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '';
  });
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) handleFileUpload(fileInput.files[0]);
  });

  function handleFileUpload(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size must be under 10MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      uploadArea.style.display = 'none';
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }

  sec4.querySelector('#upload-remove').addEventListener('click', () => {
    previewImg.src = '';
    fileInput.value = '';
    uploadArea.style.display = 'block';
    preview.style.display = 'none';
  });

  form.appendChild(sec4);

  // Section 5: Notes
  const sec5 = document.createElement('div');
  sec5.className = 'form-section';
  sec5.innerHTML = `
    <h2 class="form-section-title">5. Additional Notes</h2>
    <div class="form-field full-width" style="grid-column:1/-1;">
      <label for="notes">Anything else we should know?</label>
      <textarea class="form-textarea" id="notes" name="notes" placeholder="Tell us about your lifestyle, any must-have items, things you love or want to avoid, or any special requirements for your space…" aria-label="Additional notes about your space"></textarea>
    </div>
  `;
  form.appendChild(sec5);

  // Submit
  const submitArea = document.createElement('div');
  submitArea.className = 'form-submit-area';
  submitArea.innerHTML = `
    <button type="button" class="btn btn-secondary" id="personalize-cancel">Cancel</button>
    <button type="submit" class="btn btn-primary btn-lg" id="personalize-submit">
      Submit Personalization Request
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </button>
  `;
  submitArea.querySelector('#personalize-cancel').addEventListener('click', () => navigate('browse'));
  form.appendChild(submitArea);

  // Validation
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { el: designSelect, errorId: 'design-error' },
      { el: form.querySelector('#room-type'), errorId: 'room-type-error' },
      { el: form.querySelector('#budget-pref'), errorId: 'budget-error' }
    ];

    fields.forEach(({ el: fieldEl, errorId }) => {
      const err = form.querySelector(`#${errorId}`);
      if (!fieldEl.value) {
        fieldEl.classList.add('error');
        if (err) err.style.display = 'block';
        valid = false;
      } else {
        fieldEl.classList.remove('error');
        if (err) err.style.display = 'none';
      }
    });

    if (!valid) {
      form.querySelector('.form-select.error, .form-input.error')?.focus();
      return;
    }

    // Show success state
    body.innerHTML = '';
    body.innerHTML = `
      <div class="form-success">
        <div class="form-success-icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2 class="form-success-title">Personalization Request Submitted</h2>
        <p class="form-success-desc">Thank you for sharing your details. Our team will review your preferences and be in touch with a tailored design recommendation for your space.</p>
        <div style="display:flex;gap:var(--space-md);justify-content:center;flex-wrap:wrap;">
          <button class="btn btn-primary" id="success-browse">Continue Exploring</button>
          <button class="btn btn-secondary" id="success-home">Back to Home</button>
        </div>
      </div>
    `;
    body.querySelector('#success-browse').addEventListener('click', () => navigate('browse'));
    body.querySelector('#success-home').addEventListener('click', () => navigate('home'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  body.appendChild(form);
  el.appendChild(body);

  return el;
}
