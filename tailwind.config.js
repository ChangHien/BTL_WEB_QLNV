/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1890ff',      // Màu chủ đạo của Antd
        'primary-hover': '#40a9ff',
        'primary-active': '#096dd9',
        'bg-light': '#f0f2f5',   // Màu nền body cũ
        success: '#52c41a',
        danger: '#ff4d4f',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 16px rgba(0, 0, 0, 0.1)',
        'glow': '0 4px 15px rgba(24, 144, 255, 0.4)',
      },
      keyframes: {
        slideUpFade: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGreen: {
          '0%': { boxShadow: '0 0 0 0 rgba(82, 196, 26, 0.7)' },
          '70%': { boxShadow: '0 0 0 6px rgba(82, 196, 26, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(82, 196, 26, 0)' },
        }
      },
      animation: {
        'enter': 'slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'status': 'pulseGreen 2s infinite',
      }
    },
  },
  plugins: [],
}