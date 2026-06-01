import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';
import {viteSingleFile} from 'vite-plugin-singlefile';

const removeModuleTypePlugin = {
  name: 'remove-module-type',
  closeBundle() {
    try {
      const htmlPath = path.resolve(__dirname, 'dist/index.html');
      if (fs.existsSync(htmlPath)) {
        let html = fs.readFileSync(htmlPath, 'utf8');
        html = html.replace(/<script type="module">/g, '<script>');
        html = html.replace(/<script type="module"/g, '<script');
        fs.writeFileSync(htmlPath, html, 'utf8');
        console.log('Offline patch: successfully removed type="module" for local double-click load support!');
      }
    } catch (err) {
      console.error('Offline patch error:', err);
    }
  }
};

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(), 
      tailwindcss(), 
      viteSingleFile({ removeViteModuleLoader: true }),
      removeModuleTypePlugin
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
