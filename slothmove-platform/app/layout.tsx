import type { Metadata, Viewport } from 'next';
import './globals.css';
import './course-shell.css';
import './home-shell.css';
import './subject-shell.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { absoluteUrl, siteConfig } from '@/lib/seo';

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
  robots: { index: true, follow: true }
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
      inLanguage: 'th',
      description: siteConfig.description,
      publisher: { '@id': `${siteConfig.baseUrl}/#organization` }
    },
    {
      '@type': ['Organization', 'EducationalOrganization'],
      '@id': `${siteConfig.baseUrl}/#organization`,
      name: siteConfig.siteName,
      alternateName: 'SlothMove เตรียมสอบราชการ',
      url: siteConfig.baseUrl,
      logo: absoluteUrl(siteConfig.ogImage),
      description: 'แพลตฟอร์มเรียนออนไลน์ฟรีสำหรับเตรียมสอบราชการ โดยมีคอร์สที่พร้อมใช้งานและคอร์สที่ทยอยย้ายขึ้นระบบ',
      areaServed: { '@type': 'Country', name: 'ประเทศไทย' },
      sameAs: [siteConfig.facebook]
    }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var s=localStorage.getItem('slothmove-theme');document.documentElement.setAttribute('data-theme',s||'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();"
          }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-W60TF5WHSB" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-W60TF5WHSB');"
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
