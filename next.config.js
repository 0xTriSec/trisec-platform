const { withContentlayer } = require('next-contentlayer2')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// Content Security Policy
// BẢO VỆ: Ngăn XSS attacks bằng cách kiểm soát nguồn script, style, image được phép load
// CẦN THIẾT: unsafe-eval cho esbuild/contentlayer compile MDX
// CẦN THIẾT: unsafe-inline vì Next.js emotion/sstyled-components dùng inline styles
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://giscus.app https://0xtrisec.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://picsum.photos https://*.picsum.photos https://0xtrisec.com;
  media-src 'self';
  connect-src 'self' https://giscus.app https://0xtrisec.com;
  font-src 'self' data:;
  frame-src https://giscus.app;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
`

const securityHeaders = [
  // Content-Security-Policy: Ngăn XSS, clickjacking, data injection
  // Chỉ cho phép resources từ domain đã verify
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // Referrer-Policy: Kiểm soát thông tin referrer gửi đi
  // BẢO VỆ: Tránh leak URL nội bộ khi link ra ngoài
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // X-Frame-Options: Ngăn website bị nhúng vào iframe
  // BẢO VỆ: Chống clickjacking attacks
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // X-Content-Type-Options: Ngăn browser đoán content type sai
  // BẢO VỆ: Tránh MIME type sniffing attack
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // X-DNS-Prefetch-Control: Tắt DNS prefetching
  // BẢO VỆ: Tránh leak thông tin khi user hover links
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // Strict-Transport-Security (HSTS): Bắt buộc HTTPS
  // BẢO VỆ: Ngăn man-in-the-middle attacks, SSL stripping
  // max-age=31536000: 1 năm, includeSubDomains: áp dụng subdomain
  // preload: cho phép đưa vào HSTS preload list của browser
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  // Permissions-Policy: Kiểm soát browser features
  // BẢO VỆ: Tắt camera, mic, geolocation để tránh fingerprinting
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  // X-XSS-Protection: Legacy protection (backup cho CSP)
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
]

const output = process.env.EXPORT ? 'export' : undefined
const basePath = process.env.BASE_PATH || undefined
const unoptimized = process.env.UNOPTIMIZED ? true : undefined

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    output,
    basePath,
    reactStrictMode: true,
    trailingSlash: true,
    turbopack: {
      root: process.cwd(),
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'picsum.photos',
        },
      ],
      unoptimized,
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
      ]
    },
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })

      return config
    },
  })
}
