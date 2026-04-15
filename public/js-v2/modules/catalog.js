import { PRODUCTS } from '../data.js';
import { openModal, formatPrice, renderIntensityBar } from './modal.js';

// ══════════════════════════════════════════════════════════
// CATALOG MODULE
// ══════════════════════════════════════════════════════════

let currentCategory = 'nespresso';
let currentBrand = null;
let searchQuery = '';

const CATEGORY_META = {
  nespresso: {
    title: 'Cápsulas Nespresso',
    subtitle: 'Compatibles con todas las cafeteras Nespresso'
  },
  'dolce-gusto': {
    title: 'Cápsulas Dolce Gusto',
    subtitle: 'Compatibles con todas las cafeteras Dolce Gusto'
  },
  molido: {
    title: 'Café Molido',
    subtitle: 'Para cafetera de filtro, prensa francesa y espresso'
  },
  saborizados: {
    title: 'Saborizados',
    subtitle: 'Ediciones especiales con sabores dulces'
  }
};

export function initCoffeeMenu() {
  if (!PRODUCTS) return;

  updateCategoryCounts();
  renderProducts();
  initTabs();
  initSearch();
  initBrandFilters();
}

function updateCategoryCounts() {
  ['nespresso', 'dolce-gusto', 'molido', 'saborizados'].forEach(cat => {
    const count = PRODUCTS.filter(p => p.category === cat).length;
    const el = document.getElementById(`count-${cat}`);
    if (el) el.textContent = `(${count})`;
  });
}

function initTabs() {
  document.querySelectorAll('.menu-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentCategory = tab.dataset.category;
      currentBrand = null;
      searchQuery = '';
      const searchInput = document.getElementById('searchInput');
      if (searchInput) searchInput.value = '';

      // Update tabs
      document.querySelectorAll('.menu-tab').forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });

      // Update section header
      updateSectionHeader();
      updateBrandFilters();
      renderProducts();
    });
  });
}

function updateSectionHeader() {
  const meta = CATEGORY_META[currentCategory];
  const titleEl = document.getElementById('menuSectionTitle');
  const subEl = document.getElementById('menuSectionSubtitle');
  if (titleEl && meta) titleEl.textContent = meta.title;
  if (subEl && meta) subEl.textContent = meta.subtitle;
}

function initSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = input.value.trim().toLowerCase();
      renderProducts();
    }, 200);
  });
}

function initBrandFilters() {
  updateBrandFilters();
}

function updateBrandFilters() {
  const container = document.getElementById('filterBadges');
  if (!container) return;

  const brands = [...new Set(
    PRODUCTS.filter(p => p.category === currentCategory).map(p => p.brand)
  )].sort();

  container.innerHTML = brands.map(brand => `
    <button class="filter-badge${currentBrand === brand ? ' active' : ''}" 
            data-brand="${brand}" 
            aria-pressed="${currentBrand === brand}">
      ${brand}
    </button>
  `).join('');

  container.querySelectorAll('.filter-badge').forEach(badge => {
    badge.addEventListener('click', () => {
      currentBrand = currentBrand === badge.dataset.brand ? null : badge.dataset.brand;
      container.querySelectorAll('.filter-badge').forEach(b => {
        b.classList.toggle('active', b.dataset.brand === currentBrand);
        b.setAttribute('aria-pressed', b.dataset.brand === currentBrand);
      });
      renderProducts();
    });
  });
}

function getFilteredProducts() {
  return PRODUCTS.filter(p => {
    if (p.category !== currentCategory) return false;
    if (currentBrand && p.brand !== currentBrand) return false;
    if (searchQuery) {
      const hay = [p.name, p.brand, p.origin, p.description, ...(p.tastingNotes || [])]
        .join(' ').toLowerCase();
      return hay.includes(searchQuery);
    }
    return true;
  });
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');
  if (!grid) return;

  const products = getFilteredProducts();
  
  if (products.length === 0) {
    grid.innerHTML = '';
    if (noResults) noResults.style.display = 'block';
    return;
  }

  if (noResults) noResults.style.display = 'none';

  grid.innerHTML = products.map((p, i) => `
    <article class="product-card" 
             role="listitem" 
             data-id="${p.id}" 
             tabindex="0"
             aria-label="${p.name} — ${formatPrice(p.price)}"
             style="animation-delay:${Math.min(i * 40, 600)}ms;">
      <div class="product-card__img-wrap">
        <img src="${p.image}" 
             alt="${p.name} — ${p.type}" 
             class="product-card__img" 
             loading="lazy" 
             width="150" height="150">
      </div>
      <div class="product-card__body">
        <div class="product-card__brand">${p.brand}</div>
        <div class="product-card__name">${p.shortName || p.name}</div>
        <div class="product-card__origin">📍 ${p.origin} · ${p.weight}</div>
        ${renderIntensityBar(p.intensity)}
        <div class="tasting-notes">
          ${(p.tastingNotes || []).map(n => `<span class="tasting-note">${n}</span>`).join('')}
        </div>
        <div class="product-card__footer">
          <span class="product-card__price">${formatPrice(p.price)}</span>
          <span class="product-card__detail-link">Ver detalle →</span>
        </div>
      </div>
    </article>
  `).join('');

  // Animate cards in smoothly
  requestAnimationFrame(() => {
    grid.querySelectorAll('.product-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(15px)';
      // Optimize animation loop
      requestAnimationFrame(() => {
        setTimeout(() => {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, Math.min(i * 40, 400));
      });
    });
  });

  // Add click handlers
  grid.querySelectorAll('.product-card').forEach(card => {
    const handler = () => openModal(card.dataset.id);
    card.addEventListener('click', handler);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
  });
}
