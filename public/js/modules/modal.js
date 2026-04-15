import { PRODUCTS } from '../data.js';

// ══════════════════════════════════════════════════════════
// MODAL MODULE
// ══════════════════════════════════════════════════════════

export function initModal() {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  if (!overlay) return;

  closeBtn?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });
}

export function openModal(productId) {
  if (!PRODUCTS) return;
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const overlay = document.getElementById('modalOverlay');

  document.getElementById('modalImg').src = product.image;
  document.getElementById('modalImg').alt = product.name;
  document.getElementById('modalPrice').textContent = formatPrice(product.price);
  document.getElementById('modalBrand').textContent = product.brand;
  document.getElementById('modalTitle').textContent = product.name;
  document.getElementById('modalDescription').textContent = product.description;

  // Details
  const detailsEl = document.getElementById('modalDetails');
  detailsEl.innerHTML = `
    <div class="modal-detail-item">
      <span class="modal-detail-label">Tipo</span>
      <span class="modal-detail-value">${product.type}</span>
    </div>
    <div class="modal-detail-item">
      <span class="modal-detail-label">Origen</span>
      <span class="modal-detail-value">${product.origin}</span>
    </div>
    <div class="modal-detail-item">
      <span class="modal-detail-label">Tueste</span>
      <span class="modal-detail-value">${product.roast}</span>
    </div>
    <div class="modal-detail-item">
      <span class="modal-detail-label">Peso</span>
      <span class="modal-detail-value">${product.weight}</span>
    </div>
    ${product.intensity > 0 ? `
    <div class="modal-detail-item" style="grid-column:1/-1;">
      ${renderIntensityBar(product.intensity)}
    </div>
    ` : ''}
  `;

  // Tags
  const tagsEl = document.getElementById('modalTags');
  tagsEl.innerHTML = (product.tastingNotes || [])
    .map(n => `<span class="modal-tag">${n}</span>`)
    .join('');

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Focus trap
  document.getElementById('modalClose')?.focus();
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay?.classList.remove('active');
  document.body.style.overflow = '';
}

export function renderIntensityBar(intensity) {
  if (intensity === 0 || intensity === undefined) return '';
  const pct = (intensity / 10) * 100;
  return `
    <div class="intensity-bar">
      <span class="intensity-bar__label">Intensidad</span>
      <div class="intensity-bar__track">
        <div class="intensity-bar__fill" style="width:${pct}%"></div>
      </div>
      <span class="intensity-bar__value">${intensity}/10</span>
    </div>
  `;
}

export function formatPrice(price) {
  return '$' + price.toLocaleString('es-AR');
}
