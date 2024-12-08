/* eslint-disable indent */
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { viteVConsole } from 'vite-plugin-vconsole';

import { preprocess } from './scripts/plugins';

const host = process.env.TAURI_DEV_HOST;

const target = process.env.TAURI_ENV_TARGET_TRIPLE;
const isDev = process.env.TAURI_APP_BUILD_MODE === 'development';
const isOpenVConsole =
  isDev && (target === 'aarch64-apple-ios' || target === 'aarch64-linux-android');

// https://cn.vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // const isTest = mode === 'test';
  // const isProduction = command === 'build';
  return {
    appType: 'spa',
    base: '/',
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
      },
    },
    envPrefix: ['VITE_', 'TAURI_', 'LONANOTE_'],
    envDir: 'scripts/env',
    json: {
      stringify: true,
    },
    logLevel: 'info',
    plugins: [
      preprocess({
        copyFiles: [
          {
            from: 'node_modules/vditor',
            to: 'public/libs/vditor',
          },
        ],
      }),
      react({
        // react核心
        babel: {},
      }),
      viteVConsole({
        entry: path.resolve(__dirname, 'src/index.tsx'),
        enabled: isOpenVConsole,
        localEnabled: false,
        config: {
          log: {
            maxLogNumber: 1000,
            showTimestamps: true,
          },
          theme: 'light',
          onReady() {
            console.log('vConfig init success');
          },
        },
      }),
    ],
    publicDir: 'public',
    root: process.cwd(),

    build: {
      assetsDir: 'static',
      assetsInlineLimit: 4096,
      copyPublicDir: true,
      chunkSizeWarningLimit: 4096,
      cssCodeSplit: true,
      cssMinify: true,
      cssTarget: 'chrome61',
      minify: 'esbuild',
      outDir: 'dist',
      reportCompressedSize: false,
      sourcemap: false,
      target: 'es2015',
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
    },

    preview: {
      host: '0.0.0.0',
      port: 9999,
      open: false,
    },
    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    // 1. tauri expects a fixed port, fail if that port is not available
    server: {
      base: '/',
      host: host || '0.0.0.0',
      port: 8000,
      open: false,
      watch: {
        // 2. tell vite to ignore watching `src-tauri`
        ignored: ['src-rs/**'],
      },
      // port: 1420,
      // strictPort: true,
      hmr: host
        ? {
            protocol: 'ws',
            host,
            port: 1421,
          }
        : undefined,
    },

    // test: {
    //   include: ['test/**/*.test.?(c|m)[jt]s?(x)'],
    //   exclude: ['**/node_modules/**', '**/build/**'],
    //   environment: 'happy-dom',
    //   globals: true,
    // },

    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // 或 "modern"，"legacy"
        },
      },
    },
  };
});
