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
   * Catálogo PDF que se descarga en /servicio-funerario (generado con npm run catalogo, con los datos de
   * Marco en la portada). Si cambia el catálogo, regenerarlo y actualizar aquí el peso que muestra el botón.
   */
  catalogoPdf: { ruta: '/catalogo-servicio-funerario-2026.pdf', peso: '3.6 MB' },

  /**
   * Logo de Jardines de la Paz en la cabecera (espacio "logo-jdlp" de imagenes.mapa.json).
   * Activado a pedido del usuario el 2026-11-15. false = se oculta.
   */
  logoJdlpAutorizado: true,

  sedes: [
    {
      id: 'la-molina',
      nombre: 'Camposanto La Molina',
      direccion: 'Calle Monte Real 110',
      distrito: 'La Molina',
      mapa: 'https://www.google.com/maps/search/?api=1&query=Jardines+de+la+Paz+Calle+Monte+Real+110+La+Molina',
      /** Recorrido virtual 3D oficial del camposanto (vacío = no se muestra el botón). */
      recorrido3d: 'https://recorridomolina.jardines.pe/',
    },
    {
      id: 'lurin',
      nombre: 'Camposanto Lurín',
      direccion: 'Panamericana Sur Km 32.5',
      distrito: 'Lurín',
      mapa: 'https://www.google.com/maps/search/?api=1&query=Jardines+de+la+Paz+Panamericana+Sur+Km+32.5+Lurin',
      recorrido3d: 'https://recorridolurin.jardines.pe/',
    },
    {
      // Tercera sede: no es camposanto, solo brinda cremación (catálogo de camposantos, págs. 80 a 97).
      id: 'centro-funerario',
      nombre: 'Centro Funerario (cremación)',
      direccion: 'Antigua Panamericana Sur Km 19.3',
      distrito: 'Villa El Salvador',
      mapa: 'https://www.google.com/maps/search/?api=1&query=Centro+Funerario+Jardines+de+la+Paz+Antigua+Panamericana+Sur+Km+19.3+Villa+El+Salvador',
      recorrido3d: '',
      /** Horario de atención del local (el asesor atiende 24 h por teléfono y WhatsApp). */
      horario: ['Lunes a viernes: 9:00 a. m. a 5:00 p. m.', 'Sábados, domingos y feriados: 9:00 a. m. a 4:30 p. m.'],
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
