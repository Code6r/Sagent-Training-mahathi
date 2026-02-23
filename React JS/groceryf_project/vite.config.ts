import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Use process.cwd() so aliases work when running from project root
const root = path.resolve(process.cwd());

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@api": path.resolve(root, "src/api"),
      "@components": path.resolve(root, "src/components"),
      "@pages": path.resolve(root, "src/pages"),
      "@store": path.resolve(root, "src/store"),
      "@routes": path.resolve(root, "src/routes"),
      "@hooks": path.resolve(root, "src/hooks"),
      "@utils": path.resolve(root, "src/utils")
    }
  },
  server: {
    port: 5173
  }
});
