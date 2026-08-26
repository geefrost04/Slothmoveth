import type { Metadata } from 'next';

const DEFAULT_SITE_URL =
  process.env.NODE_ENV === 'production' ? 'https://slothmoveth.com' : 'http://localhost:3040';

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
const productionSafeUrl = process.env.NODE_ENV === 'production' && configuredSiteUrl?.includes('localhost')
  ? DEFAULT_SITE_URL
  : configuredSiteUrl || DEFAULT_SITE_URL;
const baseUrl = productionSafeUrl.replace(/\/+$/, '');

export const siteConfig = {
  name: 'SlothMove',
  siteName: 'SlothMove',
  baseUrl,
  defaultTitle: 'ติวสอบนายสิบตำรวจ พร้อมข้อสอบและเฉลย | SlothMove',
  titleTemplate: '%s | SlothMove',
  description:
    'เตรียมสอบนายสิบตำรวจด้วยข้อสอบออนไลน์ 6 วิชา Mock Test 150 ข้อ จับเวลา พร้อมเฉลยละเอียดและวิเคราะห์จุดอ่อนรายวิชา',
  keywords: [
    'SlothMove',
    'เตรียมสอบราชการ',
    'ข้อสอบราชการ',
    'สอบตำรวจ',
    'นายสิบตำรวจ',
    'ติวสอบนายสิบตำรวจ',
    'แนวข้อสอบนายสิบตำรวจ',
    'ข้อสอบตำรวจพร้อมเฉลย',
    'Mock Test นายสิบตำรวจ',
    'ภาค ก',
    'สอบ ก.พ.',
  ],
  ogImage: '/opengraph-image',
  facebook: 'https://www.facebook.com/profile.php?id=61589670089745',
} as const;

export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.baseUrl).toString();
}

type BuildMetadataInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path = '/',
  keywords = [],
  image = siteConfig.ogImage,
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = image.startsWith('http') ? image : absoluteUrl(image);

  return {
    title,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'th_TH',
      url,
      siteName: siteConfig.siteName,
      title,
      description,
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
