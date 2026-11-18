import { withPayload } from '@payloadcms/next/withPayload'

export default withPayload({
  poweredByHeader: false,
  devIndicators: false,
  outputFileTracingIncludes: {
    '/*': ['./supabase-ca.crt'],
  },
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/resume.html', destination: '/cv', permanent: true },
    ]
  },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ] }]
  },
})
