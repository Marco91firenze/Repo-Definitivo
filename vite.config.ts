import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

const isLandingBuild = process.env.BUILD_TARGET === 'landing';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    ...(isLandingBuild
      ? [
          {
            name: 'create-nojekyll',
            writeBundle() {
              fs.writeFileSync('docs/.nojekyll', '');
              if (fs.existsSync('CNAME')) {
                fs.copyFileSync('CNAME', 'docs/CNAME');
              }
              const indexContent = fs.readFileSync('docs/index.html', 'utf-8');
              fs.writeFileSync('docs/404.html', indexContent);
            },
          },
        ]
      : []),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: isLandingBuild ? 'docs' : 'dist',
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
        main: isLandingBuild ? 'landing.html' : 'index.html',
      },
      output: {
        manualChunks: isLandingBuild
          ? undefined
          : {
              vendor: ['react', 'react-dom', 'react-router-dom'],
            },
      },
    },
  },
});
