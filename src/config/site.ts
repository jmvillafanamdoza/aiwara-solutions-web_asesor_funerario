// =====================================================================
// CONFIGURACIÓN ÚNICA DE LA WEB
// Todo dato que pueda cambiar (dominio, contacto, mensajes, IDs de medición)
// se edita SOLO aquí. Después: npm run build.
// =====================================================================

/** Dominio sin https ni barra final. Cambiar aquí si se usa otro dominio. */
const DOMINIO = 'asesorfunerariolima.com';

export const SITE = {
  dominio: DOMINIO,
  url: `https://${DOMINIO}`,

  // --- Identidad ---
  nombre: 'Marco Antonio Villafana Fajardo',
  nombreCorto: 'Marco Villafana',
  cargo: 'Asesor Funerario Autorizado',
  empresa: 'Jardines de la Paz',
  aniosExperiencia: 25,
  idioma: 'es-PE',

  // --- Contacto (usar exactamente estos) ---
  telefonoE164: '+51998160591', // para tel: y datos estructurados
  telefonoVisible: '998 160 591', // como se muestra en pantalla
  telefonoIntl: '+51 998 160 591',
  whatsapp: '51998160591', // para wa.me (sin +)
  correo: 'mvillafana@jardines.pe',
  atencion24h: true,

  redes: {
    facebook: 'https://www.facebook.com/mvillafanajardines',
    instagram: 'https://www.instagram.com/mvillafanajardines',
    linkedin: 'https://www.linkedin.com/in/marco-villafana',
  },

  sitioOficial: 'https://www.jardinesdelapaz.com',

  /**
   * Logo oficial de Jardines de la Paz: NO usar hasta confirmar la autorización.
   * Cuando se confirme: poner el archivo en src/assets/logo-jdlp.svg (o .png) y cambiar a true.
   */
  logoJdlpAutorizado: false,

  sedes: [
    {
      id: 'la-molina',
      nombre: 'Camposanto La Molina',
      direccion: 'Calle Monte Real 110',
      distrito: 'La Molina',
      mapa: 'https://www.google.com/maps/search/?api=1&query=Jardines+de+la+Paz+Calle+Monte+Real+110+La+Molina',
    },
    {
      id: 'lurin',
      nombre: 'Camposanto Lurín',
      direccion: '[DIRECCIÓN POR CONFIRMAR]',
      distrito: 'Lurín',
      mapa: 'https://www.google.com/maps/search/?api=1&query=Jardines+de+la+Paz+Lurin',
    },
  ],

  /** Mensaje prellenado del botón de WhatsApp según la página (clave = id de página). */
  mensajesWhatsApp: {
    inicio: 'Hola Marco, vi tu web y quisiera información.',
    'servicio-funerario': 'Hola Marco, necesito ayuda con un servicio funerario.',
    'plan-funerario': 'Hola Marco, quiero cotizar un plan de previsión.',
    privacidad: 'Hola Marco, vi tu web y quisiera información.',
    '404': 'Hola Marco, vi tu web y quisiera información.',
  } as Record<string, string>,

  /**
   * Medición. Reemplazar los placeholders por los IDs reales.
   * - Si hay gtmId válido, se carga SOLO Google Tag Manager (configurar GA4 y el Pixel dentro de GTM).
   * - Si no hay GTM, se cargan GA4 y el Pixel de Meta directamente con sus IDs.
   * Nada se carga hasta que la persona acepta las cookies.
   */
  tracking: {
    gtmId: 'GTM-XXXXXXX',
    ga4Id: 'G-XXXXXXXXXX',
    metaPixelId: 'XXXXXXXXXXXXXXX',
  },

  /** Menú. Las páginas de fase 2 quedan listas: crear la página y cambiar activo a true. */
  nav: [
    { href: '/', label: 'Inicio', activo: true },
    { href: '/servicio-funerario', label: 'Servicio funerario', activo: true },
    { href: '/plan-funerario', label: 'Plan funerario', activo: true },
    { href: '/cremacion', label: 'Cremación', activo: false },
    { href: '/camposanto-la-molina', label: 'La Molina', activo: false },
    { href: '/camposanto-lurin', label: 'Lurín', activo: false },
    { href: '/guias', label: 'Guías', activo: false },
  ],
} as const;

/** Un ID de medición es válido si no es el placeholder (no contiene XXXX). */
export const idValido = (id: string) => Boolean(id) && !/X{4,}/.test(id);

export const enlaceWhatsApp = (mensaje: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(mensaje)}`;

export const enlaceTelefono = `tel:${SITE.telefonoE164}`;
