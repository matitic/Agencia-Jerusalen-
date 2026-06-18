/* ══════════════════════════════════════
   SCRIPT.JS — Sistema Jerusalén
   Hito 4 | ISI-511 | Joel Kenaut
══════════════════════════════════════ */

// ── NAV scroll effect ──────────────────
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav__links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = burger.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ── Reveal on scroll ──────────────────
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealObserver.observe(el));

// ── Smooth scroll for anchor links ────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Particle Canvas ────────────────────
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const PARTICLE_COUNT = 60;

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.radius = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.4 + 0.1;
    this.color = Math.random() > 0.6 ? '232,164,34' : '59,130,246';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${this.color})`;
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 120) * 0.08;
        ctx.strokeStyle = '#e8a422';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── Stats counter animation ────────────
function animateCounter(el, target, suffix, duration) {
  let start = null;
  const isFloat = target % 1 !== 0;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = isFloat ? (target * ease).toFixed(1) : Math.round(target * ease);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      statsObserver.unobserve(entry.target);
      const nums = entry.target.querySelectorAll('.stat__num');
      const data = [
        { val: 98, suffix: '%' },
        { val: 3, suffix: 's', prefix: '<' },
        { val: 70, suffix: '%+' },
        { val: 10, suffix: 'K' },
      ];
      nums.forEach((el, i) => {
        if (data[i]) {
          setTimeout(() => animateCounter(el, data[i].val, data[i].suffix, 1200), i * 150);
        }
      });
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero__stats');
if (heroStats) statsObserver.observe(heroStats);

// ── Active nav link on scroll ──────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAnchors.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
});

// ── Tech pill hover glow ──────────────
document.querySelectorAll('.tech__pill').forEach(pill => {
  pill.addEventListener('mouseenter', function () {
    this.style.boxShadow = '0 0 12px rgba(232,164,34,0.25)';
  });
  pill.addEventListener('mouseleave', function () {
    this.style.boxShadow = '';
  });
});

// ── Module card tilt effect ───────────
document.querySelectorAll('.modulo').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.3s cubic-bezier(0.4,0,0.2,1)';
  });
});

// ── Console message ───────────────────
console.log('%c🏗 SISTEMA JERUSALÉN', 'color:#e8a422;font-size:20px;font-weight:900');
console.log('%cHito 4 | ISI-511 | Joel Matias Kenaut Ticona', 'color:#9ca3af;font-size:12px');
console.log('%cUniversidad Franz Tamayo — El Alto, Bolivia 2026', 'color:#6b7280;font-size:11px');

/* ══════════════════════════════════════
   FORMULARIO DE COTIZACIÓN — Lógica DER
   CU-03: Formalizar Cotización
   Entidades: USUARIO + COTIZACION + DETALLE
══════════════════════════════════════ */

// Establece la fecha de hoy por defecto
const fechaInput = document.getElementById('fecha_emision');
if (fechaInput) {
  const today = new Date().toISOString().split('T')[0];
  fechaInput.value = today;
}

// ── Calcular subtotales por fila ──────
function calcItem(row) {
  const sel = row.querySelector('.item__material');
  const qty = row.querySelector('.item__qty');
  const price = row.querySelector('.item__price');
  const sub = row.querySelector('.item__sub');
  if (!sel || !qty) return 0;
  const opt = sel.options[sel.selectedIndex];
  const p = opt ? parseFloat(opt.dataset.price || 0) : 0;
  const q = parseInt(qty.value) || 0;
  price.value = p > 0 ? 'Bs. ' + p.toFixed(2) : '';
  const s = p * q;
  sub.value = s > 0 ? 'Bs. ' + s.toFixed(2) : 'Bs. 0.00';
  return s;
}

function recalcTotal() {
  let subtotal = 0;
  document.querySelectorAll('.item__row').forEach(row => {
    subtotal += calcItem(row);
  });
  const iva = subtotal * 0.13;
  const total = subtotal + iva;
  document.getElementById('totalSub').textContent = 'Bs. ' + subtotal.toFixed(2);
  document.getElementById('totalIva').textContent = 'Bs. ' + iva.toFixed(2);
  document.getElementById('totalFinal').textContent = 'Bs. ' + total.toFixed(2);
  return total;
}

// Evento delegado para cambios en items
document.getElementById('itemsContainer')?.addEventListener('change', recalcTotal);
document.getElementById('itemsContainer')?.addEventListener('input', recalcTotal);

// ── Agregar nueva fila de material ────
let itemCount = 1;
document.getElementById('addItem')?.addEventListener('click', () => {
  itemCount++;
  const container = document.getElementById('itemsContainer');
  const template = container.querySelector('.item__row').cloneNode(true);
  template.dataset.item = itemCount;
  // Reset values
  template.querySelectorAll('select').forEach(s => { s.name = s.name.replace(/_\d+$/, '_' + itemCount); s.value = ''; });
  template.querySelectorAll('input').forEach(i => { i.name = (i.name || '').replace(/_\d+$/, '_' + itemCount); if (!i.readOnly) i.value = '1'; else i.value = ''; });
  container.appendChild(template);
  recalcTotal();
  template.querySelector('.item__material')?.focus();
});

// ── Eliminar fila ─────────────────────
function removeItem(btn) {
  const rows = document.querySelectorAll('.item__row');
  if (rows.length <= 1) { alert('Debe haber al menos un material.'); return; }
  btn.closest('.item__row').remove();
  recalcTotal();
}

// ── Validación del formulario ─────────
function validateForm() {
  let ok = true;
  const campos = [
    { id: 'nombre_completo', msg: 'El nombre es obligatorio (mín. 3 caracteres)' },
    { id: 'correo_electronico', msg: 'Ingresa un correo válido' },
    { id: 'telefono', msg: 'Ingresa un teléfono válido (7-12 dígitos)' },
    { id: 'tipo_obra', msg: 'Selecciona el tipo de obra' },
    { id: 'fecha_emision', msg: 'La fecha es obligatoria' },
  ];
  campos.forEach(c => {
    const el = document.getElementById(c.id);
    const err = el?.parentElement.querySelector('.field__error');
    if (el && !el.checkValidity()) {
      el.classList.add('error');
      if (err) err.textContent = c.msg;
      ok = false;
    } else {
      el?.classList.remove('error');
      if (err) err.textContent = '';
    }
  });
  // Check at least one material selected
  const mats = document.querySelectorAll('.item__material');
  let anyMat = false;
  mats.forEach(m => { if (m.value) anyMat = true; });
  if (!anyMat) {
    alert('Selecciona al menos un material para cotizar.');
    ok = false;
  }
  return ok;
}

// ── Submit — genera ticket ─────────────
document.getElementById('cotizacionForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = '⏳ Procesando...';

  setTimeout(() => {
    const nombre = document.getElementById('nombre_completo').value;
    const correo = document.getElementById('correo_electronico').value;
    const telefono = document.getElementById('telefono').value;
    const tipoObra = document.getElementById('tipo_obra').value;
    const fecha = document.getElementById('fecha_emision').value;
    const plazo = document.getElementById('plazo_entrega').value;
    const notas = document.getElementById('notas').value;

    // Recopilar materiales
    const items = [];
    document.querySelectorAll('.item__row').forEach(row => {
      const sel = row.querySelector('.item__material');
      const qty = row.querySelector('.item__qty');
      const sub = row.querySelector('.item__sub');
      if (sel?.value) {
        items.push({
          mat: sel.options[sel.selectedIndex].text.split('·')[0].trim(),
          qty: qty.value,
          sub: sub.value
        });
      }
    });

    const subtotal = parseFloat(document.getElementById('totalSub').textContent.replace('Bs. ',''));
    const iva = parseFloat(document.getElementById('totalIva').textContent.replace('Bs. ',''));
    const total = parseFloat(document.getElementById('totalFinal').textContent.replace('Bs. ',''));

    // ID correlativo simulado (registro en tabla COTIZACION)
    const cotId = 'COT-' + Date.now().toString().slice(-6);

    // Construir resumen
    let resumen = `── REGISTRO TABLA: COTIZACION ─────────────────\n`;
    resumen += `id_cotizacion    : ${cotId}  [PK · Auto]\n`;
    resumen += `fecha_emision    : ${fecha}\n`;
    resumen += `total_calculado  : Bs. ${total.toFixed(2)}\n\n`;
    resumen += `── REGISTRO TABLA: USUARIO ────────────────────\n`;
    resumen += `nombre_completo  : ${nombre}\n`;
    resumen += `correo_electronico: ${correo}\n`;
    resumen += `telefono         : ${telefono}\n\n`;
    resumen += `── REGISTROS TABLA: DETALLE_COTIZACION ────────\n`;
    items.forEach((it, i) => {
      resumen += `  [${i+1}] ${it.mat} × ${it.qty} unid. = ${it.sub}\n`;
    });
    resumen += `\n── TOTALES ────────────────────────────────────\n`;
    resumen += `Subtotal : Bs. ${subtotal.toFixed(2)}\n`;
    resumen += `IVA 13%  : Bs. ${iva.toFixed(2)}\n`;
    resumen += `TOTAL    : Bs. ${total.toFixed(2)}\n`;
    if (notas) resumen += `\nObservaciones: ${notas}`;

    // Mostrar resultado
    document.getElementById('cotizacionForm').style.display = 'none';
    document.getElementById('cotizacionResult').style.display = 'block';
    document.getElementById('resultId').textContent = cotId;
    document.getElementById('resultBody').textContent = resumen;

    // WhatsApp link
    const msg = encodeURIComponent(
      `*Cotización ${cotId} — Materiales Jerusalén*\n` +
      `Cliente: ${nombre}\n` +
      `Teléfono: ${telefono}\n` +
      `Obra: ${tipoObra}\n` +
      items.map(it => `• ${it.mat} ×${it.qty} = ${it.sub}`).join('\n') +
      `\n*TOTAL: Bs. ${total.toFixed(2)}*\n` +
      `Plazo: ${plazo}`
    );
    document.getElementById('whatsappBtn').href = `https://wa.me/?text=${msg}`;

    // Status
    document.getElementById('formStatus').textContent = '● Cotización generada';
    document.getElementById('formStatus').classList.add('active');
  }, 900);
});

function resetForm() {
  document.getElementById('cotizacionForm').reset();
  document.getElementById('cotizacionForm').style.display = 'block';
  document.getElementById('cotizacionResult').style.display = 'none';
  const btn = document.getElementById('submitBtn');
  btn.disabled = false;
  btn.textContent = '🧾 Generar Cotización Formal';
  // Reset items to 1
  const cont = document.getElementById('itemsContainer');
  const rows = cont.querySelectorAll('.item__row');
  rows.forEach((r, i) => { if (i > 0) r.remove(); });
  recalcTotal();
  document.getElementById('formStatus').textContent = '● En espera';
  document.getElementById('formStatus').classList.remove('active');
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('fecha_emision').value = today;
}
