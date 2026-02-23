import { headerData } from '~/navigation';

export type ToolCatalogEntry = {
  name: string;
  href: string;
  section: string;
};

export type ToolRecommendationContext = {
  title?: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
};

type HeaderLink = {
  text?: string;
  href?: string;
  links?: HeaderLink[];
};

const normalizePath = (value: string): string => {
  if (!value) return '/';
  try {
    const url = new URL(value, 'https://lettercaseconverter.org');
    const path = url.pathname.replace(/\/+$/, '');
    return path || '/';
  } catch {
    const stripped = value.split('#')[0].split('?')[0].replace(/\/+$/, '');
    return stripped || '/';
  }
};

const TOOL_PATH_PATTERN = /^\/(cleanup|text)\//;

const flattenToolEntries = (): ToolCatalogEntry[] => {
  const sections = (headerData.links || []) as HeaderLink[];
  const seen = new Set<string>();
  const entries: ToolCatalogEntry[] = [];

  sections.forEach((section) => {
    if (!Array.isArray(section.links) || !section.links.length) return;
    const sectionName = section.text || 'Tools';

    section.links.forEach((item) => {
      if (!item.href || !item.text) return;
      const normalized = normalizePath(item.href);
      if (!TOOL_PATH_PATTERN.test(normalized)) return;
      if (seen.has(normalized)) return;
      seen.add(normalized);

      entries.push({
        name: item.text,
        href: normalized,
        section: sectionName,
      });
    });
  });

  return entries.sort((a, b) => a.name.localeCompare(b.name));
};

const cachedEntries = flattenToolEntries();
const byPath = new Map(cachedEntries.map((entry) => [normalizePath(entry.href), entry]));

const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'from',
  'into',
  'that',
  'this',
  'your',
  'you',
  'are',
  'how',
  'what',
  'why',
  'best',
  'guide',
  'tips',
  'tool',
  'tools',
  'workflow',
]);

const tokenize = (value: string): string[] =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));

export const getToolCatalog = (): ToolCatalogEntry[] => cachedEntries;

export const findToolByPath = (pathname: string): ToolCatalogEntry | undefined => byPath.get(normalizePath(pathname));

export const isToolPath = (pathname: string): boolean => Boolean(findToolByPath(pathname));

export const getRelatedTools = (pathname: string, limit = 6): ToolCatalogEntry[] => {
  const current = findToolByPath(pathname);
  if (!current) return [];
  return cachedEntries.filter((entry) => entry.section === current.section && entry.href !== current.href).slice(0, limit);
};

export const getToolSection = (pathname: string): string | undefined => findToolByPath(pathname)?.section;

export const recommendToolsForContext = (context: ToolRecommendationContext, limit = 6): ToolCatalogEntry[] => {
  const queryText = [context.title || '', context.excerpt || '', context.category || '', ...(context.tags || [])]
    .join(' ')
    .trim();
  const tokens = tokenize(queryText);
  if (!tokens.length) return cachedEntries.slice(0, limit);

  const scored = cachedEntries
    .map((entry) => {
      const haystack = `${entry.name} ${entry.section}`.toLowerCase();
      let score = 0;
      tokens.forEach((token) => {
        if (haystack.includes(` ${token} `) || haystack.startsWith(`${token} `) || haystack.endsWith(` ${token}`)) {
          score += 5;
        } else if (haystack.includes(token)) {
          score += 2;
        }
      });
      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name))
    .map((item) => item.entry);

  if (scored.length >= limit) return scored.slice(0, limit);
  const fallback = cachedEntries.filter((entry) => !scored.some((picked) => picked.href === entry.href));
  return [...scored, ...fallback].slice(0, limit);
};
