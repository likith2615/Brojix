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
        /* Core surfaces */
        "surface-base":    "#0d0f14",
        "surface-raised":  "#131720",
        "surface-overlay": "#181d28",
        "surface-border":  "#222a36",
        "surface-high":    "#2a3444",

        /* Text */
        "text-primary":    "#f0ede8",
        "text-secondary":  "#8a9ab0",
        "text-muted":      "#4f5f72",

        /* Accent — lemon yellow brand */
        "accent":          "#d2f000",
        "accent-dim":      "#b8d300",
        "accent-text":     "#1e2200",

        /* Legacy aliases — keep AdminDashboard + ClientDashboard from breaking */
        "background":               "#0d0f14",
        "surface":                  "#131720",
        "on-surface":               "#f0ede8",
        "on-surface-variant":       "#8a9ab0",
        "primary-fixed":            "#d2f000",
        "on-primary-fixed":         "#1e2200",
        "primary-fixed-dim":        "#b8d300",
        "primary":                  "#f0ede8",
        "secondary":                "#d2f000",
        "on-primary":               "#1e2200",
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
