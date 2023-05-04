/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      tablet: "800px",
    },
    extend: {
      colors: {
        "btn-grn": "rgb(169,237,74)",
        "prpl-dark": "rgb(17,2,29)",
        "prpl-light": "rgb(29,15,39)",
        "prpl-row": "rgb(41,20,54)",
        "prpl-lightest": "rgb(58,40,72)",
        "grey-light": "rgb(239,238,232)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
