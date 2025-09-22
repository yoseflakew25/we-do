import { Pathnames } from 'next-intl/navigation';

export const locales = ['en', 'ara'] as const;
export const defaultLocale = 'en' as const;
export const pathnames = {
  '/': '/',
  '/pathnames': {
    en: '/pathnames',
    ara: '/pathnames',
  },
} satisfies Pathnames<typeof locales>;

export type AppPathnames = keyof typeof pathnames;
