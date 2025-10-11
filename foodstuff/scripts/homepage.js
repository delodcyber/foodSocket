// Robust responsive menu toggle (breakpoint = 880px)
document.addEventListener('DOMContentLoaded', () => {
  const MOBILE_BREAK = 880;
  const menu = document.querySelector('.menu');
  if (!menu) return;

  let toggle = menu.querySelector('.menu-toggle');
  const ul = menu.querySelector('ul');

  // create a visible toggle if missing
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'menu-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', ul ? ul.id || 'main-nav-list' : '');
    toggle.setAttribute('aria-label', 'Toggle menu');
    toggle.innerHTML = `
      <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true" focusable="false">
        <rect width="22" height="2" y="0" rx="1"></rect>
        <rect width="22" height="2" y="7" rx="1"></rect>
        <rect width="22" height="2" y="14" rx="1"></rect>
      </svg>
    `;
    // insert before UL so button is always in DOM near menu
    if (ul) menu.insertBefore(toggle, ul);
    else menu.appendChild(toggle);
  }

  // ensure toggle not hidden by JS from other scripts
  toggle.style.display = window.innerWidth <= MOBILE_BREAK ? '' : 'none';

  function openMenu() {
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKeyDown);
  }
  function closeMenu() {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', onDocClick);
    document.removeEventListener('keydown', onKeyDown);
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });

  function onDocClick(e) {
    if (!menu.contains(e.target)) closeMenu();
  }
  function onKeyDown(e) {
    if (e.key === 'Escape') closeMenu();
  }

  if (ul) {
    ul.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      if (window.innerWidth <= MOBILE_BREAK) closeMenu();
    });
  }

  // keep toggle visible state in sync while resizing
  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      if (window.innerWidth <= MOBILE_BREAK) {
        toggle.style.display = '';
      } else {
        toggle.style.display = 'none';
        closeMenu();
      }
    }, 120);
  });
});



// Adds an accessible account dropdown to .profile-auth (injects arrow + menu)
document.addEventListener('DOMContentLoaded', () => {
  const profile = document.querySelector('.profile-auth');
  if (!profile) return;

  // keep idempotent
  if (profile.dataset.accountEnhanced === '1') return;
  profile.dataset.accountEnhanced = '1';

  // find existing link (if present) to keep image/text
  const anchor = profile.querySelector('a') || null;

  // build toggle button (wrap existing anchor if present)
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'account-toggle';
  toggle.setAttribute('aria-haspopup', 'true');
  toggle.setAttribute('aria-expanded', 'false');

  // preserve anchor contents (image + span) inside the button for consistent visuals
  if (anchor) {
    // move anchor children into button
    while (anchor.firstChild) toggle.appendChild(anchor.firstChild);
    // remove original anchor element
    anchor.remove();
  } else {
    // fallback placeholder
    const img = document.createElement('img');
    img.src = 'images/profile2.png';
    img.alt = 'Account';
    img.className = 'icon-img';
    const span = document.createElement('span');
    span.textContent = 'Account';
    toggle.appendChild(img);
    toggle.appendChild(span);
  }

  // arrow
  const arrow = document.createElement('span');
  arrow.className = 'arrow';
  arrow.innerHTML = '&#9662;'; // down-pointing small triangle
  toggle.appendChild(arrow);

  // create dropdown panel
  const dropdown = document.createElement('div');
  dropdown.className = 'account-dropdown';
  dropdown.setAttribute('role', 'menu');

  // items
  const login = document.createElement('a');
  login.className = 'item';
  login.href = 'login.html';
  login.setAttribute('role', 'menuitem');
  login.textContent = 'Sign in';

  const signup = document.createElement('a');
  signup.className = 'item';
  signup.href = 'sign-up.html';
  signup.setAttribute('role', 'menuitem');
  signup.textContent = 'Create account';

  const hrNote = document.createElement('div');
  hrNote.className = 'note';
  hrNote.textContent = 'Access orders, saved items and faster checkout.';

  dropdown.appendChild(login);
  dropdown.appendChild(signup);
  dropdown.appendChild(hrNote);

  // append to profile container
  profile.appendChild(toggle);
  profile.appendChild(dropdown);

  // toggle handlers
  function openMenu() {
    profile.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    // focus first actionable item
    login.focus();
    // listen for outside clicks and ESC
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKeyDown);
  }
  function closeMenu() {
    profile.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', onDocClick);
    document.removeEventListener('keydown', onKeyDown);
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (profile.classList.contains('open')) closeMenu();
    else openMenu();
  });

  // close when clicking outside
  function onDocClick(e) {
    if (!profile.contains(e.target)) closeMenu();
  }
  // close with ESC
  function onKeyDown(e) {
    if (e.key === 'Escape') closeMenu();
  }

  // close when a dropdown link is used (let navigation proceed)
  dropdown.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    // allow navigation then close
    closeMenu();
  });

  // accessibility: allow toggle via Enter/Space (button already does)
});