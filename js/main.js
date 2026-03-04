/* ══════════════════════════════════════════════════════════
   h4rj1nd3r51ngh — Terminal Portfolio JS
   ══════════════════════════════════════════════════════════ */

'use strict';

// ── State ────────────────────────────────
const state = {
  theme: 'matrix',
  themes: ['matrix', 'cyber', 'blood', 'ghost'],
  cliOpen: false,
  hackerOn: false,
  gKey: false,
  cliHistory: [],
  cliHistIdx: -1,
};

// ── Utilities ────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── WELCOME MODAL ────────────────────────
const welcomeModal = $('#welcome-modal');
const modalClose   = $('#modal-close');
modalClose?.addEventListener('click', () => {
  welcomeModal.style.animation = 'none';
  welcomeModal.style.opacity = '0';
  welcomeModal.style.transition = 'opacity 0.3s';
  setTimeout(() => welcomeModal.classList.add('hidden'), 300);
});

// ── SHORTCUTS MODAL ──────────────────────
const shortcutsModal = $('#shortcuts-modal');
$('#close-shortcuts')?.addEventListener('click', () => shortcutsModal.classList.add('hidden'));

// ── NAVBAR ───────────────────────────────
const navbar    = $('#navbar');
const navLinks  = $('#nav-links');
const navBurger = $('#nav-burger');

navBurger?.addEventListener('click', () => navLinks.classList.toggle('open'));
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) navLinks.classList.remove('open');
});

// Active link on scroll
const sectionEls = $$('section[id]');
const updateActiveNav = () => {
  const scrollY = window.scrollY + 100;
  sectionEls.forEach(s => {
    const link = $(`a[href="#${s.id}"]`, navLinks);
    if (!link) return;
    if (s.offsetTop <= scrollY && s.offsetTop + s.offsetHeight > scrollY)
      link.classList.add('active');
    else
      link.classList.remove('active');
  });
};

// Status bar
const sectionDisplay = $('#section-display');
const scrollPct      = $('#scroll-pct');
const updateStatusBar = () => {
  const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100) || 0;
  scrollPct.textContent = pct + '%';
  const scrollY = window.scrollY + 120;
  for (const s of sectionEls) {
    if (s.offsetTop <= scrollY && s.offsetTop + s.offsetHeight > scrollY) {
      sectionDisplay.textContent = s.id;
      break;
    }
  }
};

window.addEventListener('scroll', () => { updateActiveNav(); updateStatusBar(); }, { passive: true });

// ── THEME CYCLING ────────────────────────
const themeBtn = $('#theme-btn');
const cycleTheme = () => {
  const idx = state.themes.indexOf(state.theme);
  state.theme = state.themes[(idx + 1) % state.themes.length];
  document.documentElement.setAttribute('data-theme', state.theme);
  themeBtn.textContent = `[${state.theme}]`;
};
themeBtn?.addEventListener('click', cycleTheme);

// ── TYPEWRITER ───────────────────────────
const typewriterEl = $('#typewriter');
const roles = [
  'Penetration Tester',
  'Security Analyst',
  'CTF Player',
  'Red Team Enthusiast',
  'Ethical Hacker',
];
let roleIdx = 0, charIdx = 0, deleting = false;

const tick = async () => {
  const role = roles[roleIdx];
  if (!deleting) {
    typewriterEl.textContent = role.slice(0, ++charIdx);
    if (charIdx === role.length) { deleting = true; await sleep(1800); }
    else await sleep(65);
  } else {
    typewriterEl.textContent = role.slice(0, --charIdx);
    if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; await sleep(300); }
    else await sleep(35);
  }
  requestAnimationFrame(tick);
};
setTimeout(tick, 2800);

// ── BOOT SEQUENCE → SHOW HERO ────────────
const heroMain = $('#hero-main');
setTimeout(() => {
  if (heroMain) { heroMain.style.opacity = '1'; }
}, 2800);

// ── COUNTER ANIMATION ────────────────────
const animateCounter = (el) => {
  const target = parseInt(el.dataset.target, 10);
  let current = 0;
  const step = Math.ceil(target / 40);
  const id = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(id);
  }, 40);
};

// ── SCROLL REVEAL ────────────────────────
const revealEls = () => {
  const allReveal = $$('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  allReveal.forEach(el => observer.observe(el));
};

// Add reveal class to section children
$$('.section .container > *').forEach(el => el.classList.add('reveal'));

// ── SKILL BARS ───────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.skill-fill').forEach(fill => {
      fill.style.width = fill.dataset.pct + '%';
    });
    entry.target.querySelectorAll('.cert-fill').forEach(fill => {
      fill.style.width = fill.dataset.pct + '%';
    });
    entry.target.querySelectorAll('.stat-num').forEach(n => animateCounter(n));
    skillObserver.unobserve(entry.target);
  });
}, { threshold: 0.2 });

$$('section').forEach(s => skillObserver.observe(s));

// ── RADAR CHART ─────────────────────────
const drawRadar = () => {
  const canvas = $('#radar-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 130, cy = 130, r = 100;
  const labels = ['RECON','EXPLOIT','SIGINT','VAPT','OSINT','DEFENCE'];
  const values = [0.78, 0.82, 0.55, 0.85, 0.75, 0.65];
  const n = labels.length;
  const angle = (i) => (i / n) * 2 * Math.PI - Math.PI / 2;

  ctx.clearRect(0, 0, 260, 260);

  // grid rings
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#28c840';
  for (let ring = 1; ring <= 4; ring++) {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const a = angle(i); const rv = (ring / 4) * r;
      i === 0 ? ctx.moveTo(cx + rv * Math.cos(a), cy + rv * Math.sin(a))
               : ctx.lineTo(cx + rv * Math.cos(a), cy + rv * Math.sin(a));
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(40,200,64,0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  // spokes
  labels.forEach((_, i) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i)));
    ctx.strokeStyle = 'rgba(40,200,64,0.1)';
    ctx.stroke();
  });
  // data
  ctx.beginPath();
  values.forEach((v, i) => {
    const a = angle(i); const rv = v * r;
    i === 0 ? ctx.moveTo(cx + rv * Math.cos(a), cy + rv * Math.sin(a))
             : ctx.lineTo(cx + rv * Math.cos(a), cy + rv * Math.sin(a));
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(40,200,64,0.15)';
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.stroke();
  // dots
  values.forEach((v, i) => {
    const a = angle(i); const rv = v * r;
    ctx.beginPath();
    ctx.arc(cx + rv * Math.cos(a), cy + rv * Math.sin(a), 4, 0, 2 * Math.PI);
    ctx.fillStyle = accent;
    ctx.fill();
  });
};

setTimeout(drawRadar, 300);

// ── VIEW TABS (projects, etc.) ───────────
$$('.view-tabs').forEach(tabs => {
  tabs.addEventListener('click', e => {
    const vtab = e.target.closest('.vtab');
    if (!vtab) return;
    $$('.vtab', tabs).forEach(t => t.classList.remove('active'));
    vtab.classList.add('active');

    const target = tabs.dataset.target;
    const container = $('#' + target);
    if (!container) return;

    // view toggle for projects
    if (vtab.dataset.view) {
      container.className = container.className.replace(/view-\S+/g, '').trim();
      container.classList.add('view-' + vtab.dataset.view);
    }

    // filter for arsenal
    if (vtab.dataset.filter) {
      const filter = vtab.dataset.filter;
      container.querySelectorAll('.tool-card').forEach(card => {
        if (filter === 'all' || card.dataset.cat === filter) {
          card.classList.remove('hidden-filter');
        } else {
          card.classList.add('hidden-filter');
        }
      });
      const visible = container.querySelectorAll('.tool-card:not(.hidden-filter)').length;
      const cnt = $('#tool-count');
      if (cnt) cnt.textContent = visible;
    }
  });
});

// ── MATRIX CANVAS ────────────────────────
let matrixInterval = null;
const startMatrix = () => {
  const canvas = $('#matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const cols = Math.floor(canvas.width / 16);
  const drops = Array(cols).fill(1);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  matrixInterval = setInterval(() => {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff41';
    ctx.font = '14px monospace';
    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * 16, y * 16);
      if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }, 40);
};
const stopMatrix = () => { clearInterval(matrixInterval); matrixInterval = null; };

// ── HACKER OVERLAY ───────────────────────
const hackerOverlay = $('#hacker-overlay');
const hackerText    = $('.hacker-text');
const hackerLines   = ['INITIALIZING...','BYPASSING FIREWALL...','ESCALATING PRIVILEGES...','DUMPING LSASS...','PIVOTING...','ROOT SHELL ACTIVE ✓'];

const showHacker = async () => {
  hackerOverlay.classList.remove('hidden');
  startMatrix();
  state.hackerOn = true;
  for (const line of hackerLines) {
    hackerText.textContent = line;
    await sleep(600);
  }
};
const hideHacker = () => {
  hackerOverlay.classList.add('hidden');
  stopMatrix();
  state.hackerOn = false;
};
$('#exit-hacker')?.addEventListener('click', hideHacker);

// ── CLI OVERLAY ──────────────────────────
const cliOverlay = $('#cli-overlay');
const cliOutput  = $('#cli-output');
const cliInput   = $('#cli-input');
const cliClose   = $('#cli-close');

const cliPrint = (text, type = 'out') => {
  const div = document.createElement('div');
  div.className = `cli-line-${type}`;
  div.innerHTML = text;
  cliOutput.appendChild(div);
  cliOutput.scrollTop = cliOutput.scrollHeight;
};

const cliCommands = {
  help: () => {
    cliPrint('Available commands:', 'info');
    cliPrint('  about       — print info about Harjinder', 'out');
    cliPrint('  skills      — list technical skills', 'out');
    cliPrint('  experience  — show work history', 'out');
    cliPrint('  projects    — list projects', 'out');
    cliPrint('  contact     — get contact info', 'out');
    cliPrint('  certifications — show certifications', 'out');
    cliPrint('  ctf         — show CTF writeups', 'out');
    cliPrint('  theme       — cycle color theme', 'out');
    cliPrint('  whoami      — who are you?', 'out');
    cliPrint('  clear       — clear terminal', 'out');
    cliPrint('  exit / quit — close CLI', 'out');
  },
  about: () => {
    cliPrint('<span style="color:var(--cyan)">// Harjinder Singh (h4rj1nd3r51ngh)</span>', 'out');
    cliPrint('Name:     Harjinder Singh', 'out');
    cliPrint('Nickname: Ankit', 'out');
    cliPrint('Location: Ludhiana, Punjab, India', 'out');
    cliPrint('Role:     Penetration Tester & Security Analyst', 'out');
    cliPrint('Status:   White Hat — All work is authorized.', 'out');
  },
  whoami: () => cliPrint('root@h4rj1nd3r51ngh — penetration tester', 'info'),
  skills: () => {
    cliPrint('$ apt list --installed', 'cmd');
    ['Penetration Testing','Active Directory Exploitation','Web Application Testing','Metasploit Framework','Nmap / Network Scanning','Burp Suite Pro','Python & Bash Scripting','Kali Linux'].forEach(s => cliPrint(`  ✓ ${s}`, 'out'));
  },
  experience: () => {
    cliPrint('$ git log --oneline', 'cmd');
    cliPrint('[ACTIVE] Trainee Security Analyst — Cynox Security LLP', 'out');
    cliPrint('[ACTIVE] Security Analyst Intern  — CyberYaan', 'out');
    cliPrint('[ACTIVE] Cyber Warrior Intern     — GPCSSI (Haryana Police)', 'out');
    cliPrint('[EDU]    B.Tech Cybersecurity     — GNA University', 'out');
  },
  projects: () => {
    cliPrint('$ ls ~/projects/', 'cmd');
    ['ad-compromise-lab','webapp-pentest','osint-framework','network-analysis','webshell-lab','forensics-case'].forEach(p => cliPrint(`  drwxr-xr-x  ${p}`, 'out'));
  },
  contact: () => {
    cliPrint('Email:    harjinder.khalsa4@gmail.com', 'out');
    cliPrint('LinkedIn: linkedin.com/in/h4rj1nd3r51ngh/', 'out');
    cliPrint('GitHub:   github.com/h4rj1nd3r51ngh', 'out');
    cliPrint('TryHackMe: tryhackme.com/p/h4rj1nd3r51ngh', 'out');
  },
  certifications: () => {
    cliPrint('$ gpg --list-keys --keyring credentials', 'cmd');
    cliPrint('[IN PROGRESS] HTB CPTS — Hack The Box (40%)', 'out');
    cliPrint('[IN REVIEW]   CRTO     — Zero-Point Security (37%)', 'out');
    cliPrint('[COMPLETED]   Cyber Warrior — GPCSSI / Haryana Police', 'out');
    cliPrint('[EDUCATION]   B.Tech Cybersecurity — GNA University', 'out');
  },
  ctf: () => {
    cliPrint('$ ls ~/ctf/', 'cmd');
    ['SQL Injection to Shell (Hard)','Buffer Overflow + ROP Chain (Hard)','PCAP Hunt (Medium)','XOR Crib Drag (Medium)','LSB Steganography (Easy)','Kerberoasting → Domain Admin (Hard)'].forEach(c => cliPrint(`  ${c}`, 'out'));
  },
  theme: () => { cycleTheme(); cliPrint(`Theme changed to: ${state.theme}`, 'info'); },
  clear: () => { cliOutput.innerHTML = ''; },
  exit: () => closeCLI(),
  quit: () => closeCLI(),
};

const openCLI = () => {
  cliOverlay.classList.remove('hidden');
  state.cliOpen = true;
  cliOutput.innerHTML = '';
  cliPrint('h4rj1nd3r51ngh Terminal — type <span style="color:var(--accent)">help</span> for commands', 'info');
  cliInput.focus();
};
const closeCLI = () => {
  cliOverlay.classList.add('hidden');
  state.cliOpen = false;
};

$('#cli-btn')?.addEventListener('click', () => state.cliOpen ? closeCLI() : openCLI());
cliClose?.addEventListener('click', closeCLI);

cliInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const cmd = cliInput.value.trim().toLowerCase();
    if (!cmd) return;
    cliPrint(`h4rj1nd3r@portfolio:~$ ${cmd}`, 'cmd');
    state.cliHistory.unshift(cmd);
    state.cliHistIdx = -1;
    cliInput.value = '';
    if (cliCommands[cmd]) {
      cliCommands[cmd]();
    } else {
      cliPrint(`bash: ${cmd}: command not found. Try 'help'`, 'err');
    }
  }
  // history navigation
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (state.cliHistIdx < state.cliHistory.length - 1) {
      state.cliHistIdx++;
      cliInput.value = state.cliHistory[state.cliHistIdx];
    }
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (state.cliHistIdx > 0) { state.cliHistIdx--; cliInput.value = state.cliHistory[state.cliHistIdx]; }
    else { state.cliHistIdx = -1; cliInput.value = ''; }
  }
  if (e.key === 'Escape') closeCLI();
});

// ── KEYBOARD SHORTCUTS ───────────────────
document.addEventListener('keydown', e => {
  const active = document.activeElement;
  const isInput = active.tagName === 'INPUT' || active.tagName === 'TEXTAREA';

  if (e.key === '`' && !isInput) {
    e.preventDefault();
    state.cliOpen ? closeCLI() : openCLI();
    return;
  }
  if (e.key === 'Escape') {
    if (state.cliOpen) closeCLI();
    if (state.hackerOn) hideHacker();
    if (!shortcutsModal.classList.contains('hidden')) shortcutsModal.classList.add('hidden');
    return;
  }
  if (e.key === '?' && !isInput) {
    shortcutsModal.classList.toggle('hidden');
    return;
  }
  if (e.ctrlKey && e.shiftKey && e.key === 'H') {
    e.preventDefault();
    showHacker();
    return;
  }
  if (e.key === 't' && !isInput) { cycleTheme(); return; }

  // G + letter navigation
  if (e.key === 'g' && !isInput) { state.gKey = true; return; }
  if (state.gKey) {
    state.gKey = false;
    const navMap = { h: '#hero', a: '#about', s: '#skills', p: '#projects', c: '#contact' };
    if (navMap[e.key]) document.querySelector(navMap[e.key])?.scrollIntoView({ behavior: 'smooth' });
  }
});

// ── CONTACT FORM ─────────────────────────
$('#contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const status = $('#form-status');
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = '$ ./sending...';
  btn.disabled = true;
  setTimeout(() => {
    status.className = 'form-status success';
    status.textContent = '✓ Message transmitted. Encrypted tunnel closed. Will respond ASAP.';
    btn.textContent = '$ ./send_message.sh';
    btn.disabled = false;
    e.target.reset();
  }, 1200);
});

// ── TOOL CARDS EXPAND ────────────────────
$$('.tool-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('expanded'));
});

// ── INIT REVEAL OBSERVER ─────────────────
revealEls();

// Set initial scroll pct
updateStatusBar();

// ── RESIZE: redraw radar ──────────────────
window.addEventListener('resize', drawRadar);
