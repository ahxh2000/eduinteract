import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: {
          DEFAULT: '#165DFF',
          50: '#F5F7FA',
          100: '#E4E7ED',
          200: '#C0C4CC',
          300: '#909399',
          400: '#606266',
          500: '#165DFF',
          600: '#165DFF',
          700: '#165DFF',
        },
        secondary: {
          DEFAULT: '#FF7D00',
        },
        tertiary: {
          DEFAULT: '#00B42A',
        },
        neutral: {
          100: '#F5F7FA',
          200: '#E4E7ED',
          300: '#C0C4CC',
          400: '#909399',
          500: '#606266',
          600: '#303133',
          700: '#1E1E1E',
        },
      },
    },
  },
  plugins: [],
}
export default config
