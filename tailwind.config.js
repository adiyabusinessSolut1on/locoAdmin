/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // sans: ["system-ui", "sans-serif"],
        // Add more font families as needed
        mavenPro: ["Maven Pro", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      gridTemplateColumns: {
        customAwarness: "40px 1fr 1fr 1fr 0.4fr 0.6fr",
        customQuiz: "40px 1fr 1fr 1fr 1fr  0.6fr 0.6fr",
        customQuizQuestion: "40px 1fr 1.6fr 1.6fr  0.6fr",
        customImportand: "40px 0.8fr 1fr 1fr 0.6fr",
        customUsers: "40px 0.4fr 1fr 1.2fr 1fr 0.6fr",

        customSetting: "40px 1fr 0.4fr 0.4fr 1.5fr 1.5fr 0.8fr 0.6fr",
        customBlog: "40px 0.4fr 1fr 1fr 0.6fr",
        customVideo: "40px  1fr 1fr 0.4fr 1fr  1fr 0.8fr 0.6fr ",
        customProduct: "40px  1fr 1fr 2fr 1fr 1fr 0.8fr 0.6fr",

        customCompanies:
          "40px 1.4fr 1fr 0.6fr 1fr 2fr 1fr 1fr 1fr 0.8fr 0.8fr ",
        customeCategory: "40px 2fr 1fr 1.2fr",
        customDaily: "40px 1fr  4fr  0.6fr",
        customDetails: "40px 1fr 1fr 1fr 1fr",
        customAllPost: "40px 1fr 1fr",
        customPost: "40px 1fr 1fr 1fr 1fr",
        customBlogDahsbord: "40px 1fr 1fr 1fr",
      },
    },
  },

  plugins: [require("@tailwindcss/line-clamp")],
};
