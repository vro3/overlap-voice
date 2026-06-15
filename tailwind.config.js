/** @type {import('tailwindcss').Config} */
// v1.0.0 — 2026-06-15 — ported 1:1 from the former inline config in index.html
// (which was loaded via the runtime CDN). Build-time compilation now.
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './*.{ts,tsx}',
    './{components,hooks,services,utils,src}/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        background: '#1C1917', // Warm charcoal (stone-950)
        surface: '#292524', // Warm dark cards (stone-800)
        'surface-hover': '#353130', // Hover state
        sidebar: '#171412', // Sidebar - warm near-black
        border: '#3D3835', // Warm borders
        'border-subtle': '#332F2C', // Softer warm borders
        primary: '#F5F0EB', // Warm off-white text
        secondary: '#A8A29E', // Warm muted text (stone-400)
        muted: '#8C857D', // Helper text - warm gray
        accent: '#D4A853', // Warm amber/gold
        'accent-soft': '#8B7434', // Darker gold for backgrounds
        success: '#8B9A6B', // Sage green
        'success-soft': '#4A5238', // Dark sage
        danger: '#dc2626', // Red-600 (keep for errors)
        recording: '#C97B7B', // Warm rose for voice active state
        info: '#0891b2',
        'info-soft': '#164e63',
        highlight: '#7c3aed',
        'highlight-soft': '#4c1d95',
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(0, 0, 0, 0.3), 0 4px 16px -4px rgba(0, 0, 0, 0.2)',
        card: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
        glow: '0 0 20px rgba(212, 168, 83, 0.15)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
