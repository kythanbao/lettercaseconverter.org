import type { MiddlewareHandler } from 'astro';

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 phút
const MAX_REQUESTS = 10;
const CLEANUP_INTERVAL = 60 * 1000; // 1 phút
const MAX_STORE_SIZE = 5000;
const TOOL_PATH_PATTERN = /^\/(cleanup|text)\//;
const BLOCKED_PREFIXES = ['/blog', '/category', '/tag', '/image'];
const ALLOWED_TOOL_PATHS = new Set(['/cleanup/remove-extra-spaces', '/text/reverse-text-generator']);

// Lưu IP -> timestamps
const ipStore = new Map<string, number[]>();
let lastCleanup = 0;

const isLocalHostname = (hostname: string): boolean =>
  hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';

const isHttpsRequest = (request: Request, url: URL): boolean => {
  if (url.protocol === 'https:') return true;

  const forwardedProto = request.headers.get('x-forwarded-proto');
  if (forwardedProto?.split(',').some((proto) => proto.trim().toLowerCase() === 'https')) return true;

  const cfVisitor = request.headers.get('cf-visitor');
  if (cfVisitor && cfVisitor.includes('"scheme":"https"')) return true;

  return false;
};

const cleanupStore = (now: number) => {
  if (now - lastCleanup < CLEANUP_INTERVAL && ipStore.size < MAX_STORE_SIZE) {
    return;
  }

  lastCleanup = now;

  for (const [ip, timestamps] of ipStore.entries()) {
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
    if (recent.length === 0) {
      ipStore.delete(ip);
    } else {
      ipStore.set(ip, recent);
    }
  }

  if (ipStore.size > MAX_STORE_SIZE) {
    const entries = Array.from(ipStore.entries()).sort(
      (a, b) => (a[1][a[1].length - 1] ?? 0) - (b[1][b[1].length - 1] ?? 0)
    );
    const excess = ipStore.size - MAX_STORE_SIZE;
    for (let i = 0; i < excess; i++) {
      ipStore.delete(entries[i][0]);
    }
  }
};

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { request } = context;
  const url = new URL(request.url);
  const { pathname, search } = url;
  const secureRequest = isHttpsRequest(request, url);

  const normalizedOrigin = (() => {
    if (!(import.meta.env.PROD && secureRequest)) return url.origin;
    const secureUrl = new URL(request.url);
    secureUrl.protocol = 'https:';
    return secureUrl.origin;
  })();

  // Force HTTPS in production so crawlers and users only see secure URLs.
  if (import.meta.env.PROD && !isLocalHostname(url.hostname) && !secureRequest) {
    const httpsUrl = new URL(request.url);
    httpsUrl.protocol = 'https:';
    return Response.redirect(httpsUrl.toString(), request.method === 'GET' || request.method === 'HEAD' ? 301 : 308);
  }

  // Canonical URL normalization: avoid duplicate crawl paths such as trailing slash and /index.html.
  if (request.method === 'GET' || request.method === 'HEAD') {
    let normalizedPath = pathname;

    if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
      normalizedPath = normalizedPath.slice(0, -1);
    }

    if (normalizedPath === '/index.html') {
      normalizedPath = '/';
    } else if (normalizedPath.endsWith('/index.html')) {
      normalizedPath = normalizedPath.slice(0, -'/index.html'.length) || '/';
    }

    if (normalizedPath !== pathname) {
      return Response.redirect(`${normalizedOrigin}${normalizedPath}${search}`, 301);
    }
  }

  // Site has been simplified: remove blog/topic/image areas and keep only two tool routes.
  if (request.method === 'GET' || request.method === 'HEAD') {
    if (BLOCKED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
      return Response.redirect(`${normalizedOrigin}/`, 301);
    }

    if (TOOL_PATH_PATTERN.test(pathname) && !ALLOWED_TOOL_PATHS.has(pathname)) {
      return Response.redirect(`${normalizedOrigin}/tools`, 301);
    }
  }

  // 👉 Chỉ áp dụng cho API
  if (!url.pathname.startsWith('/api/')) {
    const response = await next();
    if (import.meta.env.PROD && secureRequest) {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000');
    }
    return response;
  }

  // Lấy IP (Cloudflare + local)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip =
    request.headers.get('cf-connecting-ip') || (forwardedFor ? forwardedFor.split(',')[0]?.trim() : null) || 'unknown';

  const now = Date.now();
  cleanupStore(now);
  const timestamps = ipStore.get(ip) || [];

  // Giữ lại request trong window
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);

  if (recent.length >= MAX_REQUESTS) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests. Please try again later.',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  recent.push(now);
  ipStore.set(ip, recent);

  const response = await next();
  if (import.meta.env.PROD && secureRequest) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000');
  }
  return response;
};
