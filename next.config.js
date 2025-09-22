// @ts-check

const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'storage.googleapis.com',
      'akilconnect.org',
      'ui-avatars.com',
    ],
  },
};

module.exports = withNextIntl({
  ...nextConfig,
});
