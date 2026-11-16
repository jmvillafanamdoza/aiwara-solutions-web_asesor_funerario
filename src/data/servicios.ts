// Servicios funerarios. Fuente: Catálogo de Servicio Funerario Jardines de la Paz,
// vigencia agosto 2026 (01_Catalogos/CatalogoSSFF2026_F.pdf), páginas 4 a 13.
// Sin precios a propósito (la página de servicio funerario no los muestra).
// Las imágenes de cada servicio están en imagenes.mapa.json (espacios serv-<id>-capilla/-ataud/-carroza).

export type Servicio = {
  id: 'platinum' | 'premium' | 'especial' | 'clasico' | 'tradicional';
  nombre: string;
  lema: string;
  ataud: string;
  /** Formas de ataúd con sus medidas (catálogo 2026). Fotos: espacios serv-<id>-ataud[-redondo][-abierto]. */
  formas: { forma: 'cuadrado' | 'redondo'; externas: string; internas: string }[];
  /** Color del escenario: oscuro (verde) o claro. */
  tono: 'oscuro' | 'salvia' | 'piedra' | 'bosque' | 'niebla';
  grupos: { titulo: string; items: string[] }[];
  cortesia: string;
};

const MOVILIDAD_A_ELEGIR =
  'Cintas de Honor Jardines y una movilidad a elegir: auto especial de lujo (4 pasajeros), miniván (10 pasajeros) o movilidad para 24 pasajeros.';

export const servicios: Servicio[] = [
  {
    id: 'platinum',
    nombre: 'Platinum',
    lema: 'Nuestro servicio más completo, con ataúd Platinum y carroza extra lujo.',
    ataud: 'Ataúd de madera modelo Platinum, cuadrado o redondo',
    formas: [
      { forma: 'cuadrado', externas: 'L 1.91 m · Anch. 57 cm · Alt. 50 cm', internas: 'L 1.81 m · Anch. 49 cm · Alt. 30 cm' },
      { forma: 'redondo', externas: 'L 1.93 m · Anch. 57 cm · Alt. 50 cm', internas: 'L 1.81 m · Anch. 49 cm · Alt. 30 cm' },
    ],
    tono: 'oscuro',
    grupos: [
      { titulo: 'Ceremonia', items: [
        'Capilla ardiente de madera con pedestales para flores (una noche)',
        'Velatorio (una noche)',
        'Misa de cuerpo presente en Jardines de la Paz',
        'Arreglos florales para pedestales, manto y corona o cruz',
        'Cuatro cargadores',
      ] },
      { titulo: 'Traslado', items: ['Carroza extra lujo', 'Un coche portaflores'] },
      { titulo: 'Atención', items: [
        'Preparación tanatológica',
        'Trámites y traslados',
        'Atención personalizada',
        'Obituario en línea y Mural de Memorias',
      ] },
    ],
    cortesia: MOVILIDAD_A_ELEGIR,
  },
  {
    id: 'premium',
    nombre: 'Premium',
    lema: 'Ataúd Premium, carroza de lujo y capilla ardiente de madera.',
    ataud: 'Ataúd de madera modelo Premium, cuadrado o redondo',
    formas: [
      { forma: 'cuadrado', externas: 'L 1.94 m · Anch. 62 cm · Alt. 47 cm', internas: 'L 1.84 m · Anch. 52 cm · Alt. 29 cm' },
      { forma: 'redondo', externas: 'L 1.94 m · Anch. 62 cm · Alt. 47 cm', internas: 'L [DATO POR CONFIRMAR] · Anch. 52 cm · Alt. 29 cm' },
    ],
    tono: 'salvia',
    grupos: [
      { titulo: 'Ceremonia', items: [
        'Capilla ardiente de madera (una noche)',
        'Velatorio (una noche)',
        'Misa de cuerpo presente en Jardines de la Paz',
        'Arreglos florales: manto y corona o cruz',
        'Cuatro cargadores',
      ] },
      { titulo: 'Traslado', items: ['Carroza de lujo', 'Un coche portaflores'] },
      { titulo: 'Atención', items: [
        'Preparación tanatológica',
        'Trámites y traslados',
        'Atención personalizada',
        'Obituario en línea y Mural de Memorias',
      ] },
    ],
    cortesia: MOVILIDAD_A_ELEGIR,
  },
  {
    id: 'especial',
    nombre: 'Especial',
    lema: 'Un servicio completo con carroza de lujo, misa y arreglo floral.',
    ataud: 'Ataúd de madera modelo Especial, cuadrado',
    formas: [
      { forma: 'cuadrado', externas: 'L 1.92 m · Anch. 57 cm · Alt. 50 cm', internas: 'L 1.80 m · Anch. 45.5 cm · Alt. 30 cm' },
    ],
    tono: 'piedra',
    grupos: [
      { titulo: 'Ceremonia', items: [
        'Capilla ardiente (una noche)',
        'Velatorio (una noche)',
        'Misa de cuerpo presente en Jardines de la Paz',
        'Arreglo floral: manto',
        'Cuatro cargadores',
      ] },
      { titulo: 'Traslado', items: ['Carroza de lujo', 'Un coche portaflores'] },
      { titulo: 'Atención', items: [
        'Preparación tanatológica',
        'Trámites y traslados',
        'Atención personalizada',
        'Obituario en línea y Mural de Memorias',
      ] },
    ],
    cortesia: 'Cintas de Honor Jardines y movilidad en miniván para 10 pasajeros.',
  },
  {
    id: 'clasico',
    nombre: 'Clásico',
    lema: 'Lo esencial para una despedida digna, con velatorio y cargadores.',
    ataud: 'Ataúd de madera modelo Florencia, cuadrado',
    formas: [
      { forma: 'cuadrado', externas: 'L 1.93 m · Anch. 57 cm · Alt. 50 cm', internas: 'L 1.80 m · Anch. 47 cm · Alt. 30 cm' },
    ],
    tono: 'bosque',
    grupos: [
      { titulo: 'Ceremonia', items: ['Capilla ardiente (una noche)', 'Velatorio (una noche)', 'Cuatro cargadores'] },
      { titulo: 'Traslado', items: ['Carroza', 'Un coche portaflores'] },
      { titulo: 'Atención', items: [
        'Preparación tanatológica',
        'Trámites y traslados',
        'Atención personalizada',
        'Obituario en línea y Mural de Memorias',
      ] },
    ],
    cortesia: 'Cintas de Honor Jardines.',
  },
  {
    id: 'tradicional',
    nombre: 'Tradicional',
    lema: 'El servicio básico, con lo necesario para la despedida.',
    ataud: 'Ataúd de madera modelo Nápoles, cuadrado',
    formas: [
      { forma: 'cuadrado', externas: 'L 1.93 m · Anch. 59 cm · Alt. 43 cm', internas: 'L 1.80 m · Anch. 46.5 cm · Alt. 30 cm' },
    ],
    tono: 'niebla',
    grupos: [
      { titulo: 'Ceremonia', items: ['Capilla ardiente (una noche)'] },
      { titulo: 'Traslado', items: ['Carroza', 'Un coche portaflores'] },
      { titulo: 'Atención', items: [
        'Preparación tanatológica',
        'Trámites y traslados',
        'Atención personalizada',
        'Obituario en línea y Mural de Memorias',
      ] },
    ],
    cortesia: 'Cintas de Honor Jardines.',
  },
];

export const notasServicios = [
  'Para entierro o cremación, hacia todos los camposantos de Lima.',
  'Madera y modelo de ataúd sujetos a disponibilidad de mercado.',
  'En cremaciones se incluye alquiler de ataúd, urna para cenizas, trámites ante la Autoridad de Salud y necropsia de ley.',
  'Velatorio sujeto a disponibilidad del local elegido; incluye una noche. Misa de cuerpo presente en las capillas de Jardines de la Paz, sujeta a disponibilidad.',
  'Las imágenes son referenciales. Fuente: catálogo de servicio funerario Jardines de la Paz, vigencia agosto 2026.',
];
