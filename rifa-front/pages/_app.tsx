import type {AppProps} from 'next/app';
import App from 'next/app';
import AppProvider from '@/lib/AppContext';
import {ConfigProps} from '@/types/index';

import updateLocale from 'dayjs/plugin/updateLocale';
import dayjs from 'dayjs';
import {daysInSpanish, monthsInSpanish} from '@/lib/consts';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@/styles/reset.css';
import '@/styles/globals.css';
import '@/styles/strapiStyles/exclusiveBenefits.css';
import '@/styles/strapiStyles/introduction.css';
import '@/styles/strapiStyles/weeklyAwards.css';
import '@/styles/strapiStyles/mainAwards.css';
import '@/styles/strapiStyles/carousel.css';
import '@/styles/strapiStyles/publicLanding.css';
import Script from 'next/script';
import {GTM_ID} from '@/lib/gtm';
import AuthProvider from '@/providers/AuthProvider';

interface MyAppProps extends AppProps {
  configData: ConfigProps;
}

function MyApp({Component, pageProps, ...contextProps}: MyAppProps) {
  dayjs.extend(updateLocale);
  dayjs.updateLocale('en', {weekdays: daysInSpanish, months: monthsInSpanish});

  return (
    <AppProvider {...contextProps}>
      <AuthProvider>
        <Script
          id="gtag-base"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${GTM_ID}');
          `,
          }}
        />
        <Component {...pageProps} />
      </AuthProvider>
    </AppProvider>
  );
}

MyApp.getInitialProps = async (context: any) => {
  const appProps = await App.getInitialProps(context);

  return {
    ...appProps,
  };
};

export default MyApp;
