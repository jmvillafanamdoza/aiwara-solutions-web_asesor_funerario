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
let conservadas = 0;
const filas = [];
for (const [clave, d] of Object.entries(mapa.imagenes)) {
  try {
    // formato "png" conserva la transparencia (logos); el resto se guarda como JPG.
    const png = d.formato === 'png';
    const salida = path.join(destino, `${clave}.${png ? 'png' : 'jpg'}`);
    const fila = (m) => `| \`${clave}\` | ${d.usado_en} | ${m.width}x${m.height} | ${d.reemplazar ? '**Sí**' : 'No'} | \`${d.origen}\`${d.recorte ? ' (recortada)' : ''}${d.difuminar ? ' (zonas difuminadas)' : ''} | ${d.nota ?? ''} |`;
    // Si el original no está en esta PC (p. ej. carpetas de fuera del repo) pero la imagen ya fue
    // generada antes, se conserva tal cual y se mantiene su fila en IMAGENES.md.
    // (Se busca en ambos formatos y no se borra nada: si se cambió "formato" sin tener el original, queda la copia vieja.)
    if (!fs.existsSync(path.resolve(raiz, d.origen))) {
      const existente = [salida, path.join(destino, `${clave}.${png ? 'jpg' : 'png'}`)].find((f) => fs.existsSync(f));
      if (existente) {
        conservadas++;
        filas.push(fila(await sharp(existente).metadata()));
        console.log(`--  ${clave}  original no disponible en esta PC; se conserva ${path.basename(existente)}`);
        continue;
      }
    }
    // "difuminar": [{x,y,w,h}, ...] desenfoca zonas (por ejemplo nombres en lápidas), en píxeles ya recortados.
    let buf = await cargar(d.origen, d.recorte).toBuffer();
    // "bordeSuave": n (opcional) es el radio de suavizado del borde del difuminado, para que no se vean
    // rectángulos (la transición mide unas 3 veces n). La máscara se agranda 2n por lado para que cada zona
    // quede difuminada al 100% hasta su borde.
    if (d.difuminar?.length && d.bordeSuave !== undefined) {
      const s = Number(d.bordeSuave);
      if (typeof d.bordeSuave !== 'number' || !(s >= 0.3)) throw new Error('bordeSuave debe ser un número mayor o igual a 0.3');
      if (png) throw new Error('bordeSuave no se puede usar en imágenes PNG con transparencia');
      const { width: W, height: H } = await sharp(buf).metadata();
      const m = 2 * s;
      const rects = d.difuminar.map((z) => `<rect x="${z.x - m}" y="${z.y - m}" width="${z.w + 2 * m}" height="${z.h + 2 * m}" fill="#fff"/>`).join('');
      const mascara = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="#000"/>${rects}</svg>`))
        .blur(s).extractChannel(0).toBuffer();
      // En dos pasos: sharp aplica removeAlpha después de joinChannel y borraría la máscara.
      const borrosa = await sharp(buf).removeAlpha().blur(9).toBuffer();
      const capa = await sharp(borrosa).joinChannel(mascara).png().toBuffer();
      buf = await sharp(buf).composite([{ input: capa }]).toBuffer();
    } else {
      for (const z of d.difuminar ?? []) {
        const pieza = await sharp(buf).extract({ left: z.x, top: z.y, width: z.w, height: z.h }).blur(9).toBuffer();
        buf = await sharp(buf).composite([{ input: pieza, left: z.x, top: z.y }]).toBuffer();
      }
    }
    const img = sharp(buf).resize({ width: 2000, withoutEnlargement: true });
    await (png ? img.png({ compressionLevel: 9 }) : img.flatten({ background: '#ffffff' }).jpeg({ quality: 90, mozjpeg: true })).toFile(salida);
    // Recién con la salida escrita se borra la copia del otro formato (si cambió "formato").
    for (const ext of ['jpg', 'png']) { const vieja = path.join(destino, `${clave}.${ext}`); if (vieja !== salida && fs.existsSync(vieja)) fs.rmSync(vieja); }
    const m = await sharp(salida).metadata();
    filas.push(fila(m));
    console.log(`ok  ${clave}  ${m.width}x${m.height}`);
  } catch (e) {
    errores++;
    console.error(`ERR ${clave}: ${e.message}`);
  }
}

const ogSalida = path.join(raiz, 'public', 'og-default.jpg');
if (!fs.existsSync(path.resolve(raiz, mapa.og.origen)) && fs.existsSync(ogSalida)) {
  console.log('--  og-default  original no disponible en esta PC; se conserva la imagen ya generada');
} else try {
  await cargar(mapa.og.origen, mapa.og.recorte)
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(ogSalida);
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
if (conservadas) console.log(`\nAviso: ${conservadas} espacio(s) conservados sin regenerar (original no disponible en esta PC). Si cambió su recorte o difuminado en el mapa, regenérelos en la PC que tiene los originales.`);
if (errores) process.exit(1);
