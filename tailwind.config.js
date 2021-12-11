module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#5A745E',
          200: '#4E6852',
          300: '#425C46',
          400: '#36503A',
          450: '#66806A', // root color
          500: '#A2BCA6',
          600: '#AEC8B2',
          700: '#BAD4BE',
          800: '#C6E0CA',
          900: '#D2ECD6',
        },
        secondary: '#B4C6AA',
        third: '#FFC286',
        fourth: '#FFF1AF',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
