import {IncomingMessage} from 'http';
import {SeoAttributesProps} from './components';

declare global {
  interface Window {
    gtag: any;
    grecaptcha: any;
    dataLayer: any;
  }
}

export interface LayoutProps {
  seo: SeoAttributesProps;
  children: React.ReactNode;
}

export interface HeaderProps {}

export interface FooterProps {}

export interface RequestStatus {
  isLoading: boolean;
  error: string | null;
}

export interface ServerSideContext {
  req: IncomingMessage;
  query: any;
  locale: string;
  params: any;
}

interface Option {
  text: string;
  isActive: boolean;
}

export interface ConfigProps {
  socialMedia: Array<{
    href: string;
    icon: string;
    name: string;
  }>;
}
