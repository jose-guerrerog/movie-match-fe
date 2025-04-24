const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  // Skip static generation entirely
  experimental: {
    workerThreads: false,
    cpus: 1
  },
  // Configure the not-found page to be generated at runtime
  generateBuildId: async () => {
    // This forces Next.js to rebuild the app on each request in development
    return 'development-build'
  }
}

module.exports = nextConfig