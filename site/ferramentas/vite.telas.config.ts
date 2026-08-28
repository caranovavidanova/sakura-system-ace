// Config usada só pra gerar as imagens das telas do site.
// Roda a partir da RAIZ do repositório (é lá que estão o index.html e o src/).
// Sem os plugins do Electron — a app roda num navegador comum, com as
// chamadas ao Supabase interceptadas pelo Playwright.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": fileURLToPath(new URL("../../src", import.meta.url)) } },
  server: { port: 5199, strictPort: true },
});
