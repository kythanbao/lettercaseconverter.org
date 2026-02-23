import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import type { AstroIntegration } from 'astro';
import * as yaml from 'js-yaml';

import astrowind from './vendor/integration';
import cloudflare from '@astrojs/cloudflare';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin, lazyImagesRehypePlugin } from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

const resolveSiteUrl = () => {
  const configPath = path.resolve(__dirname, './src/config.yaml');
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    const parsed = yaml.load(raw) as { site?: { site?: string } } | undefined;
    const siteUrl = parsed?.site?.site;
    if (typeof siteUrl === 'string' && siteUrl.length > 0) {
      return siteUrl;
    }
  } catch {
    // Fallbacks below
  }

  const envSite = process.env.SITE;
  return typeof envSite === 'string' && envSite.length > 0 ? envSite : undefined;
};

const siteUrl = resolveSiteUrl();
const SITEMAP_EXCLUDED_PREFIXES = ['/tag/', '/blog/', '/category/', '/image/'];
const TOOL_PATH_PATTERN = /^\/(cleanup|text)\//;
const ALLOWED_TOOL_PATHS = new Set(['/cleanup/remove-extra-spaces', '/text/reverse-text-generator']);
const shouldIncludeInSitemap = (page: string): boolean => {
  try {
    const pathname = new URL(page, siteUrl || 'https://lettercaseconverter.org').pathname;
    if (TOOL_PATH_PATTERN.test(pathname) && !ALLOWED_TOOL_PATHS.has(pathname)) return false;
    return !SITEMAP_EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  } catch {
    if (TOOL_PATH_PATTERN.test(page) && !ALLOWED_TOOL_PATHS.has(page)) return false;
    return !SITEMAP_EXCLUDED_PREFIXES.some((prefix) => page.startsWith(prefix));
  }
};

export default defineConfig({
  site: siteUrl,
  trailingSlash: 'never',
  output: 'server',
  adapter: cloudflare(),
  redirects: {
    '/text/plain-text-converter': {
      status: 301,
      destination: '/cleanup/remove-extra-spaces',
    },
    '/text/character-removal-tool': {
      status: 301,
      destination: '/cleanup/remove-extra-spaces',
    },
    '/text/remove-text-formatting': {
      status: 301,
      destination: '/cleanup/remove-extra-spaces',
    },
    '/cleanup/remove-text-formatting': {
      status: 301,
      destination: '/cleanup/remove-extra-spaces',
    },
    '/api/paragraph-rewrite': {
      status: 301,
      destination: '/',
    },
    '/api/sentence-rewrite': {
      status: 301,
      destination: '/',
    },
    '/text/text-truncate-by-char': {
      status: 301,
      destination: '/text/reverse-text-generator',
    },
  },

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      filter: (page) => shouldIncludeInSitemap(page),
    }),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    service: {
      entrypoint: 'astro/assets/services/compile',
    },
    domains: ['cdn.pixabay.com'],
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
