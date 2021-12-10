module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        green: {
          light: "#b4c4a6",
          dark: '#66806a'
        },
        peach: {
          light: "#ffc286",
          dark: '#fff1af'
        },
        grey: {
          light: "#D1D5DB",
          dark: "#9CA3AF"
        },
        light: {
          light: "#ffffff",
          dark: "#000000"
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
