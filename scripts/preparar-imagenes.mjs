// Prepara las imágenes de la web a partir de imagenes.mapa.json.
// Uso: npm run imagenes
// - Lee cada espacio del mapa, recorta (si corresponde) y guarda una copia en src/assets/img/<espacio>.jpg
//   (o .png si el espacio tiene "formato": "png"; Astro luego genera las versiones WebP responsivas al compilar).
// - Genera public/og-default.jpg (1200x630) para compartir en redes.
// - Escribe IMAGENES.md con la tabla de espacios para revisar qué falta reemplazar.
// Los archivos originales NUNCA se modifican.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mapa = JSON.parse(fs.readFileSync(path.join(raiz, 'imagenes.mapa.json'), 'utf8'));
const destino = path.join(raiz, 'src', 'assets', 'img');
fs.mkdirSync(destino, { recursive: true });

function cargar(origen, recorte) {
  const ruta = path.resolve(raiz, origen);
  if (!fs.existsSync(ruta)) throw new Error(`No existe el origen: ${origen}`);
  let img = sharp(ruta).rotate();
  if (recorte) img = img.extract({ left: recorte.x, top: recorte.y, width: recorte.w, height: recorte.h });
  return img;
}

let errores = 0;
const filas = [];
for (const [clave, d] of Object.entries(mapa.imagenes)) {
  try {
    // formato "png" conserva la transparencia (logos); el resto se guarda como JPG.
    const png = d.formato === 'png';
    const salida = path.join(destino, `${clave}.${png ? 'png' : 'jpg'}`);
    for (const ext of ['jpg', 'png']) { const vieja = path.join(destino, `${clave}.${ext}`); if (vieja !== salida && fs.existsSync(vieja)) fs.rmSync(vieja); }
    const img = cargar(d.origen, d.recorte).resize({ width: 2000, withoutEnlargement: true });
    await (png ? img.png({ compressionLevel: 9 }) : img.jpeg({ quality: 90, mozjpeg: true })).toFile(salida);
    const m = await sharp(salida).metadata();
    filas.push(`| \`${clave}\` | ${d.usado_en} | ${m.width}x${m.height} | ${d.reemplazar ? '**Sí**' : 'No'} | \`${d.origen}\`${d.recorte ? ' (recortada)' : ''} | ${d.nota ?? ''} |`);
    console.log(`ok  ${clave}  ${m.width}x${m.height}`);
  } catch (e) {
    errores++;
    console.error(`ERR ${clave}: ${e.message}`);
  }
}

try {
  await cargar(mapa.og.origen, mapa.og.recorte)
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(path.join(raiz, 'public', 'og-default.jpg'));
  console.log('ok  og-default 1200x630');
} catch (e) {
  errores++;
  console.error(`ERR og: ${e.message}`);
}

const md = `# Mapa de imágenes

Generado por \`npm run imagenes\` a partir de \`imagenes.mapa.json\`. No editar a mano.

Para cambiar una imagen: edite \`origen\` (y \`recorte\` si hace falta) en \`imagenes.mapa.json\`, ejecute \`npm run imagenes\` y luego \`npm run build\`.

| Espacio | Dónde se usa | Medida final | ¿Reemplazar? | Origen | Nota |
|---|---|---|---|---|---|
${filas.join('\n')}
| \`og\` | ${mapa.og.usado_en} | 1200x630 | No | \`${mapa.og.origen}\` | |
`;
fs.writeFileSync(path.join(raiz, 'IMAGENES.md'), md);
if (errores) process.exit(1);
