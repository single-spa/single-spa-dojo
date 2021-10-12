import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: "src/single-spa-dojo.js",
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: true,
  },
  plugins: [nodeResolve(), terser()],
};

export default config;
