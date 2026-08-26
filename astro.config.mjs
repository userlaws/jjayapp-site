// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jjayapp.com',
  output: 'static',
  devToolbar: { enabled: false },
  integrations: [sitemap()],
});
