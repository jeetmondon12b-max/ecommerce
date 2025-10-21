import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // ✅✅✅ এই অংশটি আপনার সব সমস্যার সমাধান করবে ✅✅✅
  server: {
    proxy: {
      // '/api' দিয়ে শুরু হওয়া সব অনুরোধকে http://localhost:5000 এ পাঠানো হবে
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true, // সার্ভারকে বলার জন্য যে হোস্ট হেডার পরিবর্তন করতে হবে
      },
    },
  },
})
