module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#FFC286',
        secondary: '#66806A',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
