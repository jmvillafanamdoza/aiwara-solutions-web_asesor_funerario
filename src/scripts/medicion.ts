// Medición: Google Tag Manager, GA4 y Pixel de Meta.
// - Los IDs vienen de src/config/site.ts (si son placeholders, no se carga nada).
// - Nada se carga hasta que la persona acepta las cookies.
// - Eventos: whatsapp_click, call_click, form_submit, recorrido_3d_click, catalogo_descarga (siempre con el nombre de la página).

type Cfg = { pagina: string; gtmId: string; ga4Id: string; metaPixelId: string };
type Win = Window & { dataLayer: unknown[]; gtag: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void; _fbq?: unknown };
const w = window as unknown as Win;

export const cfg: Cfg = JSON.parse(document.getElementById('cfg-tracking')?.textContent || '{}');

let cargada = false;
let modoDirecto = false; // true cuando se cargan GA4/Pixel sin GTM

function cargarScript(src: string) {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

export function activarMedicion() {
  if (cargada) return;
  cargada = true;
  w.gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' });

  if (cfg.gtmId) {
    w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    cargarScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(cfg.gtmId)}`);
    return;
  }

  modoDirecto = true;
  if (cfg.ga4Id) {
    cargarScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(cfg.ga4Id)}`);
    w.gtag('js', new Date());
    w.gtag('config', cfg.ga4Id);
  }
  if (cfg.metaPixelId) {
    const fbq = function (...args: unknown[]) {
      const f = fbq as unknown as { callMethod?: (...a: unknown[]) => void; queue: unknown[] };
      f.callMethod ? f.callMethod(...args) : f.queue.push(args);
    } as unknown as Win['fbq'] & { queue: unknown[]; loaded: boolean; version: string; push: unknown };
    Object.assign(fbq as object, { queue: [], loaded: true, version: '2.0' });
    (fbq as unknown as { push: unknown }).push = fbq;
    w.fbq = fbq;
    w._fbq = fbq;
    cargarScript('https://connect.facebook.net/en_US/fbevents.js');
    w.fbq!('init', cfg.metaPixelId);
    w.fbq!('track', 'PageView');
  }
}

/** Registra un evento. Siempre va al dataLayer (para GTM); en modo directo también a GA4 y al Pixel. */
export function evento(nombre: 'whatsapp_click' | 'call_click' | 'form_submit' | 'recorrido_3d_click' | 'catalogo_descarga', datos: Record<string, string> = {}) {
  const payload = { pagina: cfg.pagina, ...datos };
  w.dataLayer.push({ event: nombre, ...payload });
  if (!modoDirecto) return;
  if (cfg.ga4Id) w.gtag('event', nombre, payload);
  if (w.fbq) {
    if (nombre === 'form_submit') w.fbq('track', 'Lead', payload);
    else if (nombre === 'recorrido_3d_click') w.fbq('trackCustom', 'Recorrido3D', payload);
    else if (nombre === 'catalogo_descarga') w.fbq('trackCustom', 'DescargaCatalogo', payload);
    else w.fbq('track', 'Contact', { metodo: nombre === 'call_click' ? 'llamada' : 'whatsapp', ...payload });
  }
}
