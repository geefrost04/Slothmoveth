import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import { ThemeProvider } from '@/components/ThemeProvider';
import { GA_MEASUREMENT_ID } from '@/lib/gtag';
import { FACEBOOK_URL, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'SlothMove เตรียมสอบราชการออนไลน์ฟรี — ข้อสอบพร้อมเฉลย',
  description:
    'เรียนฟรีเตรียมสอบราชการ ข้อสอบพร้อมเฉลยหลายคอร์ส — PAB พร้อมใช้งาน และคอร์ส OPSD / อุตสาหกรรม เปิดแล้วบางวิชา',
  keywords: 'เตรียมสอบราชการ, นักวิเคราะห์นโยบายและแผน, PAB, OPSD, กระทรวงอุตสาหกรรม, ข้อสอบพร้อมเฉลย, เรียนฟรี',
  authors: [{ name: 'SlothMove' }],
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    siteName: 'SlothMove',
    url: `${SITE_URL}/`,
    title: 'เตรียมสอบราชการออนไลน์ฟรี — ข้อสอบพร้อมเฉลย | SlothMove',
    description: 'เรียนฟรีเตรียมสอบราชการหลายคอร์ส — PAB พร้อมใช้งาน และ OPSD / อุตสาหกรรม เปิดแล้วบางวิชา',
    images: [{ url: '/pic/logo_OPSDD.png', alt: 'SlothMove — เตรียมสอบราชการ' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'เตรียมสอบราชการออนไลน์ฟรี — ข้อสอบพร้อมเฉลย | SlothMove',
    description: 'เรียนฟรีเตรียมสอบราชการหลายคอร์ส — PAB พร้อมใช้งาน และ OPSD / อุตสาหกรรม เปิดแล้วบางวิชา',
    images: ['/pic/logo_OPSDD.png']
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
      '@id': `${SITE_URL}/#website`,
      name: 'SlothMove',
      url: `${SITE_URL}/`,
      inLanguage: 'th',
      description: 'เรียนฟรีเตรียมสอบราชการ พร้อมข้อสอบและเฉลย — PAB พร้อมใช้งาน และคอร์สอื่นกำลังทยอยเปิด',
      publisher: { '@id': `${SITE_URL}/#organization` }
    },
    {
      '@type': ['Organization', 'EducationalOrganization'],
      '@id': `${SITE_URL}/#organization`,
      name: 'SlothMove',
      alternateName: 'SlothMove เตรียมสอบราชการ',
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/pic/logo_OPSDD.png`,
      description: 'แพลตฟอร์มเรียนออนไลน์ฟรีสำหรับเตรียมสอบราชการ โดยมีคอร์สที่พร้อมใช้งานและคอร์สที่ทยอยย้ายขึ้นระบบ',
      areaServed: { '@type': 'Country', name: 'ประเทศไทย' },
      sameAs: [FACEBOOK_URL]
    }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&family=Sarabun:wght@300;400;500;600;700&family=Noto+Sans+Thai:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: "(function(){try{var s=localStorage.getItem('slothmove-theme');document.documentElement.setAttribute('data-theme',s||'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();"
          }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-W60TF5WHSB" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}',{send_page_view:false});`
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <ThemeProvider>
          <AnalyticsTracker />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
