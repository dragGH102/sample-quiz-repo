module.exports = {
  root: true,
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: { "project": ["./tsconfig.json"] },
  plugins: ["@typescript-eslint"],
  rules: {
  "no-unused-vars": "off",
  "@typescript-eslint/no-unused-vars": ["warn"],
  "@typescript-eslint/ban-types": ["warn", {
    "types": {
      "Function": "Don't use Function because it is unsafe",
      "{}": false,
    },
    "extendDefaults": true
  },
  ],
}
};
 