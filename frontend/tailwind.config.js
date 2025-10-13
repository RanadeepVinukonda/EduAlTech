export default {
  content: ["index.html", "src/**/*.{js,jsx}"],
  plugins: [require("daisyui")],

  daisyui: {
    themes: [
      {
        edualt: {
          primary: "#15803d",
          secondary: "#bbf7d0",
          accent: "#16a34a",
          neutral: "#f3f4f6",
          "base-100": "#ffffff",
          info: "#3b82f6",
          success: "#22c55e",
          warning: "#eab308",
          error: "#ef4444",
        },
      },
    ],
    theme: "edualt",
  },
};
