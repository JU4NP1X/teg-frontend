const manifestForPlugin = {
  registerType: 'prompt',
  includeAssets: ['favicon.ico', 'logo-192.png', 'logo-512.png'],
  manifest: {
    short_name: 'Voco UC',
    name: 'Sistema de gestión de categorías de la biblioteca de la UC',
    description: '',
    icons: [
      {
        src: 'favicon.ico',
        sizes: '64x64 32x32 24x24 16x16',
        type: 'image/x-icon',
      },
      {
        src: 'logo-192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        src: 'logo-512.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
    start_url: '/',
    scope: '/',
    orientation: 'any',
    display: 'standalone',
    theme_color: '#ffffff',
    background_color: '#ffffff',
  },
}

export default manifestForPlugin
