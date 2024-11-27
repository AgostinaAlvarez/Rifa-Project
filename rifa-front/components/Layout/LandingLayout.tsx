import Head from 'next/head';
import {LayoutProps} from '@/types/index';
import GlobalLoader from '@/components/Loaders/GlobalLoader';
import {useAppContext} from '@/lib/AppContext';
import ModalComponent from '@/components/Modals/ModalComponent';
import BtnContainerNavbarLanding from '@/components/NavBar/ButtonsContainer/BtnContainerNavbarLanding';
import NavBar from '@/components/NavBar/NavBar';
import OptionsNavbarLanding from '@/components/NavBar/OptionsContainer/OptionsNavbarLanding';
import {Colors} from '@/lib/enums/Colors';
import FooterComponent from '../Footer/FooterComponent';
import OptionsFooterLanding from '../Footer/OptionsContainer/OptionsFooterLanding';

const LandingLayout = ({seo, children}: LayoutProps) => {
  const {currentModalContent} = useAppContext();

  return (
    <div className="public-main-landing">
      <Head>
        <title>{seo?.metaTitle || 'Rifa Club'}</title>
        <meta name="title" content={seo?.metaTitle} key="title" />
        <meta
          name="description"
          content={
            seo?.metaDescription ||
            'VIVE ESTA GRAN EXPERIENCIA ¡Y que la suerte te encuentre! ¡Suscríbete aquí! Miles de premios esperan por ti! Únete hoy a Rifa Club y empieza a disfrutar de una amplia gama de beneficios. Como miembro, tendrás acceso exclusivo a nuestros sorteos diarios, eventos mensuales y productos al mejor precio del mercado en nuestro marketplace.¡No pierdas'
          }
          key="description"
        />
        <meta name="keywords" content={seo?.keywords} />
        <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
        <meta property="og:title" content={seo?.metaTitle} key="og:title" />
        <meta property="og:description" content={seo?.metaDescription} key="og:description" />
        <meta property="og:image" content={seo?.shareImage?.image?.original} key="og:image" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />

        {seo?.preventIndexing && (
          <>
            <meta name="robots" content="noindex"></meta>
            <meta name="googlebot" content="noindex"></meta>
          </>
        )}
        <meta name="google-site-verification" content="pending-add-site-code" />
      </Head>
      <NavBar
        optionsNavBar={<OptionsNavbarLanding />}
        buttonContainer={<BtnContainerNavbarLanding />}
      />
      <GlobalLoader />
      <main>{children}</main>
      <FooterComponent
        color={Colors.WHITE}
        className={'footer-white-font'}
        optionsFooter={<OptionsFooterLanding />}
      />
      {currentModalContent && <ModalComponent>{currentModalContent}</ModalComponent>}
    </div>
  );
};

export default LandingLayout;
