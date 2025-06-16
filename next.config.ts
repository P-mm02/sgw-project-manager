const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb',
      allowedOrigins: ['*'],
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
