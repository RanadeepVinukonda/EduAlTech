export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:5000", // proxy in dev mode only
    },
  },
});
