import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import autoprefixer from 'autoprefixer'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VantResolver } from '@vant/auto-import-resolver';

export default ({ command, mode }) => {
  // 获取环境变量
  const env: Partial<ImportMeta> = loadEnv(mode, process.cwd());
  return defineConfig({
    define: {
      'process.env': env,
    },
    resolve: {
      alias: [
        {
          find: '@/',
          replacement: '/src/'
        }
      ]
    },
    server: {
      hmr: true,
      open: true,
    },
    plugins: [
      vue(),
      UnoCSS(),
      AutoImport({
        imports: ['vue', 'vue-router'],
        dts: 'src/auto-import.d.ts',
        eslintrc: {
          enabled: true,
        },
      }),
      Components({
        resolvers: [VantResolver()],
      })
    ],
    build: {
      outDir: 'dist',
      sourcemap: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: true,
          drop_debugger: true,
        },
      },
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
        }
      }
    },
    css: {
      postcss: {
        plugins: [autoprefixer]
      }
    },
  });
};