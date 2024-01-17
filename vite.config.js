import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return defineConfig({
    manifest: true,
    plugins: [react()],
    server: {
      port: parseInt(process.env.VITE_PORT ?? 3000),
      proxy: {
        [process.env.VITE_PROXY_ENDPOINT]: {
          target: process.env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => {
            console.log(path)
            return path.replace(process.env.VITE_PROXY_ENDPOINT, '')
          },
        },
      },
    },
  })
}
