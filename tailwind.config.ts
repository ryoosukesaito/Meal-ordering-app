import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/*.{js,ts,jsx,tsx,mdx}',
    './Components/**/*.{js,ts,jsx,tsx}',
    './Components/**/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      fontFamily: {
        deliusSwashCaps: ['Delius Swash Caps', 'cursive'],
        georama: ['Georama', 'sans-serif']
      }
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px'
    }
  },
  plugins: []
}
export default config
