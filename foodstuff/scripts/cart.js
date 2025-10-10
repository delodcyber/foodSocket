(function () {
    const KEY = 'foodsocket_cart_v1';

    function cartKey() { return KEY; }
    function getCart() {
        try { const raw = localStorage.getItem(cartKey()); return raw ? JSON.parse(raw) : []; }
        catch { return []; }
    }
    function saveCart(cart) {
        try { localStorage.setItem(cartKey(), JSON.stringify(cart)); }
        catch (e) { console.error('cart save failed', e); }
        window.dispatchEvent(new Event('cart-changed'));
    }

    function injectStyles() {
        if (document.getElementById('site-cart-styles')) return;
        const css = `
.cart-indicator{position:relative;display:inline-block;margin-left:12px;cursor:pointer}
.cart-icon{font-size:18px;display:inline-block}
.cart-count{background:red;color:#fff;border-radius:50%;padding:2px 6px;font-size:12px;margin-left:6px;display:inline-block}
.cart-overlay{position:fixed;right:16px;top:60px;width:320px;max-height:70vh;overflow:auto;background:#fff;border:1px solid #ddd;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,0.12);z-index:9999;padding:12px}
.cart-overlay h3{margin-top:0}
.cart-row{display:flex;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid #f0f0f0}
.cart-row-img{width:48px;height:48px;object-fit:cover;border-radius:6px}
.cart-info{flex:1}
.cart-remove-btn{background:#f44336;color:#fff;border:none;padding:6px 8px;border-radius:4px;cursor:pointer}
.cart-clear-btn{margin-top:8px;background:#555;color:#fff;padding:8px 10px;border-radius:6px;border:none;cursor:pointer}
.cart-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.22);z-index:9998;}
`;
        const s = document.createElement('style');
        s.id = 'site-cart-styles';
        s.textContent = css;
        document.head.appendChild(s);
    }

    function ensureIndicator() {
        if (document.querySelector('.cart-indicator')) return;
        const header = document.querySelector('header') || document.body;
        const target = header.querySelector('.auth-links') || header.querySelector('.header-upper') || header;

        const indicator = document.createElement('div');
        indicator.className = 'cart-indicator';
        indicator.setAttribute('aria-live', 'polite');

        const icon = document.createElement('span');
        icon.className = 'cart-icon';
        icon.textContent = '🛒';

        const badge = document.createElement('span');
        badge.className = 'cart-count';
        badge.textContent = '0';

        indicator.appendChild(icon);
        indicator.appendChild(badge);

        indicator.addEventListener('click', (e) => {
            e.preventDefault();
            toggleOverlay();
        });

        target.appendChild(indicator);
        updateIndicator();
    }

    function updateIndicator() {
        const indicator = document.querySelector('.cart-indicator');
        if (!indicator) return;
        const badge = indicator.querySelector('.cart-count');
        const cart = getCart();
        const total = cart.reduce((s, i) => s + (i.quantity || 0), 0);
        badge.textContent = total.toString();
    }

    // overlay handlers (kept references to remove later)
    let docClickHandler = null;
    let keydownHandler = null;

    function addOverlayListeners(overlay, backdrop) {
        // small delay so the click that opened the overlay doesn't immediately close it
        setTimeout(() => {
            docClickHandler = (evt) => {
                // if click is outside overlay (and outside indicator), close
                if (!overlay.contains(evt.target) && !document.querySelector('.cart-indicator')?.contains(evt.target)) {
                    removeOverlay();
                }
            };
            document.addEventListener('click', docClickHandler);

            keydownHandler = (evt) => {
                if (evt.key === 'Escape') removeOverlay();
            };
            document.addEventListener('keydown', keydownHandler);
        }, 0);

        // stop clicks inside overlay from bubbling to document (prevents immediate close)
        overlay.addEventListener('click', (e) => e.stopPropagation());
        if (backdrop) {
            backdrop.addEventListener('click', () => removeOverlay());
        }
    }

    function removeOverlayListeners() {
        if (docClickHandler) {
            document.removeEventListener('click', docClickHandler);
            docClickHandler = null;
        }
        if (keydownHandler) {
            document.removeEventListener('keydown', keydownHandler);
            keydownHandler = null;
        }
    }

    function toggleOverlay() {
        const existing = document.querySelector('.cart-overlay');
        if (existing) { removeOverlay(); return; }
        buildAndShowOverlay();
    }

    function removeOverlay() {
        const existing = document.querySelector('.cart-overlay');
        const backdrop = document.querySelector('.cart-backdrop');
        if (existing) existing.remove();
        if (backdrop) backdrop.remove();
        removeOverlayListeners();
    }

    function buildAndShowOverlay() {
        // add backdrop for visual and to capture clicks
        const backdrop = document.createElement('div');
        backdrop.className = 'cart-backdrop';
        document.body.appendChild(backdrop);

        const overlay = document.createElement('div');
        overlay.className = 'cart-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');

        const title = document.createElement('h3');
        title.textContent = 'Cart';
        overlay.appendChild(title);

        const cart = getCart();
        if (!cart || cart.length === 0) {
            const empty = document.createElement('p');
            empty.textContent = 'Your cart is empty.';
            overlay.appendChild(empty);
        } else {
            cart.forEach(item => {
                const row = document.createElement('div');
                row.className = 'cart-row';

                const img = document.createElement('img');
                img.src = item.image || 'images/placeholder.png';
                img.alt = item.name;
                img.className = 'cart-row-img';

                const info = document.createElement('div');
                info.className = 'cart-info';

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
                removeBtn.className = 'cart-remove-btn';
                removeBtn.textContent = 'Remove';
                removeBtn.addEventListener('click', () => {
                    removeFromCart(item.name);
                    removeOverlay();
                });

                row.appendChild(img);
                row.appendChild(info);
                row.appendChild(removeBtn);
                overlay.appendChild(row);
            });

            const clear = document.createElement('button');
            clear.className = 'cart-clear-btn';
            clear.textContent = 'Clear cart';
            clear.addEventListener('click', () => {
                saveCart([]);
                removeOverlay();
            });
            overlay.appendChild(clear);
        }

        document.body.appendChild(overlay);
        addOverlayListeners(overlay, backdrop);
    }

    function removeFromCart(name) {
        const cart = getCart().filter(i => i.name !== name);
        saveCart(cart);
        updateIndicator();
        const btn = document.querySelector(`.add-to-cart[data-product-name="${CSS.escape(name)}"]`);
        if (btn) { btn.disabled = false; btn.textContent = 'Add to cart'; }
    }

    window.addEventListener('storage', (e) => {
        if (e.key === cartKey() || !e.key) updateIndicator();
    });

    window.addEventListener('cart-changed', () => updateIndicator());

    document.addEventListener('DOMContentLoaded', () => {
        injectStyles();
        ensureIndicator();
    });

    window.siteCart = {
        key: cartKey,
        getCart,
        saveCart,
        updateIndicator,
        toggleOverlay,
        removeFromCart
    };
})();