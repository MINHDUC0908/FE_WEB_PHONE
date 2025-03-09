export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'bg-primary',
    'bg-secondary',
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ffcf3a",
        secondary: "#0063ff",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        }
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'], // Định nghĩa font Montserrat
      },
    },
  },
  plugins: [],
}
