// tailwind.config.js (기존 파일 수정본)
const plugin = require("tailwindcss/plugin");
const fs = require("fs");
const path = require("path");

module.exports = {
  content: [
    "./js/**/*.js",
    "./js/**/*.jsx",
    "./js/**/*.ts",
    "./js/**/*.tsx",
    "../lib/agora_web.ex",
    "../lib/agora_web/**/*.*ex",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#FD4F00", // (기존값 유지)
        ag: {
          primary: {
            50: "var(--ag-primary-50)",
            100: "var(--ag-primary-100)",
            200: "var(--ag-primary-200)",
          },
          secondary: "var(--ag-secondary)",
          success: "var(--ag-success)",
          error: "var(--ag-error)",
          gray: {
            50: "var(--ag-gray-50)",
            100: "var(--ag-gray-100)",
            200: "var(--ag-gray-200)",
            300: "var(--ag-gray-300)",
            400: "var(--ag-gray-400)",
            500: "var(--ag-gray-500)",
            600: "var(--ag-gray-600)",
            700: "var(--ag-gray-700)",
            800: "var(--ag-gray-800)",
            900: "var(--ag-gray-900)",
            1000: "var(--ag-gray-1000)",
          },
        },
      },
      borderRadius: {
        ag: "var(--ag-radius)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    plugin(({ addVariant }) =>
      addVariant("phx-click-loading", [
        ".phx-click-loading&",
        ".phx-click-loading &",
      ]),
    ),
    plugin(({ addVariant }) =>
      addVariant("phx-submit-loading", [
        ".phx-submit-loading&",
        ".phx-submit-loading &",
      ]),
    ),
    plugin(({ addVariant }) =>
      addVariant("phx-change-loading", [
        ".phx-change-loading&",
        ".phx-change-loading &",
      ]),
    ),
    plugin(function ({ matchComponents, theme }) {
      let iconsDir = path.join(__dirname, "../deps/heroicons/optimized");
      let values = {};
      let icons = [
        ["", "/24/outline"],
        ["-solid", "/24/solid"],
        ["-mini", "/20/solid"],
        ["-micro", "/16/solid"],
      ];
      icons.forEach(([suffix, dir]) => {
        fs.readdirSync(path.join(iconsDir, dir)).forEach((file) => {
          let name = path.basename(file, ".svg") + suffix;
          values[name] = { name, fullPath: path.join(iconsDir, dir, file) };
        });
      });
      matchComponents(
        {
          hero: ({ name, fullPath }) => {
            let content = fs
              .readFileSync(fullPath)
              .toString()
              .replace(/\r?\n|\r/g, "");
            let size = theme("spacing.6");
            if (name.endsWith("-mini")) size = theme("spacing.5");
            else if (name.endsWith("-micro")) size = theme("spacing.4");
            return {
              [`--hero-${name}`]: `url('data:image/svg+xml;utf8,${content}')`,
              "-webkit-mask": `var(--hero-${name})`,
              mask: `var(--hero-${name})`,
              "mask-repeat": "no-repeat",
              "background-color": "currentColor",
              "vertical-align": "middle",
              display: "inline-block",
              width: size,
              height: size,
            };
          },
        },
        { values },
      );
    }),
  ],
};
