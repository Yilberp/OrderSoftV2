module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        fontFamily: {
            nav: ["Poppins", "sans-serif"],
        },
        extend: {},
    },
    variants: {
        extend: {
            visibility: ["group-hover", "focus-within", "hover", "focus"],
            height: ["hover", "focus"],
        },
    },
    plugins: [require("@tailwindcss/forms")],
};
