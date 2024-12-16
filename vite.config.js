import { defineConfig } from 'vite';

require('dotenv').config();

export default defineConfig(() => ({
  publicDir: 'resources/static',
  css: {
    devSourcemap: true
  },
  server: {
    origin: 'http://localhost:5173',
  },
  base: '',
  build: {
    assetsDir: '',
    emptyOutDir: true,
    manifest: true,
    sourcemap: process.env.WP_DEFAULT_THEME === 'local' ? true : false,
    outDir: `public/themes/${process.env.WP_DEFAULT_THEME}/assets`,
    rollupOptions: {
      input: 'resources/js/index.js',
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          let extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          } else if (/woff|woff2|eot|ttf/.test(extType)) {
            extType = 'css';
          }
          return `${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
  },
  plugins: [
    {
      name: 'php',
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.php')) {
          server.ws.send({ type: 'full-reload', path: '*' });
        }
      },
    },
    {
      name: 'twig',
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.twig')) {
          server.ws.send({ type: 'full-reload', path: '*' });
        }
      },
    },
  ],
}));
