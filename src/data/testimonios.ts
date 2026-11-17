// Testimonios reales de familias atendidas por Marco.
// Fuente: 02_Fotos_Camposanto/Testimonios/ (capturas de WhatsApp + testimonios.txt), 2026-11-16.
// Las citas se copian del mensaje original (solo se ajusta la puntuación y se acortan con "…").
// PENDIENTE: confirmar el consentimiento de cada persona para publicar (Ley N.° 29733) y completar los [ ].
// Las capturas se publican recortadas y con los datos personales difuminados (espacios testimonio-* en imagenes.mapa.json).

export type Testimonio = {
  texto: string;
  autor: string;
  detalle: string;
  /** Espacio de imagenes.mapa.json con la captura anonimizada (opcional). */
  captura?: 'testimonio-sheyla' | 'testimonio-doris';
};

export const testimonios: Testimonio[] = [
  {
    texto: 'En un momento en que de verdad no tenía cabeza para pensar… le agradezco de corazón porque no toda la gente hace su trabajo de manera amable y diligente.',
    autor: 'Sheyla B.',
    detalle: '[DISTRITO / SERVICIO]',
    captura: 'testimonio-sheyla',
  },
  {
    texto: 'Quería agradecerte por toda la gestión. El servicio muy bueno, respetuoso y organizado.',
    autor: 'Doris C.',
    detalle: '[DISTRITO / SERVICIO]',
    captura: 'testimonio-doris',
  },
  {
    texto: '¿Qué hubiera hecho sin su ayuda? Todo me pareció complicado y usted lo hizo tan simple.',
    autor: '[NOMBRE]',
    detalle: '[DISTRITO / SERVICIO]',
  },
  {
    texto: 'Cuando me respondió por teléfono y me dijo «¿En qué puedo ayudarle?», dije: «Ah, este es».',
    autor: '[NOMBRE]',
    detalle: '[DISTRITO / SERVICIO]',
  },
  {
    texto: 'Me dijo «¿le parece si le voy preguntando y usted me va respondiendo?», y fue mucho mejor: lo hizo simple, algo que me parecía súper complicado.',
    autor: '[NOMBRE]',
    detalle: '[DISTRITO / SERVICIO]',
  },
];
