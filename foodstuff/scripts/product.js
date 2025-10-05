// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
    attachJsonsToCategories();
});

async function attachJsonsToCategories() {
    const container = document.querySelector('.product-items');
    if (!container) return;

    const headings = Array.from(container.querySelectorAll('h2'));
    for (const h of headings) {
        const cards = findNextCards(h);
        if (!cards) continue;

        cards.innerHTML = '<p class="loading">Loading…</p>';

        const raw = (h.textContent || '').trim();
        const key = normalizeCategory(raw);

        const filename = resolveFilenameForCategory(key);
        if (!filename) {
            cards.innerHTML = `<p class="error">No JSON mapping for "${raw}".</p>`;
            continue;
        }

        const pathsToTry = unique([`jsons/${filename}`, `./jsons/${filename}`, `../jsons/${filename}`]);
        let loaded = false;
        let lastErr = null;

        for (const p of pathsToTry) {
            try {
                const res = await fetch(p);
                if (!res.ok) { lastErr = new Error(`${res.status} ${res.statusText}`); continue; }
                const data = await res.json();
                const products = extractProductsArray(data);
                renderCards(products, cards);
                loaded = true;
                break;
            } catch (err) {
                lastErr = err;
            }
        }

        if (!loaded) {
            cards.innerHTML = `<p class="error">Failed to load products for "${raw}".</p>`;
            console.warn('Load failed for', raw, lastErr);
        }
    }
}

function findNextCards(h2) {
    let el = h2.nextElementSibling;
    while (el) {
        if (el.classList && el.classList.contains('cards')) return el;
        el = el.nextElementSibling;
    }
    return null;
}

function normalizeCategory(text) {
    if (!text) return '';
    // remove the word "category" and parentheses, keep words
    return text
        .replace(/category/ig, '')
        .replace(/[()]/g, '')
        .trim()
        .toLowerCase();
}

function resolveFilenameForCategory(normalized) {
    // common known mappings (explicit)
    const map = {
        'rice': 'rice.json',
        'beans': 'beans.json',
        'gaari': 'garri.json',   // handle spelling differences
        'garri': 'garri.json',
        'palm oil': 'palm-oil.json',
        'palm-oil': 'palm-oil.json',
        'palm': 'palm-oil.json',
        'vegetable oil': 'vegetable-oil.json',
        'vegetable-oil': 'vegetable-oil.json',
        'vegetable': 'vegetable-oil.json',
        'spaghetti/pasta': 'spaghetti-pasta.json',
        'spaghetti pasta': 'spaghetti-pasta.json',
        'spaghetti-pasta': 'spaghetti-pasta.json',
        'grinded pepper': 'grinded-pepper.json',
        'grinded-pepper': 'grinded-pepper.json',
        'grindedpepper': 'grinded-pepper.json',
        'grinded': 'grinded-pepper.json'
    };

    if (map[normalized]) return map[normalized];

    // try variants: take first word, hyphenate, remove spaces
    const firstWord = normalized.split(/\s+/)[0];
    const hyphen = normalized.replace(/\s+/g, '-');
    const compact = normalized.replace(/\s+/g, '');

    if (map[firstWord]) return map[firstWord];
    if (map[hyphen]) return map[hyphen];
    if (map[compact]) return map[compact];

    // fallback: assume filename equals normalized words joined with '-' + .json
    const guess = `${hyphen}.json`;
    return guess;
}

function extractProductsArray(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;

    // common known keys:
    const candidates = ['products','beans','gaari','gaari','palmOil','palmOil','vegetableOil','spaghettiPasta','grindedPepper','grindedPepper'];
    for (const k of candidates) {
        if (Array.isArray(data[k])) return data[k];
    }

    // otherwise return first array value found in object
    for (const v of Object.values(data)) {
        if (Array.isArray(v)) return v;
    }

    return [];
}

function renderCards(products, container) {
    container.innerHTML = '';
    if (!products || products.length === 0) {
        container.innerHTML = '<p class="empty">No products available.</p>';
        return;
    }

    const list = document.createElement('div');
    list.className = 'cards-list';
    products.forEach(p => {
        const card = document.createElement('article');
        card.className = 'product-card';

        const img = document.createElement('img');
        img.className = 'product-image';
        img.src = p.image ? `images/${p.image}` : 'images/placeholder.png';
        img.alt = p.productName || p.productname || p.name || 'product';
        img.loading = 'lazy';

        const info = document.createElement('div');
        info.className = 'product-info';

        const title = document.createElement('h3');
        title.textContent = p.productName || p.productname || p.name || '';

        const kongo = document.createElement('p');
        kongo.className = 'kongo-price';
        kongo.innerHTML = p.kongoPrice || p.kongoprice || '';

        const bag = document.createElement('p');
        bag.className = 'bag-price';
        bag.textContent = p.bagPrice ? p.bagPrice : (p.bagprice || '');

        const weight = document.createElement('p');
        weight.className = 'bag-weight';
        weight.textContent = p.bagWeight || p.bagweight || '';

        info.appendChild(title);
        if (kongo.textContent || kongo.innerHTML) info.appendChild(kongo);
        if (bag.textContent) info.appendChild(bag);
        if (weight.textContent) info.appendChild(weight);

        card.appendChild(img);
        card.appendChild(info);
        list.appendChild(card);
    });

    container.appendChild(list);
}

function unique(arr) {
    return Array.from(new Set(arr.filter(Boolean)));
}
// ...existing code...
// ...existing code...
function renderCards(products, container) {
    container.innerHTML = '';
    if (!products || products.length === 0) {
        container.innerHTML = '<p class="empty">No products available.</p>';
        return;
    }

    const list = document.createElement('div');
    list.className = 'cards-list';
    products.forEach(p => {
        const card = document.createElement('article');
        card.className = 'product-card';

        const img = document.createElement('img');
        img.className = 'product-image';
        img.src = p.image ? `images/${p.image}` : 'images/placeholder.png';
        img.alt = p.productName || p.productname || p.name || 'product';
        img.loading = 'lazy';

        const info = document.createElement('div');
        info.className = 'product-info';

        const title = document.createElement('h3');
        title.textContent = p.productName || p.productname || p.name || '';

        const kongo = document.createElement('p');
        kongo.className = 'kongo-price';
        kongo.innerHTML = p.kongoPrice || p.kongoprice || '';

        const bag = document.createElement('p');
        bag.className = 'bag-price';
        bag.textContent = p.bagPrice ? p.bagPrice : (p.bagprice || '');

        const weight = document.createElement('p');
        weight.className = 'bag-weight';
        weight.textContent = p.bagWeight || p.bagweight || '';

        // Add to Cart button (only if there's a price)
        const priceValue = getPrimaryPrice(p);
        const btn = document.createElement('button');
        btn.className = 'add-to-cart';
        btn.type = 'button';
        btn.textContent = priceValue ? 'Add to cart' : 'No price';
        btn.disabled = !priceValue;
        btn.setAttribute('data-product-name', (p.productName || p.productname || p.name || '').toString());

        if (priceValue) {
            // restore state if already in cart
            const already = isInCart(p);
            if (already) {
                btn.textContent = `Added (${already.quantity})`;
                btn.disabled = true;
            }

            btn.addEventListener('click', () => {
                addToCartFromProduct(p);
                btn.textContent = 'Added';
                btn.disabled = true;
            });
        }

        info.appendChild(title);
        if (kongo.textContent || kongo.innerHTML) info.appendChild(kongo);
        if (bag.textContent) info.appendChild(bag);
        if (weight.textContent) info.appendChild(weight);
        info.appendChild(btn);

        card.appendChild(img);
        card.appendChild(info);
        list.appendChild(card);
    });

    container.appendChild(list);

    // ensure cart indicator exists and is updated
    ensureCartIndicator();
    updateCartIndicator();
}
// ...existing code...

// Cart helpers (added)
function getPrimaryPrice(p) {
    // prefer kongoPrice then bagPrice; return decoded text or null
    const raw = p.kongoPrice || p.kongoprice || p.bagPrice || p.bagprice || null;
    if (!raw) return null;
    return decodeHtml(raw).trim();
}

function decodeHtml(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value || txt.textContent || '';
}

function cartKey() {
    return 'foodsocket_cart_v1';
}

function getCart() {
    try {
        const raw = localStorage.getItem(cartKey());
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem(cartKey(), JSON.stringify(cart));
    } catch (e) {
        console.error('Failed to save cart', e);
    }
}

function isInCart(product) {
    const name = (product.productName || product.productname || product.name || '').toString();
    if (!name) return false;
    const cart = getCart();
    return cart.find(i => i.name === name) || false;
}

function addToCartFromProduct(product) {
    const name = (product.productName || product.productname || product.name || '').toString();
    if (!name) return;

    const image = product.image ? `images/${product.image}` : null;
    const price = getPrimaryPrice(product) || '';
    const weight = product.bagWeight || product.bagweight || '';

    const cart = getCart();
    const existing = cart.find(i => i.name === name);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({
            name,
            price,
            image,
            weight,
            quantity: 1,
            addedAt: Date.now()
        });
    }
    saveCart(cart);
    updateCartIndicator();
}

// Cart indicator (badge in header)
function ensureCartIndicator() {
    let indicator = document.querySelector('.cart-indicator');
    if (indicator) return;

    // Prefer inserting into header .auth-links, fallback to header
    const header = document.querySelector('header') || document.body;
    const target = header.querySelector('.auth-links') || header.querySelector('.header-upper') || header;

    indicator = document.createElement('div');
    indicator.className = 'cart-indicator';
    indicator.setAttribute('aria-live', 'polite');
    indicator.style.cssText = 'position:relative;display:inline-block;margin-left:12px;';

    const icon = document.createElement('span');
    icon.className = 'cart-icon';
    icon.textContent = '🛒';
    icon.style.cssText = 'font-size:18px;display:inline-block;';

    const badge = document.createElement('span');
    badge.className = 'cart-count';
    badge.textContent = '0';
    badge.style.cssText = 'background:red;color:white;border-radius:50%;padding:2px 6px;font-size:12px;margin-left:6px;';

    indicator.appendChild(icon);
    indicator.appendChild(badge);

    // click opens a simple cart overlay
    indicator.addEventListener('click', (e) => {
        e.preventDefault();
        showCartOverlay();
    });

    target.appendChild(indicator);
}

function updateCartIndicator() {
    const indicator = document.querySelector('.cart-indicator');
    if (!indicator) return;
    const badge = indicator.querySelector('.cart-count');
    const cart = getCart();
    const total = cart.reduce((s, i) => s + (i.quantity || 0), 0);
    badge.textContent = total.toString();
}

// Simple cart overlay
function showCartOverlay() {
    // remove existing
    let overlay = document.querySelector('.cart-overlay');
    if (overlay) {
        overlay.remove();
        return;
    }

    overlay = document.createElement('div');
    overlay.className = 'cart-overlay';
    overlay.style.cssText = 'position:fixed;right:16px;top:60px;width:320px;max-height:70vh;overflow:auto;background:#fff;border:1px solid #ddd;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,0.12);z-index:9999;padding:12px;';

    const title = document.createElement('h3');
    title.textContent = 'Cart';
    title.style.marginTop = '0';
    overlay.appendChild(title);

    const cart = getCart();
    if (!cart || cart.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'Your cart is empty.';
        overlay.appendChild(empty);
    } else {
        cart.forEach(item => {
            const row = document.createElement('div');
            row.style.cssText = 'display:flex;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid #f0f0f0;';

            const img = document.createElement('img');
            img.src = item.image || 'images/placeholder.png';
            img.alt = item.name;
            img.style.cssText = 'width:48px;height:48px;object-fit:cover;border-radius:6px;';

            const info = document.createElement('div');
            info.style.flex = '1';

            const nm = document.createElement('div');
            nm.textContent = item.name;
            nm.style.fontWeight = '600';

            const pr = document.createElement('div');
            pr.textContent = item.price || '';

            const qty = document.createElement('div');
            qty.textContent = `Qty: ${item.quantity || 1}`;

            info.appendChild(nm);
            if (pr.textContent) info.appendChild(pr);
            info.appendChild(qty);

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.style.cssText = 'background:#f44336;color:#fff;border:none;padding:6px 8px;border-radius:4px;cursor:pointer;';
            removeBtn.addEventListener('click', () => {
                removeFromCart(item.name);
                overlay.remove();
                ensureCartIndicator();
                updateCartIndicator();
            });

            row.appendChild(img);
            row.appendChild(info);
            row.appendChild(removeBtn);
            overlay.appendChild(row);
        });

        const clear = document.createElement('button');
        clear.textContent = 'Clear cart';
        clear.style.cssText = 'margin-top:8px;background:#555;color:#fff;padding:8px 10px;border-radius:6px;border:none;cursor:pointer;';
        clear.addEventListener('click', () => {
            saveCart([]);
            overlay.remove();
            updateCartIndicator();
        });
        overlay.appendChild(clear);
    }

    document.body.appendChild(overlay);
}

function removeFromCart(name) {
    const cart = getCart().filter(i => i.name !== name);
    saveCart(cart);
    updateCartIndicator();

    // re-enable Add buttons for that product if present
    const btn = document.querySelector(`.add-to-cart[data-product-name="${CSS.escape(name)}"]`);
    if (btn) {
        btn.disabled = false;
        btn.textContent = 'Add to cart';
    }
}
// ...existing code...