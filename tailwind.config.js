module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors:{
          'gCol': '#e0e0e0',
          'bCol' :'#66806A',
          'cCol' : '#FFC286'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
