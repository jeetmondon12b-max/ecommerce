/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  // ✅ পরিবর্তন: tailwind-scrollbar-hide প্লাগইন যোগ করা হয়েছে
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}