document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const pw = document.getElementById('password');
  const confirm = document.getElementById('confirm');
  const msg = document.getElementById('formMsg');
  const strengthBar = document.querySelector('#pwStrength .meter span');
  const strengthText = document.getElementById('strengthText');
  const toggle = document.getElementById('togglePw');

  function calcStrength(s) {
    let score = 0;
    if (s.length >= 8) score += 1;
    if (/[A-Z]/.test(s)) score += 1;
    if (/[0-9]/.test(s)) score += 1;
    if (/[^A-Za-z0-9]/.test(s)) score += 1;
    return score; // 0..4
  }

  pw.addEventListener('input', () => {
    const s = calcStrength(pw.value);
    const percent = (s / 4) * 100;
    strengthBar.style.width = percent + '%';
    const labels = ['Too weak', 'Weak', 'Okay', 'Good', 'Strong'];
    strengthText.textContent = labels[s] + (s < 3 ? ' — use 8+ chars & numbers' : '');
  });

  toggle.addEventListener('click', () => {
    pw.type = pw.type === 'password' ? 'text' : 'password';
    toggle.textContent = pw.type === 'password' ? '👁️' : '🙈';
  });

  function loadUsers() {
    try { return JSON.parse(localStorage.getItem('foodsocket_users') || '[]'); }
    catch { return []; }
  }
  function saveUsers(u) { localStorage.setItem('foodsocket_users', JSON.stringify(u)); }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    msg.textContent = '';
    const name = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const phone = document.getElementById('phone').value.trim();
    const pass = pw.value;
    const conf = confirm.value;

    if (!name || !email || !pass || !conf) {
      msg.style.color = 'crimson'; msg.textContent = 'Please fill all required fields.'; return;
    }
    if (pass !== conf) {
      msg.style.color = 'crimson'; msg.textContent = 'Passwords do not match.'; return;
    }
    if (calcStrength(pass) < 2) {
      msg.style.color = 'crimson'; msg.textContent = 'Password too weak.'; return;
    }

    const users = loadUsers();
    if (users.find(u => u.email === email)) {
      msg.style.color = 'crimson'; msg.textContent = 'An account with that email already exists.'; return;
    }

    users.push({ name, email, phone, createdAt: Date.now() });
    saveUsers(users);

    // store a simple session token
    localStorage.setItem('foodsocket_session', JSON.stringify({ email, name, loggedAt: Date.now() }));

    msg.style.color = 'green';
    msg.textContent = 'Account created. Redirecting…';
    // briefly animate then go to products
    setTimeout(() => window.location.href = 'product.html', 900);
  });
});