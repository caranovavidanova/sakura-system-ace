import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import electron from "vite-plugin-electron/simple";
import renderer from "vite-plugin-electron-renderer";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  // Caminhos relativos — o Electron abre o app em produção via "file://",
  // e caminhos absolutos (começando com "/") não resolvem nesse protocolo
  // (tentam ler a partir da raiz do disco, não da pasta do app).
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    electron({
      main: {
        entry: "electron/main.ts",
      },
      preload: {
        input: "electron/preload.ts",
      },
    }),
    renderer(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
