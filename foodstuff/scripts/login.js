document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const emailEl = document.getElementById('email');
  const pwEl = document.getElementById('password');
  const msg = document.getElementById('formMsg');
  const toggle = document.getElementById('togglePw');

  if (toggle && pwEl) {
    toggle.addEventListener('click', () => {
      pwEl.type = pwEl.type === 'password' ? 'text' : 'password';
      toggle.textContent = pwEl.type === 'password' ? '👁️' : '🙈';
    });
  }

  function loadUsers() {
    try { return JSON.parse(localStorage.getItem('foodsocket_users') || '[]'); }
    catch { return []; }
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (msg) msg.textContent = '';

      const email = (emailEl?.value || '').trim().toLowerCase();
      const password = pwEl?.value || '';

      if (!email) {
        if (msg) { msg.style.color = 'crimson'; msg.textContent = 'Please enter your email.'; }
        return;
      }

      const users = loadUsers();
      const user = users.find(u => u.email === email);

      if (!user) {
        if (msg) { msg.style.color = 'crimson'; msg.textContent = 'No account found with that email. Please create an account.'; }
        return;
      }

      // note: signup currently does not store passwords — authenticate by email presence
      localStorage.setItem('foodsocket_session', JSON.stringify({ email: user.email, name: user.name, loggedAt: Date.now() }));

      if (msg) { msg.style.color = 'green'; msg.textContent = 'Signed in. Redirecting…'; }

      const remember = document.getElementById('remember')?.checked;
      if (!remember) {
        const session = JSON.parse(localStorage.getItem('foodsocket_session') || '{}');
        localStorage.removeItem('foodsocket_session');
        sessionStorage.setItem('foodsocket_session', JSON.stringify(session));
      }

      window.dispatchEvent(new Event('user-signed-in'));

      setTimeout(() => window.location.href = 'product.html', 700);
    });
  }
});