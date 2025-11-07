const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'img.submarino.com.br' },
      { protocol: 'https', hostname: 'static.netshoes.com.br' },
      { protocol: 'https', hostname: 'cdn.lojasrenner.com.br' },
      { protocol: 'https', hostname: 'a-static.mlcdn.com.br' },
      { protocol: 'https', hostname: 'images-americanas.b2w.io' }
    ],
  },
}

module.exports = nextConfig
