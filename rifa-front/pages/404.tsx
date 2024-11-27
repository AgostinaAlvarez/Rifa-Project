import ErrorPage from '@/components/Errors/ErrorPage';
import BaseLayout from '@/components/Layout/PublicLayout';

const Custom404 = () => (
  <BaseLayout
    seo={{
      keywords: '',
      metaDescription: '',
      metaTitle: 'Página no encontrada | 404',
      preventIndexing: true,
      shareImage: {
        image: {alt: '', original: '/img/ilustration_404.webp'},
        alt: '',
      },
    }}
  >
    <ErrorPage errorType={'NOT_FOUND'} />
  </BaseLayout>
);

export default Custom404;
