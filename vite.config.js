import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import banner from 'vite-plugin-banner'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      vue(),
      banner(`
      ═══════════════════════════════════════════════════════════════
      ║  Proyecto: ERP Tracker Mobility - Sistema de Gestión       ║
      ║  Empresa:  MetaSoft Solutions SAC                          ║
      ║  Website:  www.metasoft.pe                                 ║
      ║                                                             ║
      ║  Desarrolladores:                                          ║
      ║  • Janover Gonzalo Saldaña Vela (Full Stack Developer)    ║
      ║  • Claudio Jesús Moreno Rosales (Full Stack Developer)    ║
      ║                                                             ║
      ║  Versión:  1.0.0                                           ║
      ║  Fecha:    17 de Noviembre 2025                            ║
      ║                                                             ║
      ║  © 2025 MetaSoft Solutions SAC                             ║
      ║  Todos los derechos reservados                             ║
      ═══════════════════════════════════════════════════════════════
    `)

  ],
})
