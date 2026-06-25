import nextConfig from "eslint-config-next";
import nextPlugin from "@next/eslint-plugin-next";

const config = [...nextConfig, nextPlugin.configs["core-web-vitals"]];

export default config;
