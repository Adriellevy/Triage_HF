/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '200px',  // Ejemplo: Tamaño de pantalla pequeño
        'sm': '480px',  // Ejemplo: Tamaño de pantalla pequeño
        'md': '768px',  // Ejemplo: Tamaño de pantalla mediano
        'lg': '1350px', // Ejemplo: Tamaño de pantalla grande
        // Puedes agregar más breakpoints según sea necesario
      },
    },
  },
  plugins: [],
}

