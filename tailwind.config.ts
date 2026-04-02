import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
          './app/**/*.{js,ts,jsx,tsx,mdx}',
          './components/**/*.{js,ts,jsx,tsx,mdx}',
        ],
    theme: {
          extend: {
                  colors: {
                            // Vibrant realtor-inspired palette
                    primary: {
                                50: '#fff1f0',
                                100: '#ffe0de',
                                200: '#ffc7c2',
                                300: '#ffa198',
                                400: '#ff6b5b',
                                500: '#f94432',  // Main brand red
                                600: '#e72819',
                                700: '#c21e11',
                                800: '#a01c13',
                                900: '#841e17',
                    },
                            accent: {
                                        50: '#f0f7ff',
                                        100: '#dfeeff',
                                        200: '#b8ddff',
                                        300: '#79c3ff',
                                        400: '#32a5fe',
                                        500: '#0789f0',  // Accent blue
                                        600: '#006bcd',
                                        700: '#0055a6',
                                        800: '#034989',
                                        900: '#093d71',
                            },
                            navy: {
                                        700: '#1a2b4a',
                                        800: '#0f1d35',
                                        900: '#0a1628',
                            },
                  },
                  fontFamily: {
                            sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                            display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                  },
          },
    },
    plugins: [],
}
export default config
