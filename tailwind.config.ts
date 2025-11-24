import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
            },
            colors: {
                primary: {
                    DEFAULT: "#2563EB", // Blue 600
                    foreground: "#FFFFFF",
                },
                secondary: {
                    DEFAULT: "#F1F5F9", // Slate 100
                    foreground: "#0F172A", // Slate 900
                },
                success: {
                    DEFAULT: "#10B981", // Emerald 500
                    foreground: "#FFFFFF",
                },
                danger: {
                    DEFAULT: "#EF4444", // Red 500
                    foreground: "#FFFFFF",
                },
                background: "#FFFFFF",
                foreground: "#0F172A", // Slate 900
                muted: {
                    DEFAULT: "#F8FAFC", // Slate 50
                    foreground: "#64748B", // Slate 500
                },
                border: "#E2E8F0", // Slate 200
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
