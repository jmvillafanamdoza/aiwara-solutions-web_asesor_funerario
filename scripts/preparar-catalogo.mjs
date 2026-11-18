// Prepara el catálogo PDF que se descarga desde la web.
// Uso: npm run catalogo
// - Parte del catálogo oficial (fuentes/catalogo-2026/CatalogoSSFF2026_F.pdf), que NUNCA se modifica.
// - Completa en la portada los campos "Representante" y "Teléfono" con los datos de src/config/site.ts.
// - Quita las páginas de servicios que ya no se venden (Clásico) y las de "notas" en blanco, y borra el
//   Clásico del índice y del título de urnas (ver PAGINAS_A_QUITAR y el paso 2).
// - Recomprime las fotos para que pese menos en celular.
// - Guarda el resultado en public/catalogo-servicio-funerario-2026.pdf (se publica con la web).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { PDFDocument, PDFName, PDFNumber, PDFRawStream, StandardFonts, rgb } from 'pdf-lib';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGEN = path.join(raiz, 'fuentes', 'catalogo-2026', 'CatalogoSSFF2026_F.pdf');
const DESTINO = path.join(raiz, 'public', 'catalogo-servicio-funerario-2026.pdf');

/**
 * Páginas del PDF (contando desde 1) que no se publican:
 * - 6: servicio Clásico (retirado de la venta el 2026-11-18).
 * - 14 y 15: solo líneas de "notas" en blanco.
 */
const PAGINAS_A_QUITAR = [6, 14, 15];
/** Lado mayor máximo de cada foto (px) y calidad JPEG. Las páginas miden unos 567 pt de ancho. */
const LADO_MAX = 1600;
const CALIDAD = 72;

// Datos de contacto: se leen de src/config/site.ts (único lugar donde se cambian).
const site = fs.readFileSync(path.join(raiz, 'src', 'config', 'site.ts'), 'utf8');
// Solo claves de primer nivel de SITE (2 espacios de sangría), para no tomar, por ejemplo, el nombre de una sede.
const dato = (clave) => {
  const m = site.match(new RegExp(`^  ${clave}: (?:'([^']+)'|(true|false))`, 'm'));
  if (!m) throw new Error(`No se encontró "${clave}" en el primer nivel de SITE (src/config/site.ts)`);
  return m[1] ?? m[2] === 'true';
};
const nombre = dato('nombre');
const cargo = dato('cargo');
const telefono = dato('telefonoVisible');
const correo = dato('correo');
// El texto "(WhatsApp, 24 horas)" solo es cierto si el WhatsApp es el mismo número y se atiende 24 h.
const mismoWhatsApp = `+${dato('whatsapp')}` === dato('telefonoE164');
const atiende24h = dato('atencion24h') === true;
const detalleTelefono = [mismoWhatsApp && 'WhatsApp', atiende24h && '24 horas'].filter(Boolean).join(', ');

const doc = await PDFDocument.load(fs.readFileSync(ORIGEN));
const total = doc.getPageCount();

// 1. Portada: tapar los puntos de cada campo con el color del panel y escribir encima.
//    Posiciones medidas en el PDF original (puntos tipográficos, origen abajo a la izquierda).
const portada = doc.getPage(0);
const negrita = await doc.embedFont(StandardFonts.HelveticaBold);
const normal = await doc.embedFont(StandardFonts.Helvetica);
const panel = rgb(200 / 255, 220 / 255, 200 / 255);
const verde = rgb(0x1f / 255, 0x4d / 255, 0x36 / 255);
const FIN_LINEA = 256;
const campos = [
  { x: 92.5, y: 543.6, texto: nombre, fuente: negrita },
  { x: 28.3, y: 521.6, texto: `${cargo} de Jardines de la Paz`, fuente: normal },
  { x: 67.5, y: 499.6, texto: detalleTelefono ? `${telefono} (${detalleTelefono})` : telefono, fuente: negrita },
  { x: 28.3, y: 477.6, texto: correo, fuente: normal },
];
for (const c of campos) {
  let tam = 9;
  while (c.fuente.widthOfTextAtSize(c.texto, tam) > FIN_LINEA - c.x - 2 && tam > 6) tam -= 0.25;
  portada.drawRectangle({ x: c.x, y: c.y - 3, width: FIN_LINEA - c.x, height: 12, color: panel });
  portada.drawText(c.texto, { x: c.x + 1, y: c.y, size: tam, font: c.fuente, color: verde });
}

// 2. Servicio Clásico retirado: borrarlo del índice y del título de urnas (posiciones medidas en el original).
const blanco = rgb(1, 1, 1);
const original = await PDFDocument.load(fs.readFileSync(ORIGEN));
//    Índice (pág. 2): se tapan las líneas "Clásico" (y 364) y "Tradicional" (y 340), y se vuelve a dibujar
//    "Tradicional" en el lugar de "Clásico", copiada del original para conservar la misma tipografía.
const indice = doc.getPage(1);
const lineaTradicional = await doc.embedPage(original.getPage(1), { left: 26, bottom: 337, right: 120, top: 351 });
indice.drawRectangle({ x: 26, y: 335, width: 120, height: 41, color: blanco });
indice.drawPage(lineaTradicional, { x: 26, y: 337 + 24 });
//    Urnas (pág. 10): "PLAN TRADICIONAL, CLÁSICO" queda como "PLAN TRADICIONAL".
doc.getPage(9).drawRectangle({ x: 407.5, y: 230, width: 50, height: 14, color: blanco });

// 3. Quitar páginas: se copian solo las que se conservan a un documento nuevo. Así tampoco quedan dentro
//    del archivo las fotos de las páginas quitadas. (No se usa removePage: en pdf-lib 1.17 deja desactualizada
//    la lista de páginas y copyPages terminaba copiando las equivocadas.)
for (const n of PAGINAS_A_QUITAR) if (n < 1 || n > total) throw new Error(`El catálogo tiene ${total} páginas; revise PAGINAS_A_QUITAR.`);
const conservar = doc.getPageIndices().filter((i) => !PAGINAS_A_QUITAR.includes(i + 1));
const final = await PDFDocument.create();
for (const p of await final.copyPages(doc, conservar)) final.addPage(p);
// Conservar el idioma del documento (lo usan los lectores de pantalla).
const idioma = doc.catalog.get(PDFName.of('Lang'));
if (idioma) final.catalog.set(PDFName.of('Lang'), idioma);

// 4. Recomprimir las fotos JPEG (las que ocupan casi todo el peso). Solo se reemplaza si queda más liviana.
let antes = 0;
let despues = 0;
for (const [ref, obj] of final.context.enumerateIndirectObjects()) {
  if (!(obj instanceof PDFRawStream)) continue;
  const d = obj.dict;
  if (d.get(PDFName.of('Subtype'))?.toString() !== '/Image') continue;
  if (d.get(PDFName.of('Filter'))?.toString() !== '/DCTDecode') continue;
  try {
    // Solo fotos RGB: las CMYK (p. ej. las rosas de la portada) se invierten al convertirlas y las de
    // escala de grises suelen ser máscaras de transparencia que deben seguir en gris. Esas quedan intactas.
    const info = await sharp(obj.contents).metadata();
    if (info.space !== 'srgb' || info.channels !== 3) continue;
    const nuevo = await sharp(obj.contents)
      .resize({ width: LADO_MAX, height: LADO_MAX, fit: 'inside', withoutEnlargement: true })
      .toColourspace('srgb')
      .jpeg({ quality: CALIDAD, mozjpeg: true })
      .toBuffer({ resolveWithObject: true });
    antes += obj.contents.length;
    if (nuevo.data.length >= obj.contents.length) { despues += obj.contents.length; continue; }
    const dict = d.clone(final.context);
    dict.set(PDFName.of('Width'), PDFNumber.of(nuevo.info.width));
    dict.set(PDFName.of('Height'), PDFNumber.of(nuevo.info.height));
    dict.set(PDFName.of('ColorSpace'), PDFName.of('DeviceRGB'));
    dict.set(PDFName.of('BitsPerComponent'), PDFNumber.of(8));
    dict.delete(PDFName.of('Decode'));
    dict.delete(PDFName.of('DecodeParms'));
    dict.set(PDFName.of('Length'), PDFNumber.of(nuevo.data.length));
    final.context.assign(ref, PDFRawStream.of(dict, nuevo.data));
    despues += nuevo.data.length;
  } catch (e) {
    console.warn(`Aviso: una foto no se pudo recomprimir y queda igual (${e.message}).`);
  }
}

final.setTitle('Catálogo de servicio funerario Jardines de la Paz 2026');
final.setAuthor(`${nombre}, ${cargo}`);
final.setSubject(`Su asesor: ${nombre} · ${telefono} · ${correo}`);

const bytes = await final.save({ useObjectStreams: true });
fs.writeFileSync(DESTINO, bytes);
const mb = (n) => (n / 1e6).toFixed(1) + ' MB';
console.log(`Fotos: ${mb(antes)} → ${mb(despues)}`);
const pesoBoton = `${(bytes.length / 1e6).toFixed(1)} MB`;
if (!site.includes(`peso: '${pesoBoton}'`)) console.warn(`Aviso: actualice catalogoPdf.peso en src/config/site.ts a '${pesoBoton}'.`);
console.log(`Catálogo listo: ${path.relative(raiz, DESTINO)} (${mb(bytes.length)}, ${final.getPageCount()} páginas; original ${mb(fs.statSync(ORIGEN).size)}, ${total} páginas)`);
