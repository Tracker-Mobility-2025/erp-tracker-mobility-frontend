import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import banner from 'vite-plugin-banner'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
      vue(),
      banner(`
      -----------------------------------------
      Proyecto: ERP Tracker Mobility
      Company: MetaSoft Solutions
      Developers: Janover Gonzalo Saldaña Vela & Claudio Jesús Moreno Rosales 
      version: 1.0.0
      Date: Pendiente
      © 2025 - Todos los derechos reservados
      -----------------------------------------
    `)

  ],
})
