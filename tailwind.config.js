/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Core surfaces — OKLCH-mapped to hex approx for Tailwind */
        "surface-base":    "#0e1018",   /* oklch(13% 0.012 240) */
        "surface-raised":  "#141820",   /* oklch(17% 0.012 240) */
        "surface-overlay": "#1a2028",   /* oklch(20% 0.013 240) */
        "surface-border":  "#252d38",   /* oklch(26% 0.014 240) */

        /* Text */
        "text-primary":   "#f2efeb",    /* oklch(95% 0.006 80) — warm off-white */
        "text-secondary": "#8ba3bf",    /* oklch(70% 0.012 230) */
        "text-muted":     "#566677",    /* oklch(52% 0.010 230) */

        /* Accent — amber gold */
        "accent":         "#dba83a",    /* oklch(78% 0.155 72) */
        "accent-dim":     "#c09030",    /* oklch(68% 0.135 72) */
        "accent-text":    "#1e1408",    /* oklch(18% 0.04 72) */

        /* Legacy aliases — keep AdminDashboard + ClientDashboard from breaking */
        "background":               "#0e1018",
        "surface":                  "#141820",
        "on-surface":               "#f2efeb",
        "on-surface-variant":       "#8ba3bf",
        "primary-fixed":            "#dba83a",
        "on-primary-fixed":         "#1e1408",
        "primary-fixed-dim":        "#c09030",
        "primary":                  "#f2efeb",
        "secondary":                "#8ba3bf",
        "on-primary":               "#1e1408",
        "surface-container":        "#1a2028",
        "surface-container-high":   "#1e2630",
        "surface-container-highest":"#252d38",
        "surface-container-low":    "#141820",
        "surface-container-lowest": "#0e1018",
        "surface-variant":          "#252d38",
        "surface-bright":           "#2e3848",
        "on-secondary":             "#0e1018",
        "outline":                  "#566677",
        "outline-variant":          "#252d38",
        "error":                    "#f28b82",
        "on-error":                 "#690005",
        "error-container":          "#93000a",
      },
      fontFamily: {
        /* New design system */
        "display":   ["'DM Serif Display'", "Georgia", "serif"],
        "body":      ["'DM Sans'", "system-ui", "sans-serif"],
        "mono":      ["'JetBrains Mono'", "'Courier New'", "monospace"],
        /* Legacy aliases keep old classnames working */
        "body-md":              ["'DM Sans'", "system-ui", "sans-serif"],
        "body-lg":              ["'DM Sans'", "system-ui", "sans-serif"],
        "display-lg":           ["'DM Serif Display'", "Georgia", "serif"],
        "display-lg-mobile":    ["'DM Serif Display'", "Georgia", "serif"],
        "display-md":           ["'DM Serif Display'", "Georgia", "serif"],
        "headline-md":          ["'DM Sans'", "system-ui", "sans-serif"],
        "headline-lg":          ["'DM Sans'", "system-ui", "sans-serif"],
        "label-caps":           ["'JetBrains Mono'", "monospace"],
      },
      spacing: {
        "container-padding-mobile":  "1.5rem",
        "container-padding-desktop": "4rem",
      },
    },
  },
  plugins: [],
}
