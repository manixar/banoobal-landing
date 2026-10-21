import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      // فقط برای توسعه (npm run dev): درخواست‌های /api به سرور پاناپی فرستاده می‌شوند،
      // پس مرورگر خطای CORS نمی‌دهد. روی نسخه‌ی نهایی اثری ندارد.
      '/api': {
        target: 'https://api.paanapay.com',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });
        },
      },
    },
  },
})
