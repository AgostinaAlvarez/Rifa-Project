import ErrorPage from '@/components/Errors/ErrorPage';
import BaseLayout from '@/components/Layout/PublicLayout';

const Custom500 = () => (
  <BaseLayout
    seo={{
      keywords: '',
      metaDescription: '',
      metaTitle: 'Ha ocurrido un error | 500',
      preventIndexing: true,
      shareImage: {
        image: {alt: '', original: '/img/ilustration_500.webp'},
        alt: '',
      },
    }}
  >
    <ErrorPage errorType={'INTERNAL_SERVER_ERROR'} />
  </BaseLayout>
);

export default Custom500;
