// minimal checkout logic: read site cart, allow qty changes, remove, place order (simulated)

(function () {
    const CART_KEY = 'foodsocket_cart_v1';

    function getCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; }catch{ return []; } }
    function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); window.dispatchEvent(new Event('cart-changed')); }

    const el = {
        cartItems: document.getElementById('cart-items'),
        subtotal: document.getElementById('subtotal'),
        delivery: document.getElementById('delivery'),
        grand: document.getElementById('grand-total'),
        form: document.getElementById('checkoutForm'),
        placeBtn: document.getElementById('placeOrder'),
        clearBtn: document.getElementById('clearCart'),
        msg: document.getElementById('checkout-message'),
        cardFields: document.getElementById('card-fields')
    };

    function currency(v){ return '₦' + Number(v).toLocaleString(); }

    function computeTotals(cart){
        // try to extract numeric from price strings, sum quantities
        let subtotal = 0;
        cart.forEach(i=>{
            const raw = (i.price || '').toString();
            // remove non-digits except dot
            const num = parseFloat(raw.replace(/[^\d.]/g,''));
            const q = Number(i.quantity||1);
            if (!isNaN(num)) subtotal += (num * q);
        });
        const delivery = subtotal > 0 ? 500 : 0; // simple flat delivery
        const grand = subtotal + delivery;
        return { subtotal, delivery, grand };
    }

    function render(){
        const cart = getCart();
        el.cartItems.innerHTML = '';
        if (!cart || cart.length === 0){
            el.cartItems.innerHTML = '<p class="empty">Your cart is empty.</p>';
        } else {
            cart.forEach(item=>{
                const row = document.createElement('div');
                row.className = 'cart-row';

                const img = document.createElement('img');
                img.src = item.image || 'images/placeholder.png';
                img.alt = item.name;

                const meta = document.createElement('div');
                meta.className = 'meta';

                const title = document.createElement('h4');
                title.textContent = item.name;

                const price = document.createElement('div');
                price.className = 'price';
                price.textContent = item.price || '';

                const controls = document.createElement('div');
                controls.className = 'controls';

                const qty = document.createElement('input');
                qty.type = 'number';
                qty.min = '1';
                qty.value = item.quantity || 1;
                qty.className = 'qty-input';
                qty.addEventListener('change', () => {
                    const v = Math.max(1, parseInt(qty.value) || 1);
                    qty.value = v;
                    item.quantity = v;
                    saveCart(cart);
                    updateTotals();
                });

                const remove = document.createElement('button');
                remove.className = 'remove-item';
                remove.textContent = 'Remove';
                remove.addEventListener('click', () => {
                    const idx = getCart().findIndex(c => c.name === item.name);
                    if (idx > -1){
                        const newCart = getCart();
                        newCart.splice(idx,1);
                        saveCart(newCart);
                        render();
                        updateTotals();
                    }
                });

                controls.appendChild(qty);
                controls.appendChild(remove);

                meta.appendChild(title);
                meta.appendChild(price);
                meta.appendChild(controls);

                row.appendChild(img);
                row.appendChild(meta);

                el.cartItems.appendChild(row);
            });
        }

        updateTotals();
    }

    function updateTotals(){
        const cart = getCart();
        const t = computeTotals(cart);
        el.subtotal.textContent = currency(t.subtotal);
        el.delivery.textContent = currency(t.delivery);
        el.grand.textContent = currency(t.grand);
    }

    el.clearBtn.addEventListener('click', () => {
        if (!confirm('Clear cart?')) return;
        saveCart([]);
        render();
    });

    // toggle card fields based on payment selection
    el.form.addEventListener('change', (e) => {
        const p = el.form.elements['payment'].value;
        if (p === 'card') el.cardFields.style.display = '';
        else el.cardFields.style.display = 'none';
    });

    // handle submit (simulate payment)
    el.form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        el.msg.textContent = '';
        const cart = getCart();
        if (!cart || cart.length === 0){ el.msg.style.color='red'; el.msg.textContent = 'Cart is empty.'; return; }

        // basic validation
        const fullname = el.form.elements['fullname'].value.trim();
        const phone = el.form.elements['phone'].value.trim();
        const address = el.form.elements['address'].value.trim();
        if (!fullname || !phone || !address){ el.msg.style.color='red'; el.msg.textContent = 'Please fill required shipping details.'; return; }

        el.placeBtn.disabled = true;
        el.placeBtn.textContent = 'Processing...';

        // simulate a short payment/process delay
        await new Promise(r => setTimeout(r, 1200));

        // pretend payment succeeded
        saveCart([]); // clear cart
        el.msg.style.color = 'green';
        el.msg.textContent = 'Payment successful. Order placed. Thank you!';
        render();
        el.placeBtn.textContent = 'Done';
        setTimeout(()=>{ window.location.href = 'index.html'; }, 1800);
    });

    // keep UI in sync if cart changes elsewhere
    window.addEventListener('cart-changed', render);
    window.addEventListener('storage', (e)=> { if (e.key === CART_KEY || !e.key) render(); });

    // initial render
    document.addEventListener('DOMContentLoaded', () => {
        // hide card fields if mobile transfer selected by default
        const p = document.querySelector('input[name="payment"]:checked');
        if (p && p.value !== 'card') document.getElementById('card-fields').style.display = 'none';
        render();
    });
})();