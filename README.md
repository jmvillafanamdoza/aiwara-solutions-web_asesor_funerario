# Web de Marco Antonio Villafana Fajardo · Asesor Funerario Autorizado de Jardines de la Paz

Sitio estático en **Astro 7.3** (sin backend) para captar contactos desde Google Ads, Meta Ads y búsqueda orgánica.
Dominio previsto: `asesorfunerariolima.com` (se cambia en `src/config/site.ts`).

| Página | URL | Para qué |
|---|---|---|
| Inicio | `/` | Presentación de Marco, camposantos, por qué un asesor, testimonios, contacto |
| Servicio funerario | `/servicio-funerario` | Necesidad inmediata: teléfono 24 h, primeras horas, 5 servicios sin precios, traslados y trámites |
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
| Lista de servicios funerarios y lo que incluyen (fuente: catálogo 2026) | `src/data/servicios.ts`; diseño en `src/components/PlanesServicio.astro`; imágenes extraídas del catálogo en `fuentes/catalogo-2026/` |
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

En GTM: cree activadores de **Evento personalizado** con esos nombres y variables de capa de datos `pagina`, `ubicacion`, `interes`. Para Meta use `Contact` (clics de contacto), `Lead` (formulario) y el evento personalizado `Recorrido3D`; en Google Ads, márquelos como conversiones.

---

## 5. Marcadores pendientes (se ven resaltados en amarillo en la web)

| Marcador | Dónde | Qué falta |
|---|---|---|
| `[TESTIMONIO REAL 1-3]`, `[NOMBRE]`, `[DISTRITO]` | Inicio > Lo que dicen las familias | 3 testimonios reales con permiso escrito (máx. 3 líneas cada uno) |
| `[DETALLE POR CONFIRMAR]` | Plan funerario > Cinerarios | Qué incluyen los cinerarios y en qué sede están |
| `[DATO POR CONFIRMAR]` | Servicio funerario > Premium > Ataúd redondo > Medidas internas | Largo interno del ataúd redondo Premium (el catálogo 2026 dice "1.84.5mt", probable errata) |
| `[TEXTO BASE: REVISIÓN LEGAL PENDIENTE]` | Privacidad | Revisión legal de la política |
| `[FECHA DE PUBLICACIÓN]` | Privacidad | Fecha en que se publica la política |
| `[PLAZO POR CONFIRMAR]` | Privacidad | Plazo de conservación de los datos |
| IDs `GTM-XXXXXXX`, `G-XXXXXXXXXX`, Pixel | `src/config/site.ts` | IDs reales de medición |

**Datos y textos que Marco debe validar** (no son marcadores, pero conviene confirmarlos):
- Que el número **998 160 591 atiende 24 horas** (se muestra en toda la web y en los datos estructurados).
- Los pasos de "Qué hacer en las primeras horas" (`/servicio-funerario`).
- Que **Praderas de la Paz** está en La Molina y que los nichos existen en ambas sedes (tomado de sus piezas de Facebook y brochures).
- Que "**cuotas sin intereses**" y "**ahorro por compra anticipada**" aplican a todos los planes (sale de sus brochures: "saldo sin interés", "dscto. por compra anticipada").
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

Espacios marcados para reemplazar: retrato de Marco (es un recorte de una pieza de Facebook), foto de Lurín (recorte pequeño) y las 3 fotos de catálogo del servicio (capilla, carroza, ataúd).

No se usaron: `zona-lapidas` 01-03 (nombres legibles), `99-Descartar`, ni el archivo de credenciales.

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
