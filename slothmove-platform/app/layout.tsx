import type { Metadata, Viewport } from 'next';
import './globals.css';
import './course-shell.css';
import './home-shell.css';
import './subject-shell.css';
import './nav-consistency.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { absoluteUrl, serializeJsonLd, siteConfig } from '@/lib/seo';

export const metadata: Metadata = {
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: 'SlothMove' }],
  creator: 'SlothMove',
  publisher: 'SlothMove',
  applicationName: 'SlothMove',
  category: 'education',
  classification: 'Exam preparation and online learning',
  metadataBase: new URL(siteConfig.baseUrl),
  alternates: { canonical: '/' },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png'
  },
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    siteName: siteConfig.siteName,
    url: siteConfig.baseUrl,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, alt: 'SlothMove — เตรียมสอบราชการ' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [siteConfig.ogImage]
  },
  robots: { index: true, follow: true },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION
  }
};

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  width: 'device-width',
  initialScale: 1
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.baseUrl}/#website`,
      name: siteConfig.siteName,
      url: siteConfig.baseUrl,
      inLanguage: 'th-TH',
      description: siteConfig.description,
      publisher: { '@id': `${siteConfig.baseUrl}/#organization` }
    },
    {
      '@type': ['Organization', 'EducationalOrganization'],
      '@id': `${siteConfig.baseUrl}/#organization`,
      name: siteConfig.siteName,
      alternateName: 'SlothMove เตรียมสอบราชการ',
      url: siteConfig.baseUrl,
      logo: absoluteUrl('/apple-icon.png'),
      description: 'แพลตฟอร์มเตรียมสอบนายสิบตำรวจ พร้อมข้อสอบออนไลน์ 6 วิชา Mock Test จับเวลา เฉลยละเอียด และระบบวิเคราะห์ผล',
      areaServed: { '@type': 'Country', name: 'ประเทศไทย' },
      sameAs: [siteConfig.facebook]
    }
  ]
};

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-W60TF5WHSB';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{localStorage.setItem('slothmove-theme','light');}catch(e){}document.documentElement.setAttribute('data-theme','light');})();"
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
