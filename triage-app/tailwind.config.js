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
        'lg': '1250px', // Ejemplo: Tamaño de pantalla grande
        // Puedes agregar más breakpoints según sea necesario
      },
      keyframes: {
        slideInFromTop: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOutToBottom: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        slideInFromLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInFromRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutToLeft: {
          '0%': { transform: 'translateX(0)', opacity: '1' }, 
          '100%': { transform: 'translateX(-100%)', opacity: '0' }, // 
        },
        slideOutToRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' }, 
          '100%': { transform: 'translateX(100%)', opacity: '0' }, 
        },
      },
      animation: {
        slideInFromTop: 'slideInFromTop 0.5s ease-in-out',
        slideOutToBottom: 'slideOutToBottom 0.5s ease-in-out',
        slideInFromLeft: 'slideInFromLeft 0.5s ease-in-out',
        slideInFromRight: 'slideInFromRight 0.5s ease-in-out',
        slideOutToLeft: 'slideOutToLeft 0.5s ease-in-out',
        slideOutToRight: 'slideOutToRight 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
}

