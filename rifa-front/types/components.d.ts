import {CSSProperties, Dispatch, ReactNode, SetStateAction} from 'react';

export type ImageAttributesProps = {
  alt: string;
  original: string;
  lg?: string;
  md?: string;
  sm?: string;
  xs?: string;
} | null;

export type SeoAttributesProps = {
  keywords: string;
  metaDescription: string;
  metaTitle: string;
  preventIndexing: boolean;
  shareImage: {
    image: ImageAttributesProps;
    alt: string;
  };
} | null;

export interface HeroProps {
  data: {
    title: string;
    images?: ImageAttributesProps;
  };
}

export interface ImageContainerProps {
  image: ImageAttributesProps;
  className?: string;
  imageClassName?: string;
  loadingType?: 'lazy' | 'eager';
  objectFit?: string;
  priority?: boolean;
}

export type HomeBannerProps = {
  id: number;
  title: string;
  isActive: boolean;
  backgroundImage: any;
  suscribeNow: any;
  weight: number | undefined;
} | null;

export type IntroductionProps = {
  id: number;
  title: string;
  isActive: boolean;
  backgroundImage: any;
  content: string;
  weight: number | undefined;
} | null;

export type MainAwardsProps = {
  id: number;
  title: string;
  isActive: boolean;
  weight: number | undefined;
} | null;

export type WeeklyAwardsProps = {
  id: number;
  title: string;
  isActive: boolean;
  weight: number | undefined;
} | null;

export type StepsProps = {
  id: number;
  isActive: boolean;
  individualSteps: any[];
  imageSteps: any;
  stepsButton: any;
  weight: number | undefined;
} | null;

export type ExclusiveBenefitsProps = {
  id: number;
  isActive: boolean;
  title: any;
  content: any;
  cards: Array<{
    benefitCardImage: any;
    cardUrl: string;
  }>;
  weight: number | undefined;
} | null;

type CardType = {
  isActive: boolean;
  benefitCardImage?: {
    data?: {
      attributes?: {
        url?: string;
        alternativeText?: string;
      };
    };
  };
  benefitDescription?: string;
};

export type PlansIntroductionProps = {
  id: number;
  isActive: boolean;
  title: string;
  content: string;
  weight: number | undefined;
} | null;

export type AboutUsProps = {
  id: number;
  title: string;
  isActive: boolean;
  backgroundImage: any;
  content: string;
  imageLeft: any;
  aboutUsButton: any;
  weight: number | undefined;
} | null;
