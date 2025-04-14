import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true, // 👈 esto expone a la red local
  },
  resolve: {
    alias: {
      util: "util/", // importante el slash
    },
  },
});
