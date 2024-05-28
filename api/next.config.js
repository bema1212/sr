// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)', // Apply headers to all routes
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; connect-src 'self' https://your-vercel-deployment-url.vercel.app; script-src 'self'; style-src 'self';"
          }
        ]
      }
    ]
  }
}
