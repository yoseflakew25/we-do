'use client';

import { locales } from '@/config';
import router from 'next/router';
import { ReactNode, useEffect, useState } from 'react';

type Props = {
  children: ReactNode;
  locale: string;
};

export default function LocaleValidator({ children, locale }: Props) {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!locales.includes(locale as 'en' | 'ara')) {
      router.replace('/404'); // Redirect if locale is invalid
    } else {
      setIsValid(true); // Allow rendering if valid
    }
  }, [locale]);

  return <>{isValid && children}</>;
}
