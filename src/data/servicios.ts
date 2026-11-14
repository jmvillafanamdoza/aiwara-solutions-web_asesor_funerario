// Servicios funerarios. Fuente: brochures de Marco (BROCHURE/FUNERARIA/NECESIDAD INMEDIATA).
// Sin precios a propósito (el brief lo pide en la página de servicio funerario).

/** Lo que incluyen TODOS los servicios. */
export const incluyenTodos = [
  'Ataúd según el servicio elegido',
  'Carroza y coche portaflores',
  'Capilla ardiente',
  'Preparación tanatológica',
  'Trámites y traslados',
  'Atención personalizada',
];

export const servicios = [
  {
    id: 'platinum',
    nombre: 'Platinum',
    resumen: 'Nuestro servicio más completo, con ataúd de caoba y carroza extra lujo.',
    ataud: 'Ataúd de caoba, cuadrado o redondo',
    ademas: [
      'Carroza extra lujo',
      'Capilla ardiente de madera con pedestales para flores',
      'Arreglos florales para pedestales, manto y corona o cruz',
      'Cargadores y velatorio (una noche)',
      'Obituario en línea y Mural de Memorias',
      'Cortesía a elegir: movilidad especial de lujo, movilidad o misa de cuerpo presente',
    ],
  },
  {
    id: 'premium',
    nombre: 'Premium',
    resumen: 'Ataúd de cedro, carroza de lujo y capilla de madera.',
    ataud: 'Ataúd de cedro cuadrado',
    ademas: [
      'Carroza de lujo',
      'Capilla ardiente de madera',
      'Arreglos florales: manto y corona o cruz',
      'Cargadores y velatorio (una noche)',
      'Obituario en línea y Mural de Memorias',
      'Cortesía a elegir: movilidad especial de lujo, movilidad o misa de cuerpo presente',
    ],
  },
  {
    id: 'especial',
    nombre: 'Especial',
    resumen: 'Un servicio completo con carroza de lujo y arreglo floral.',
    ataud: 'Ataúd modelo Verona',
    ademas: [
      'Carroza de lujo',
      'Arreglo floral: manto',
      'Cargadores y velatorio (una noche)',
      'Obituario en línea y Mural de Memorias',
      'Cortesía a elegir: movilidad o misa de cuerpo presente',
    ],
  },
  {
    id: 'clasico',
    nombre: 'Clásico',
    resumen: 'Lo esencial para una despedida digna, con velatorio en La Molina.',
    ataud: 'Ataúd modelo Florencia (madera cumala o similar)',
    ademas: ['Cargadores', 'Velatorio en Jardines de la Paz, La Molina'],
  },
  {
    id: 'tradicional',
    nombre: 'Tradicional',
    resumen: 'El servicio básico, con lo necesario para la despedida.',
    ataud: 'Ataúd modelo Nápoles (madera cumala o similar)',
    ademas: [],
  },
] as const;

export const notasServicios = [
  'Para entierro o cremación, hacia todos los camposantos de Lima.',
  'Velatorio sujeto a disponibilidad del local elegido; incluye una noche.',
  'En cremaciones se incluye alquiler de ataúd, urna para cenizas, trámites ante el área de salud y necropsia de ley.',
  'Modelos de ataúd sujetos a disponibilidad. Imágenes referenciales.',
];
