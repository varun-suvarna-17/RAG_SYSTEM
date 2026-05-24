/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                indigo: {
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                },
                purple: {
                    500: '#a855f7',
                    600: '#9333ea',
                },
                cyan: {
                    400: '#22d3ee',
                },
            },
            animation: {
                'gradient': 'gradient 8s ease infinite',
                'border-dance': 'border-dance 4s ease infinite',
            },
            keyframes: {
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
            },
        },
    },
    plugins: [],
}
