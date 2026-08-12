/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#2ECC71',
          'green-light': '#58D68D',
          'green-dark': '#27AE60',
          deep: '#1E8449',
          'deep-dark': '#145A32',
          gold: '#FFC72C',
          'gold-light': '#FDD835',
          'gold-dark': '#F39C12',
          bg: '#FFFDF7',
          'bg-subtle': '#F4FBF7',
          ink: '#1F2A24',
          'ink-muted': '#566573',
          'ink-light': '#808B96',
          card: '#FFFFFF',
          border: '#E8F5E9'
        }
      },
      fontFamily: {
        heading: ['Poppins', 'Baloo 2', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'soft-green': '0 10px 25px -5px rgba(46, 204, 113, 0.25), 0 8px 10px -6px rgba(46, 204, 113, 0.15)',
        'soft-deep': '0 10px 25px -5px rgba(30, 132, 73, 0.3), 0 8px 10px -6px rgba(30, 132, 73, 0.2)',
        'soft-gold': '0 10px 25px -5px rgba(255, 199, 44, 0.35), 0 8px 10px -6px rgba(255, 199, 44, 0.2)',
        'soft-card': '0 12px 30px -4px rgba(31, 42, 36, 0.08), 0 4px 12px -2px rgba(31, 42, 36, 0.04)',
        'soft-card-hover': '0 20px 40px -4px rgba(46, 204, 113, 0.18), 0 8px 16px -2px rgba(31, 42, 36, 0.06)',
        'glow-green': '0 0 35px rgba(46, 204, 113, 0.4)',
        'glow-gold': '0 0 35px rgba(255, 199, 44, 0.5)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
