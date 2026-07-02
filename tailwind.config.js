import path from "node:path";
import { fileURLToPath } from "node:url";

// Anchor content globs to this file so class scanning works no matter
// which directory the dev server is launched from.
const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(dirname, "index.html"),
    path.join(dirname, "src/**/*.{ts,tsx}"),
  ],
  theme: {
    extend: {
      colors: {
        // Base surfaces — deep charcoal with a faint green cast (Aftrak-adjacent)
        ink: "#0C110E",
        panel: "#131A15",
        edge: "#243028",
        // Aftrak brand direction: green + orange
        leaf: {
          DEFAULT: "#43A047",
          bright: "#66BB6A",
          deep: "#2E7D32",
        },
        ember: {
          DEFAULT: "#F5862B",
          bright: "#FFA85C",
          deep: "#C96A1B",
        },
        // Water / hydraulic accent
        water: {
          DEFAULT: "#2B7FD6",
          bright: "#6FB3F2",
          deep: "#1B5FA8",
        },
        mist: "#E8EFEA", // primary light text
        fog: "#9DB0A4",  // secondary text
      },
      fontFamily: {
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      maxWidth: {
        wrap: "72rem",
      },
    },
  },
  plugins: [],
};
