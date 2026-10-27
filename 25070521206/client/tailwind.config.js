/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'alice-blue': '#dcedff',
        'powder-blue': '#94b0da',
        'lavender-grey': '#8f91a2',
        'charcoal': '#505a5b',
        'onyx': '#121616',
        'bg-primary': '#f6f9fc',
        'text-primary': '#121616',
        surface: {
          light: '#ffffff',
          'light-subtle': '#f6f9fc',
          dark: '#1a1f20',
          'dark-subtle': '#141819',
          'dark-border': '#262d2e',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'aspen': '0 1px 3px 0 rgba(18, 22, 22, 0.05), 0 10px 30px -5px rgba(18, 22, 22, 0.04)',
        'aspen-hover': '0 4px 6px -1px rgba(18, 22, 22, 0.08), 0 20px 40px -10px rgba(148, 176, 218, 0.18)',
        'aspen-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'search': '0 20px 50px -10px rgba(18, 22, 22, 0.12), 0 0 0 1px rgba(148, 176, 218, 0.25)',
      }
    },
  },
  plugins: [],
}
