import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "components/ui/**",
        "components/media/**",
        "components/reui/**",
        "**/*.test.{ts,tsx}",
        "test/**",
      ],
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
});
