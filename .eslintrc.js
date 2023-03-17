module.exports = {
  root: true,
  globals: {
    uni: true,
    getCurrentPages: true,
    getCurrentInstance: true,
    getApp: true,
    wx: true,
    requirePlugin: true,
    defineProps: "readonly",
    defineEmits: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly",
    NodeJS: "readonly",
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    sourceType: "module",
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      extends: ["plugin:@typescript-eslint/recommended", "plugin:vue/vue3-recommended"],
      rules: {
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-explicit-any": "off",
        "semi": [2, "always"],
        "quotes": [2, "double"],
        "quote-props": [2, "as-needed"]
      },
    },
    {
      files: ["*.vue"],
      parserOptions: {
        sourceType: "module",
        parser: "@typescript-eslint/parser",
      },
      extends: ["plugin:@typescript-eslint/recommended", "plugin:vue/vue3-recommended"],
      rules: {
        "vue/multi-word-component-names": "off",
        "vue/no-v-html": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "error",
        'vue/max-attributes-per-line': 'off',
        "semi": [2, "always"],
        "quotes": [2, "double"],
        "quote-props": [2, "as-needed"],
        "comma-dangle": ["error", {
          "arrays": "never",
          "objects": "always-multiline",
          "imports": "never",
          "exports": "never",
          "functions": "never"
        }],
      },
    },
  ]
};
