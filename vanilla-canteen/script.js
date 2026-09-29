/**
 * CampusBites - Standalone Vanilla JavaScript Core
 *
 * Designed with clean reusable functions and LocalStorage persistence.
 * Ready for future Java Spring Boot REST API integration (see API_BASE_URL below).
 */

// Configuration & Future Backend Hook
const API_CONFIG = {
  USE_BACKEND: false, // Set to true when Spring Boot is running
  BASE_URL: 'http://localhost:8080/api/v1',
};

// Canteen Menu Data
const MENU_DATA = [
  { id: '1', name: 'Crispy Masala Dosa', category: 'breakfast', price: 60, isVeg: true, rating: 4.9, time: '8-10m', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500' },
  { id: '2', name: 'Steamed Idli Sambar', category: 'breakfast', price: 45, isVeg: true, rating: 4.7, time: '5m', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500' },
  { id: '3', name: 'Veg Fried Rice', category: 'lunch', price: 85, isVeg: true, rating: 4.8, time: '12m', img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500' },
  { id: '4', name: 'Chicken Fried Rice', category: 'lunch', price: 130, isVeg: false, rating: 4.9, time: '15m', img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500' },
  { id: '5', name: 'Veg Hakka Noodles', category: 'lunch', price: 80, isVeg: true, rating: 4.6, time: '10m', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500' },
  { id: '6', name: 'Crispy Punjabi Samosa', category: 'snacks', price: 35, isVeg: true, rating: 4.8, time: '5m', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500' },
  { id: '7', name: 'Paneer Burger', category: 'snacks', price: 90, isVeg: true, rating: 4.7, time: '10m', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500' },
  { id: '8', name: 'Peri-Peri French Fries', category: 'snacks', price: 65, isVeg: true, rating: 4.6, time: '8m', img: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500' },
  { id: '9', name: 'Adrak Masala Chai', category: 'beverages', price: 20, isVeg: true, rating: 4.9, time: '3m', img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500' },
  { id: '10', name: 'South Indian Filter Coffee', category: 'beverages', price: 25, isVeg: true, rating: 4.9, time: '4m', img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500' },
  { id: '11', name: 'Fresh Watermelon Juice', category: 'beverages', price: 45, isVeg: true, rating: 4.7, time: '5m', img: 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=500' },
  { id: '12', name: 'Belgian Chocolate Scoop', category: 'desserts', price: 50, isVeg: true, rating: 4.9, time: '2m', img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500' }
];

// LocalStorage State Keys
const STORAGE = {
  CART: 'cb_vanilla_cart',
  FAVORITES: 'cb_vanilla_favs',
  ORDERS: 'cb_vanilla_orders',
  THEME: 'cb_vanilla_theme'
};

// Application State
let appState = {
  cart: JSON.parse(localStorage.getItem(STORAGE.CART)) || [],
  favorites: JSON.parse(localStorage.getItem(STORAGE.FAVORITES)) || ['1', '6', '9'],
  orders: JSON.parse(localStorage.getItem(STORAGE.ORDERS)) || [],
  selectedCategory: 'all',
  searchQuery: '',
  appliedCoupon: null
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  updateCartUI();
  setupEventListeners();
  initTheme();
});

// --- Theme Management ---
function initTheme() {
  const saved = localStorage.getItem(STORAGE.THEME) || 'light';
  document.documentElement.setAttribute('data-theme', saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(STORAGE.THEME, next);
}

// --- Menu Rendering ---
function renderMenu() {
  const container = document.getElementById('food-grid');
  if (!container) return;

  const filtered = MENU_DATA.filter(item => {
    const matchesCat = appState.selectedCategory === 'all' || item.category === appState.selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(appState.searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  container.innerHTML = filtered.map(item => `
    <div class="food-card">
      <img src="${item.img}" alt="${item.name}" loading="lazy">
      <div class="food-card-body">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <span class="${item.isVeg ? 'veg-dot' : 'nonveg-dot'}"></span>
            <span style="font-size:11px; color:var(--text-muted);">★ ${item.rating} (${item.time})</span>
          </div>
          <h3 class="food-name">${item.name}</h3>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
          <span class="food-price">₹${item.price}</span>
          <button class="btn-primary" onclick="addToCart('${item.id}')">Add +</button>
        </div>
      </div>
    </div>
  `).join('');
}

// --- Cart Operations ---
function addToCart(itemId) {
  const item = MENU_DATA.find(i => i.id === itemId);
  if (!item) return;

  const existing = appState.cart.find(c => c.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    appState.cart.push({ ...item, qty: 1 });
  }

  saveCart();
  updateCartUI();
  toggleCartDrawer(true);
}

function updateCartQty(itemId, delta) {
  const item = appState.cart.find(c => c.id === itemId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    appState.cart = appState.cart.filter(c => c.id !== itemId);
  }

  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem(STORAGE.CART, JSON.stringify(appState.cart));
}

function updateCartUI() {
  const badge = document.getElementById('cart-count');
  const count = appState.cart.reduce((s, i) => s + i.qty, 0);
  if (badge) badge.innerText = count;

  const cartList = document.getElementById('cart-items-list');
  const totalEl = document.getElementById('cart-grand-total');

  if (cartList) {
    if (appState.cart.length === 0) {
      cartList.innerHTML = '<p style="text-align:center; padding:30px; color:var(--text-muted)">Your tray is empty!</p>';
    } else {
      cartList.innerHTML = appState.cart.map(c => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <strong>${c.name}</strong><br>
            <small style="color:var(--text-muted)">₹${c.price} x ${c.qty} = ₹${c.price * c.qty}</small>
          </div>
          <div>
            <button onclick="updateCartQty('${c.id}', -1)">-</button>
            <span style="margin:0 8px">${c.qty}</span>
            <button onclick="updateCartQty('${c.id}', 1)">+</button>
          </div>
        </div>
      `).join('');
    }
  }

  const subtotal = appState.cart.reduce((s, i) => s + i.price * i.qty, 0);
  if (totalEl) totalEl.innerText = '₹' + subtotal;
}

function toggleCartDrawer(open) {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) {
    if (open) drawer.classList.add('open');
    else drawer.classList.remove('open');
  }
}

// --- Event Listeners Setup ---
function setupEventListeners() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      appState.searchQuery = e.target.value;
      renderMenu();
    });
  }

  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      appState.selectedCategory = tab.dataset.category;
      renderMenu();
    });
  });
}
