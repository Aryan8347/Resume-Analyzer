/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#6366f1", // Keep as fallback
                secondary: "#ec4899", // Keep as fallback
                dark: "#0a0a0a", // BreachBunny Black
                "neon-pink": "#ff07fe",
                "neon-purple": "#6852fd",
                "neon-blue": "#1d4ed8",
            },
            fontFamily: {
                mono: ['"Space Mono"', "monospace"],
                sans: ['"Anek Latin"', "sans-serif"],
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
}
