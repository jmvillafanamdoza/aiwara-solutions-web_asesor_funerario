// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config/site.ts';

export default defineConfig({
  site: SITE.url,
  // URLs limpias sin barra final (/servicio-funerario). Cloudflare Pages sirve servicio-funerario.html en esa ruta.
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    sitemap({
      filter: (url) => !url.includes('/404'),
    }),
  ],
});
