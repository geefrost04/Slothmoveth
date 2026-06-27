export const SITE_URL = 'https://slothmoveth.com';
export const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61589670089745';

const DEFAULT_PLATFORM_URL =
  process.env.NODE_ENV === 'production' ? 'https://learn.slothmoveth.com' : 'http://localhost:3040';

export const PLATFORM_BASE_URL = (process.env.NEXT_PUBLIC_PLATFORM_URL || DEFAULT_PLATFORM_URL).replace(
  /\/+$/,
  ''
);
