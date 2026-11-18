# Web de Marco Antonio Villafana Fajardo · Asesor Funerario Autorizado de Jardines de la Paz

Sitio estático en **Astro 7.3** (sin backend) para captar contactos desde Google Ads, Meta Ads y búsqueda orgánica.
Dominio previsto: `asesorfunerariolima.com` (se cambia en `src/config/site.ts`).

| Página | URL | Para qué |
|---|---|---|
| Inicio | `/` | Presentación de Marco, camposantos, por qué un asesor, testimonios, contacto |
| Servicio funerario | `/servicio-funerario` | Necesidad inmediata: teléfono 24 h, carrusel de servicios, primeras horas, 4 servicios sin precios (Platinum, Premium, Especial y Tradicional, con ataúd y carroza; el Clásico se retiró de la venta), Cenizas al mar, Centro Funerario (cremación), descarga del catálogo PDF, traslados y trámites |
| Plan funerario | `/plan-funerario` | Previsión: beneficios, opciones y formulario de cotización que abre WhatsApp |
| Privacidad | `/privacidad` | Política de datos (Ley 29733) y cookies. **Texto base: requiere revisión legal** |

---

## 1. Verlo en su computadora

Requisitos: Node.js **22.12 o superior** (probado con 22.16).

```bash
cd "D:\Papá\Asesor - Jardines de la Paz\Proyecto Marketing Digital\web"
npm install          # solo la primera vez
npm run dev          # modo edición: http://localhost:4321 (se recarga al guardar)
```

Para ver la versión final tal como quedará publicada:

```bash
npm run build        # genera la carpeta dist/
npm run preview      # http://localhost:4321
```

> Astro 7.4+ exige Node 22.23 o superior. Por eso el proyecto está fijado en **Astro 7.3.8**, que funciona con el Node actual de esta PC. Si actualiza Node, puede actualizar Astro.

---

## 2. Dónde se cambia cada cosa

| Qué | Archivo |
|---|---|
| Dominio, teléfono, WhatsApp, correo, redes, direcciones, mensajes de WhatsApp por página, IDs de medición, menú | `src/config/site.ts` (**único lugar**) |
| Imágenes y logo (qué archivo va en cada espacio, recortes, textos alternativos; las 3 fotos del hero son hero-inicio, hero-2 y hero-3) | `imagenes.mapa.json` → ver sección 6 |
| Lista de servicios funerarios y lo que incluyen, medidas de ataúdes y Cenizas al mar (fuente: catálogo 2026) | `src/data/servicios.ts`; diseño en `src/components/PlanesServicio.astro`, `CenizasAlMar.astro` y el carrusel del hero en `CarruselServicios.astro`; imágenes extraídas del catálogo en `fuentes/catalogo-2026/` |
| Centro Funerario (tercera sede, solo cremación, Villa El Salvador) | Textos y servicios en `src/data/servicios.ts` (`centroFunerario`); dirección, mapa y horario en `src/config/site.ts` (`sedes`); diseño en `src/components/CentroFunerario.astro`; fotos `cf-*` (catálogo de camposantos, págs. 86, 87, 88, 91 y 97) |
| Catálogo PDF que se descarga (portada con los datos de Marco) | `npm run catalogo` → `public/catalogo-servicio-funerario-2026.pdf`; ruta y peso del botón en `src/config/site.ts` → `catalogoPdf` (ver sección 6) |
| Testimonios | `src/components/Testimonios.astro` |
| Opciones del formulario ("¿Qué le interesa?") | `src/components/FormCotizacion.astro` |
| Textos de cada página | `src/pages/*.astro` |
| Colores, tipografía, botones | `src/styles/global.css` |

Después de cualquier cambio: `npm run build` (y volver a desplegar, ver sección 3).

---

## 3. Publicar en Cloudflare Pages (gratis)

### Opción A · Recomendada: desde GitHub (se publica solo con cada cambio)

1. Cree un repositorio **privado** en GitHub y suba esta carpeta `web/` (ya es un repositorio git con un primer commit):
   ```bash
   git remote add origin https://github.com/<usuario>/web-marco-villafana.git
   git push -u origin main
   ```
2. En <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → elija el repositorio.
3. Configuración de compilación:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Variable de entorno: `NODE_VERSION` = `22.16.0`
4. **Save and Deploy**. Quedará en una dirección tipo `web-marco-villafana.pages.dev`.

### Opción B · Subida directa (sin GitHub)

```bash
npm run build
npx wrangler login
npx wrangler pages deploy dist --project-name web-marco-villafana
```

### Conectar el dominio `asesorfunerariolima.com`

1. Compre el dominio (en Cloudflare Registrar es lo más simple; o en otro registrador).
2. Si lo compró fuera de Cloudflare: en Cloudflare → **Add a site** → escriba el dominio → plan **Free** → cambie los **nameservers** en su registrador por los dos que le indique Cloudflare (tarda de minutos a 24 h).
3. En el proyecto de Pages → **Custom domains** → **Set up a custom domain** → `asesorfunerariolima.com`. Agregue también `www.asesorfunerariolima.com`.
4. Para que `www` lleve al dominio principal: **Rules → Redirect Rules** → `www.asesorfunerariolima.com/*` → `https://asesorfunerariolima.com/${1}` (301).
5. Si el dominio final es otro, cambie `DOMINIO` en `src/config/site.ts` y vuelva a publicar (actualiza canonical, Open Graph, sitemap, robots.txt y datos estructurados).

---

## 4. Medición (Google Tag Manager, GA4 y Pixel de Meta)

Los IDs están como placeholders en `src/config/site.ts` → `tracking`. Mientras tengan `XXXX` no se carga nada.

- **Nada se carga hasta que la persona acepta las cookies** (banner inferior; se puede cambiar en "Configurar cookies" al pie). Consent Mode v2 se inicia en "denegado".
- Si hay `gtmId` válido, se carga **solo GTM** y GA4 y el Pixel se configuran dentro de GTM (recomendado).
- Si no hay GTM, se cargan GA4 y el Pixel directamente con sus IDs.

Eventos que se envían al `dataLayer` (y directo a GA4/Pixel si no hay GTM):

| Evento | Cuándo | Datos |
|---|---|---|
| `whatsapp_click` | Clic en cualquier enlace de WhatsApp | `pagina`, `ubicacion` (flotante, hero, contacto, barra-movil, servicio-premium…) |
| `call_click` | Clic en cualquier enlace de llamada | `pagina`, `ubicacion` |
| `form_submit` | Envío válido del formulario de cotización | `pagina`, `interes`, `distrito` |
| `recorrido_3d_click` | Clic en "Recorrido virtual 3D" (La Molina o Lurín; se distingue por `ubicacion`) | `pagina`, `ubicacion` |
| `catalogo_descarga` | Clic en "Descargar el catálogo" (PDF) | `pagina`, `ubicacion` (hero, servicios-intro) |

En GTM: cree activadores de **Evento personalizado** con esos nombres y variables de capa de datos `pagina`, `ubicacion`, `interes`. Para Meta use `Contact` (clics de contacto), `Lead` (formulario) y los eventos personalizados `Recorrido3D` y `DescargaCatalogo`; en Google Ads, márquelos como conversiones.

---

## 5. Pendientes y reglas de contenido

La web ya no muestra marcadores amarillos: lo que no está en la información entregada (catálogos, brochures) no se publica.

| Pendiente | Dónde | Qué falta |
|---|---|---|
| IDs `GTM-XXXXXXX`, `G-XXXXXXXXXX`, Pixel | `src/config/site.ts` | IDs reales de medición |
| Revisión legal | `/privacidad` | La política es un texto base: conviene que la revise un abogado antes de publicar (fecha puesta: 17 de noviembre de 2026) |
| Largo interno del ataúd redondo Premium | `src/data/servicios.ts` | El catálogo 2026 dice "1.84.5mt" (errata); se muestran solo ancho y alto hasta tener el dato |

**Formas de pago (regla del negocio, no cambiar sin consultar a Marco):**
- **Necesidad inmediata** (servicio funerario para sepelio o cremación): **solo al contado**, no se financia. Lo dice la nota de `/servicio-funerario`.
- **Previsión** (planes a futuro: servicio funerario, lotes, nichos, cinerarios, mausoleos): **al contado o en cuotas sin intereses**.

**Datos y textos que Marco debe validar** (no son marcadores, pero conviene confirmarlos):
- **Consentimiento** de las 5 personas de los testimonios para publicarlos (Ley 29733); los 3 sin nombre se firman "Familia atendida por Marco" (no se inventan nombres ni distritos).
- Que el número **998 160 591 atiende 24 horas** (se muestra en toda la web y en los datos estructurados).
- Los pasos de "Qué hacer en las primeras horas" (`/servicio-funerario`).
- "**Cuotas sin intereses**" y "**ahorro por compra anticipada**" en previsión: confirmados por el usuario el 2026-11-17.
- Lotes, Praderas de la Paz (lotes y nichos **por 10 años**, en La Molina y Lurín), nichos, cinerarios y mausoleos de `/plan-funerario`: tomados del catálogo de camposantos (`CATALOGO NUEVO FINAL.pdf`). No se usa la palabra "perpetuo" porque el catálogo no la menciona.
- Usuario de LinkedIn: se usó `linkedin.com/in/marco-villafana`.
- Lo que incluye cada servicio (`src/data/servicios.ts`) se tomó de los brochures de necesidad inmediata.
- Las medidas de los ataúdes (`formas` en `src/data/servicios.ts`) se tomaron del catálogo 2026 (`CatalogoSSFF2026_F.pdf`, notas al pie de cada servicio).

---

## 6. Imágenes (mapeadas para reemplazarlas después)

Cada foto de la web ocupa un **espacio** con nombre (`hero-inicio`, `marco-retrato`, `serv-capilla`…). La relación espacio → archivo original está en **`imagenes.mapa.json`**, y la tabla legible en **`IMAGENES.md`** (columna "¿Reemplazar?").

Para cambiar una foto:
1. Deje la foto nueva en cualquier carpeta del proyecto de marketing (por ejemplo `02_Fotos_Camposanto/...`).
2. En `imagenes.mapa.json`, cambie `origen` del espacio (ruta relativa a `web/`). Si la foto nueva no necesita recorte, ponga `"recorte": null`; actualice `alt` si cambia lo que muestra.
3. `npm run imagenes` (copia, recorta y regenera `src/assets/img/` e `IMAGENES.md`; los originales no se tocan).
4. `npm run build` y publicar. Astro genera solas las versiones WebP en varios tamaños.

Si el original de un espacio no está en la PC (por ejemplo en la oficina, donde no existen las carpetas de fuera del repo), `npm run imagenes` conserva la imagen ya generada y su fila en `IMAGENES.md`. Para cambiar una foto en esa PC, cópiela a `fuentes/` y apunte ahí el `origen`.

Ataúdes de cada servicio (franja debajo de la tarjeta en `/servicio-funerario`): espacios `serv-<servicio>-ataud` (cuadrado cerrado), `-ataud-abierto`, y en Platinum y Premium también `-ataud-redondo` y `-ataud-redondo-abierto`. Fotos extraídas del catálogo 2026 en `fuentes/catalogo-2026/`.

Espacios marcados para reemplazar: retrato de Marco (es un recorte de una pieza de Facebook) y las 3 fotos de catálogo del servicio sin uso (capilla, carroza, ataúd).

Fotos del catálogo de camposantos (`fuentes/catalogo-2026/CATALOGO NUEVO FINAL.pdf`, 167 MB): **no se sube a GitHub** (supera el límite de 100 MB; está en `.gitignore`). Las fotos usadas se recortaron de sus páginas y están en `fuentes/catalogo-nuevo/`: pág. 6 (`cs-la-molina`), 12 (`plan-hero`), 22 (`plan-nichos`), 26 (`plan-cinerarios`), 32 (`plan-mausoleos`, lápidas difuminadas) y 58 (`plan-praderas` y `cs-lurin`); del Centro Funerario, 88 (`cf-capilla`), 86 (`cf-instalaciones`), 87 (`cf-jardin`), 91 (`cf-sala-espera`) y 97 (`cf-cafeteria`). La central (710-5000) y el correo de informes del catálogo no se publican: el contacto de la web es solo el de Marco. No se usaron la 25 ni la 54 (nombres legibles en casi todos los nichos) ni la 27 (fotos de apoyo). Para difuminar con bordes suaves, agregue `"bordeSuave": 12` al espacio (radio de suavizado; la transición mide unas 3 veces ese valor) en `imagenes.mapa.json`.

No se usaron: `zona-lapidas` 01-03 (nombres legibles), `99-Descartar`, ni el archivo de credenciales.

### Catálogo PDF descargable

El botón "Descargar el catálogo" de `/servicio-funerario` entrega `public/catalogo-servicio-funerario-2026.pdf`, generado a partir del catálogo oficial `fuentes/catalogo-2026/CatalogoSSFF2026_F.pdf` (que no se modifica):

```bash
npm run catalogo
```

El script completa en la portada los campos "Representante" y "Teléfono" con los datos de `src/config/site.ts`, quita las páginas finales de notas en blanco y recomprime las fotos (de 8.4 MB a unos 3.8 MB). Si llega un catálogo nuevo: reemplace el archivo en `fuentes/catalogo-2026/`, revise en el script las páginas a quitar y la posición de los campos de la portada, ejecute `npm run catalogo` y actualice el peso en `catalogoPdf`.

---

## 7. Fase 2 (preparada, no construida)

Páginas previstas: `/cremacion`, `/camposanto-la-molina`, `/camposanto-lurin`, `/guias`.

Para agregar cada una:
1. Cree `src/pages/<nombre>.astro` copiando la estructura de `plan-funerario.astro` (usa `Base`, `Contacto` y, si aplica, `FormCotizacion`).
2. Agregue su mensaje de WhatsApp en `mensajesWhatsApp` de `src/config/site.ts` (clave = id de página).
3. En `nav` de `src/config/site.ts`, cambie `activo: false` a `true`. Aparece en el menú y en el sitemap automáticamente.
4. Si usa fotos nuevas, agréguelas como espacios en `imagenes.mapa.json`.

Falta para fase 2: contenido de cremación (precios/condiciones del crematorio La Molina), fotos propias en alta resolución de cada sede, dirección de Lurín y las guías (por ejemplo "Qué hacer ante la pérdida de un familiar", "Cómo elegir un plan funerario", tomando las piezas de `04_Facebook/Albumes-Jardines/04-Guia-para-la-familia`).

---

## 8. Estructura

```
web/
├─ astro.config.mjs          URLs limpias, sitemap
├─ imagenes.mapa.json        espacio → foto original (+ recorte y alt)
├─ IMAGENES.md               tabla generada del mapa
├─ scripts/preparar-imagenes.mjs
├─ public/                   favicon, og-default.jpg, _headers (Cloudflare)
└─ src/
   ├─ config/site.ts         configuración única
   ├─ data/servicios.ts      servicios funerarios
   ├─ layouts/Base.astro     <head>: SEO, Open Graph, JSON-LD FuneralHome, consentimiento
   ├─ components/            Header, Footer, WhatsAppFlotante, BarraLlamada, BannerCookies,
   │                         Contacto, Testimonios, FormCotizacion, Icono
   ├─ pages/                 index, servicio-funerario, plan-funerario, privacidad, 404, robots.txt
   ├─ scripts/               sitio.ts (menú, cookies, clics), medicion.ts (GTM/GA4/Pixel)
   ├─ assets/img/            imágenes generadas desde el mapa
   └─ styles/global.css
```
