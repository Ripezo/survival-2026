import { defineConfig } from "vite";

// --host en los scripts: hace falta para abrirlo desde el móvil
// en la misma red wifi. Ver README.
export default defineConfig({
  server: { host: true, port: 5173 },
});
