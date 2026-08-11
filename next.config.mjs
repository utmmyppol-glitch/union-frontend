/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '8080' },
      { protocol: 'https', hostname: '*.unionsystems.co.kr' },
      { protocol: 'https', hostname: 'imgnews.pstatic.net' },
      { protocol: 'https', hostname: 'mimgnews.pstatic.net' },
      { protocol: 'https', hostname: 's.pstatic.net' },
      { protocol: 'https', hostname: 't1.daumcdn.net' },
      { protocol: 'https', hostname: 'thumb.mt.co.kr' },
      { protocol: 'https', hostname: 'image.zdnet.co.kr' },
      { protocol: 'https', hostname: 'img.etnews.com' },
      { protocol: 'https', hostname: 'cdn.digitaltoday.co.kr' },
      { protocol: 'https', hostname: 'cdn.aitimes.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' http://localhost:3002 https://admin.unionsystems.co.kr",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
