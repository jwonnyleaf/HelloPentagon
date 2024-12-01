/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        offwhite: '#F0EFF4',
        purple: '#6c59ab',
        cyan: '#087E8B',
      },
      fontFamily: {
        rubikmono: ['Rubik Mono One', 'sans-serif'],
        opensans: ['Open Sans', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
