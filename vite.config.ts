import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
 
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      name: 'github-pages-assets',
      writeBundle(options) {
        const outDir = options.dir ?? 'docs';
 
        // Only write GitHub Pages-specific files when building to docs/
        if (!outDir.endsWith('docs')) return;
 
        fs.writeFileSync(path.join(outDir, '.nojekyll'), '');
 
        if (fs.existsSync('CNAME')) {
          fs.copyFileSync('CNAME', path.join(outDir, 'CNAME'));
        }
 
        const indexContent = fs.readFileSync(path.join(outDir, 'index.html'), 'utf-8');
        fs.writeFileSync(path.join(outDir, '404.html'), indexContent);
      },
    },
  ],
  build: {
    outDir: 'docs',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_debugger: true,
        passes: 2,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      input: {
        main: 'index.html',
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
});
 
