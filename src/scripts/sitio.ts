// Comportamiento común de todas las páginas.
import { activarMedicion, evento } from './medicion';

// ---------- Menú móvil ----------
const botonMenu = document.querySelector<HTMLButtonElement>('.menu-btn');
const menu = document.getElementById('menu');
if (botonMenu && menu) {
  const cerrar = () => {
    menu.classList.remove('abierto');
    botonMenu.setAttribute('aria-expanded', 'false');
    botonMenu.setAttribute('aria-label', 'Abrir menú');
  };
  botonMenu.addEventListener('click', () => {
    const abierto = menu.classList.toggle('abierto');
    botonMenu.setAttribute('aria-expanded', String(abierto));
    botonMenu.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('abierto')) { cerrar(); botonMenu.focus(); }
  });
  menu.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) cerrar(); });
}

// ---------- Aparición suave al entrar en pantalla ----------
const aparecen = document.querySelectorAll('.aparece');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entradas) => {
    for (const e of entradas) if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  aparecen.forEach((el) => io.observe(el));
} else {
  aparecen.forEach((el) => el.classList.add('visible'));
}

// ---------- Eventos de contacto (clics en WhatsApp y llamada) ----------
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest('a');
  if (!a) return;
  const href = a.getAttribute('href') || '';
  const ubicacion = a.dataset.ubicacion || 'contenido';
  if (href.includes('wa.me/')) evento('whatsapp_click', { ubicacion });
  else if (href.startsWith('tel:')) evento('call_click', { ubicacion });
  else if (href.includes('recorrido')) evento('recorrido_3d_click', { ubicacion });
  else if (a.hasAttribute('download') || new URL(a.href, location.href).pathname.endsWith('.pdf')) evento('catalogo_descarga', { ubicacion });
});

// ---------- Consentimiento de cookies ----------
const CLAVE = 'consentimiento-cookies';
const banner = document.querySelector<HTMLElement>('[data-banner-cookies]');
const leer = () => { try { return localStorage.getItem(CLAVE); } catch { return null; } };
const guardar = (v: string) => { try { localStorage.setItem(CLAVE, v); } catch { /* modo privado */ } };

let activa = false;
const activar = () => { activarMedicion(); activa = true; };
const decision = leer();
if (decision === 'aceptado') activar();
else if (!decision && banner) banner.hidden = false;

banner?.addEventListener('click', (e) => {
  const v = (e.target as HTMLElement).closest<HTMLElement>('[data-cookies]')?.dataset.cookies;
  if (!v) return;
  guardar(v);
  banner.hidden = true;
  if (v === 'aceptado') activar();
  else if (activa) location.reload(); // si la medición ya estaba activa y ahora rechaza, recargar sin ella
});

document.querySelectorAll('[data-abrir-cookies]').forEach((b) =>
  b.addEventListener('click', () => {
    if (!banner) return;
    banner.hidden = false;
    banner.querySelector<HTMLButtonElement>('[data-cookies]')?.focus();
  }),
);
