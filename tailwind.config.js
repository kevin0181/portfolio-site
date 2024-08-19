/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                jua: ['Jua', 'sans-serif'],
                Kanit: ['Kanit', 'sans-serif'],
                noto: ['Noto Sans KR', 'sans-serif'],
            },
        },
    },
    plugins: [],
}