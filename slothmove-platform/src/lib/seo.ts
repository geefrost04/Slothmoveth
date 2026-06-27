import type { Metadata } from 'next';

const DEFAULT_SITE_URL =
  process.env.NODE_ENV === 'production' ? 'https://learn.slothmoveth.com' : 'http://localhost:3040';

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');

export const siteConfig = {
  name: 'SlothMove',
  siteName: 'SlothMove',
  baseUrl,
  defaultTitle: 'SlothMove เตรียมสอบราชการออนไลน์ฟรี',
  titleTemplate: '%s | SlothMove',
  description:
    'แพลตฟอร์มเรียนฟรีเตรียมสอบราชการ รวมคอร์สสอบราชการ ข้อสอบพร้อมเฉลย สรุปเนื้อหา และบอร์ดรวมงานราชการจาก OCSC ในที่เดียว',
  keywords: [
    'SlothMove',
    'เตรียมสอบราชการ',
    'ข้อสอบราชการ',
    'เรียนฟรี',
    'งานราชการ',
    'สมัครงานราชการ',
    'นักวิเคราะห์นโยบายและแผน',
    'ภาค ก',
    'สอบ ก.พ.',
  ],
  ogImage: '/pic/logo_OPSDD.png',
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
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}
