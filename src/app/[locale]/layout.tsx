'use client';

import { WebAppProvider } from '../../../wrapper/webAppProvider';
import { NextAuthProvider } from '../api/SessionProvider';
import '../globals.css';
import LocaleValidator from './LocaleValidator';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { store } from '@/store';
import { ThemeProvider } from '@material-tailwind/react';
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import { AppProgressBar } from 'next-nprogress-bar';
import Script from 'next/script';
import { ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default function LocaleLayout({ children, params: { locale } }: Props) {
  const [messages, setMessages] = useState<AbstractIntlMessages | undefined>(
    undefined
  );

  useEffect(() => {
    setMessages({});
    import(`../../../messages/${locale}.json`)
      .then((module) => {
        setMessages(module.default);
      })
      .catch(() => {
        setMessages(undefined);
      });
  }, [locale]);

  return (
    <html lang={locale}>
      <head>
        <Script src='https://telegram.org/js/telegram-web-app.js'></Script>
        <title>HOOPOE</title>
        <meta
          property='og:title'
          content='HOOPOE - Connecting talent with the right opportunities'
        />
        <meta
          property='og:description'
          content='HOOPOEempowers Organizations to seamlessly post and manage opportunities, while connecting talent to personalized roles based on their preferences and skills.'
        />
        <meta property='og:type' content='website' />
        <meta
          property='og:image'
          content='https://akilconnect.org/assets/akil-icon.png'
        />
        <meta property='og:url' content='https://akilconnect.org' />
      </head>
      <body>
        <LocaleValidator locale={locale}>
          {messages !== undefined && messages !== null && (
            <NextIntlClientProvider
              locale={locale}
              messages={messages}
              timeZone='Africa/Addis_Ababa'
            >
              {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
                <GoogleAnalytics
                  ga_id={
                    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || 'G-FBMELQYWDT'
                  }
                />
              )}
              <ThemeProvider>
                <Provider store={store}>
                  <NextAuthProvider>
                    <WebAppProvider>{children}</WebAppProvider>
                    <AppProgressBar
                      height='2px'
                      color='#3F50B5'
                      options={{ showSpinner: true }}
                      shallowRouting
                    />
                  </NextAuthProvider>
                </Provider>
              </ThemeProvider>
              <ToastContainer />
            </NextIntlClientProvider>
          )}
        </LocaleValidator>
      </body>
    </html>
  );
}
