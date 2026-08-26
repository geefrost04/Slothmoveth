import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SlothMove เตรียมสอบนายสิบตำรวจ',
    short_name: 'SlothMove',
    description: 'ข้อสอบนายสิบตำรวจออนไลน์ 6 วิชา พร้อม Mock Test จับเวลา เฉลย และวิเคราะห์ผล',
    start_url: '/',
    display: 'standalone',
    background_color: '#fffdfa',
    theme_color: '#1a1a2e',
    lang: 'th',
    icons: [
      { src: '/icon.png', sizes: '32x32', type: 'image/png' },
      { src: '/icon-64.png', sizes: '64x64', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  };
}
