module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary1: '#22577A',
        secondary1: '#38A3A5',
        lightblue: '#ceeaeb',
        third1: '#57CC99',
        fourth1: '#80ED99',

        primary2: '#193498',
        secondary2: '#113CFC',
        third2: '#1597E5',
        fourth2: '#69DADB',

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
        gCol: '#e0e0e0',
        bCol: '#66806A',
        cCol: '#FFC286',
        dCol: '#B4C6A6',
      },
      screens: {
        phone: { max: '640px' },
        // => @media (max-width: 640px) { ... }

        laptop: { max: '1440px' },
        // => @media (max-width: 1440px) { ... }
      },
    },
    variants: {
      extend: {},
    },
  },
};
