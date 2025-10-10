/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js}'],
    theme: {
        extend: {
            colors: {
                // ORIF Palette
                // https://coolors.co/005ba9-0083f5-00417a-dbceb1-e5dcc7-ccb88f-111111-ebebeb
                'blue': {
                    'light': '#0083f5',
                    DEFAULT: '#005ba9',
                    'dark': '#00417a'
                },
                'beige': {
                    'light': '#e5dcc7',
                    DEFAULT: '#dbceb1',
                    'dark': '#ccb88f'
                },
                'night': '#111111',
                'white': '#ebebeb',
            },

            keyframes: {
                "bounce-on-surface": {
                    "0%": {
                        transform: "scale(1.25, 0.65) translateY(30%)",
                        animationTimingFunction: "ease-in"
                    },
                    "33%": {
                        transform: "scale(1) translateY(0%)",
                        animationTimingFunction: "ease-out"
                    },
                    "100%": {
                        transform: "translateY(-150%)",
                        animationTimingFunction: "ease-out"
                    },
                }
            },

            animation: {
                "bounce-on-surface": "bounce-on-surface 0.5s alternate infinite"
            }
        }
    }
}
