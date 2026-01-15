import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import jest from "eslint-plugin-jest";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      camelcase: "error",
      curly: "error",
      eqeqeq: "error",
    },
  },
  {
    // jest
    files: ["**/*.spec.js", "**/*.test.js"],
    plugins: { jest: jest },
    languageOptions: {
      globals: jest.environments.globals.globals,
    },
    rules: {
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
    },
  },
]);
