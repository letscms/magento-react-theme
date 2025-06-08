import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression(), // Gzip compression for production builds
    visualizer({ open: true, gzipSize: true, brotliSize: true }), // Bundle visualizer
  ],
  resolve: {
    alias: {
      '@': '/src', // Cleaner imports like import MyComp from '@/components/MyComp'
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs from production
      },
    },
    sourcemap: true, // Generate source maps for production
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group major vendor libraries into their own chunks
            if (id.includes('react-router-dom') || id.includes('react-router')) {
              return 'vendor-router';
            }
            if (id.includes('apollo') || id.includes('graphql')) {
              return 'vendor-apollo';
            }
            // Catch-all for other node_modules
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  optimizeDeps: {
    include: ['lodash', 'react-router-dom', '@apollo/client'], // Pre-bundle frequently used deps
  },
})
