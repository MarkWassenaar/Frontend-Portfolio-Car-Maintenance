// tailwind.config.js

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "dutch-license-plate-bg": "#FFCC00", // Yellow background
        "dutch-license-plate-text": "#000000", // Black text
      },
    },
  },
  plugins: [],
};
