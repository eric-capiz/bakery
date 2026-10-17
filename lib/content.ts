/**
 * Shared CMS core — identical on all branches.
 *
 * Site-specific copy lives in `lib/defaults.ts` (DEFAULT_CONTENT per branch).
 * Public pages load content via getServerSideProps -> getSiteContent(DEFAULT_CONTENT).
 * The admin UI saves via POST /api/content/save.
 *
 * Redis keys are namespaced per site by lib/kv.ts (<SITE_ID>:content).
 */

import { getData, setData } from './kv';

export interface HeroContent {
  eyebrow: string;
  title: string;
  titleAccent: string;
  titleEnd: string;
  subtitle: string;
  ctaPrimary: string;
  ctaPrimaryHref: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
  image: string;
  imageAlt: string;
  caption: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface ServiceItem {
  title: string;
  description: string;
}

export interface AboutContent {
  intro: string;
  highlights: string[];
  email: string;
  phone: string;
  address: string;
  hours: { day: string; time: string }[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SiteContent {
  hero: HeroContent;
  features: FeatureItem[];
  services: ServiceItem[];
  about: AboutContent;
  faq: FaqItem[];
  /** Announcement banner. Empty string = hidden. */
  notice: string;
  gallery: string[];
  marquee: string[];
}

export const CONTENT_KEY = 'content';

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/**
 * Deep-merge saved content over the branch defaults so that newly added
 * schema fields always have a fallback value, even for older saved data.
 */
export function mergeContent(
  fallback: SiteContent,
  saved: unknown
): SiteContent {
  if (!isObject(saved)) return fallback;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(fallback) as (keyof SiteContent)[]) {
    const fb = (fallback as unknown as Record<string, unknown>)[key];
    const sv = (saved as Record<string, unknown>)[key];
    if (Array.isArray(fb)) {
      out[key] = Array.isArray(sv) && sv.length > 0 ? sv : fb;
    } else if (isObject(fb)) {
      out[key] = isObject(sv) ? { ...fb, ...sv } : fb;
    } else if (typeof sv === typeof fb) {
      out[key] = sv;
    } else {
      out[key] = fb;
    }
  }
  return out as unknown as SiteContent;
}

/**
 * SSR content loader. Reads the namespaced `content` key from Redis.
 * - Missing/empty key: seeds Redis from `fallback` once, returns fallback.
 * - Redis unconfigured or any error: returns `fallback` (pages always render).
 * Never overwrites existing CMS data.
 */
export async function getSiteContent(
  fallback: SiteContent
): Promise<SiteContent> {
  try {
    const raw = await getData(CONTENT_KEY);
    if (!raw) {
      try {
        await setData(CONTENT_KEY, JSON.stringify(fallback));
      } catch {
        // Redis unavailable — serve fallback without seeding.
      }
      return fallback;
    }
    return mergeContent(fallback, JSON.parse(raw));
  } catch {
    return fallback;
  }
}

/** Persist full site content (admin only — the API route enforces auth). */
export async function saveSiteContent(content: SiteContent): Promise<void> {
  await setData(CONTENT_KEY, JSON.stringify(content));
}
