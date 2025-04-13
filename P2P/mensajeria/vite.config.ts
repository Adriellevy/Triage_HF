import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      util: "util/", // importante el slash
    },
  },
});
