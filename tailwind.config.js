/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        aqi: {
          good: '#16a34a',
          satisfactory: '#84cc16',
          moderate: '#eab308',
          poor: '#f97316',
          veryPoor: '#ef4444',
          severe: '#7f1d1d',
        },
      },
    },
  },
  plugins: [],
}
