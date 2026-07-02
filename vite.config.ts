import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" keeps asset URLs relative so the static build works on
// GitHub Pages project sites as well as Vercel/Netlify without config.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
