import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolve the Tailwind config relative to this file, not the process
// CWD, so the dev server works no matter where it's launched from.
const dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  plugins: {
    tailwindcss: { config: path.join(dirname, "tailwind.config.js") },
    autoprefixer: {},
  },
};
