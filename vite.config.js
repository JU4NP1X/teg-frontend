import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import manifestForPlugin from './src/utils/manifestForPlugin'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return defineConfig({
    plugins: [react(), VitePWA(manifestForPlugin)],
    server: {
      port: parseInt(process.env.VITE_PORT ?? 3000),
      proxy: {
        [process.env.VITE_PROXY_ENDPOINT]: {
          target: process.env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => {
            console.log(path.replace(process.env.VITE_PROXY_ENDPOINT, ''))
            return path.replace(process.env.VITE_PROXY_ENDPOINT, '')
          },
        },
      },
    },
  })
}
