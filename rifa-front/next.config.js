/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-rut-formatter', '@mercadopago/sdk-react'],

  i18n: {
    locales: ['default'],
    defaultLocale: 'default',
    localeDetection: false,
  },
  swcMinify: true,
  images: {
    domains: ['developerlatam.com', 'rifaclub.com', 'rifa-club-develop.s3.amazonaws.com'],
  },
};

module.exports = nextConfig;
