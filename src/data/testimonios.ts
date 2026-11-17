// Testimonios reales de familias atendidas por Marco.
// Fuente: 02_Fotos_Camposanto/Testimonios/ (capturas de WhatsApp + testimonios.txt), 2026-11-16.
// Las citas se copian del mensaje original (solo se ajusta la puntuación y se acortan con "…").
// No se inventan nombres ni distritos: los testimonios sin nombre se firman "Familia atendida por Marco".
// Si una persona autoriza su nombre o distrito, se cambia aquí. PENDIENTE: consentimiento de cada persona (Ley N.° 29733).
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
    detalle: 'Mensaje de WhatsApp, julio 2026',
    captura: 'testimonio-sheyla',
  },
  {
    texto: 'Quería agradecerte por toda la gestión. El servicio muy bueno, respetuoso y organizado.',
    autor: 'Doris C.',
    detalle: 'Mensaje de WhatsApp, abril 2026',
    captura: 'testimonio-doris',
  },
  {
    texto: '¿Qué hubiera hecho sin su ayuda? Todo me pareció complicado y usted lo hizo tan simple.',
    autor: 'Familia atendida por Marco',
    detalle: '',
  },
  {
    texto: 'Cuando me respondió por teléfono y me dijo «¿En qué puedo ayudarle?», dije: «Ah, este es».',
    autor: 'Familia atendida por Marco',
    detalle: '',
  },
  {
    texto: 'Me dijo «¿le parece si le voy preguntando y usted me va respondiendo?», y fue mucho mejor: lo hizo simple, algo que me parecía súper complicado.',
    autor: 'Familia atendida por Marco',
    detalle: '',
  },
];
