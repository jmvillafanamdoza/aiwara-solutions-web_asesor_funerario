// Acceso a las imágenes por ESPACIO (clave de imagenes.mapa.json).
// Las imágenes salen de src/assets/img/<espacio>.jpg (generadas con npm run imagenes)
// y el texto alternativo sale del mismo mapa, así todo se cambia en un solo lugar.
import type { ImageMetadata } from 'astro';
import mapa from '../../imagenes.mapa.json';

const archivos = import.meta.glob<{ default: ImageMetadata }>('../assets/img/*.jpg', { eager: true });

export type Espacio = keyof typeof mapa.imagenes;

export function imagen(espacio: Espacio): { src: ImageMetadata; alt: string } {
  const archivo = archivos[`../assets/img/${espacio}.jpg`];
  if (!archivo) throw new Error(`Falta la imagen del espacio "${espacio}". Ejecute npm run imagenes.`);
  return { src: archivo.default, alt: mapa.imagenes[espacio].alt };
}
