/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        india: {
          saffron: '#FF9933',
          white: '#FFFFFF',
          green: '#138808',
          blue: '#000080', // Ashoka Chakra Blue
        },
        airline: {
          airindia: { primary: '#E31837', secondary: '#FDB615' },
          indigo: { primary: '#001B94', secondary: '#00D1FF' },
          vistara: { primary: '#5C0931', secondary: '#B98D5B' },
          spicejet: { primary: '#E42823', secondary: '#FEE000' },
          akasa: { primary: '#F95C03', secondary: '#FFFFFF' }
        }
      },
      backgroundImage: {
        'tricolor-gradient': 'linear-gradient(135deg, rgba(255,153,51,0.1) 0%, rgba(255,255,255,0.7) 50%, rgba(19,136,8,0.1) 100%)',
        'tricolor-bar': 'linear-gradient(to right, #FF9933 0%, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%, #138808 100%)'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif']
      }
    },
  },
  plugins: [],
}
