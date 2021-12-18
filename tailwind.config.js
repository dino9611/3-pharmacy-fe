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

        green: {
          light: '#b4c4a6',
          dark: '#66806a',
        },
        peach: {
          light: '#ffc286',
          dark: '#fff1af',
        },
        grey: {
          light: '#D1D5DB',
          dark: '#9CA3AF',
        },
        light: {
          light: '#ffffff',
          dark: '#000000',
        },
        'gCol': '#e0e0e0',
        'bCol': '#66806A',
        'cCol': '#FFC286',
        'dCol': '#B4C6A6'
      },
      screens: {
        'phone': { 'max': '640px' },
        // => @media (max-width: 640px) { ... }

        'laptop': { 'max': '1440px' },
        // => @media (max-width: 1440px) { ... }
      }
    },
    variants: {
      extend: {},
    },
  }
}
