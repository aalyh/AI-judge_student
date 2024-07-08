import { mergeConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import baseConfig from './vite.config.base';
import configVisualizerPlugin from './plugin/visualizer';
import configCompressPlugin from './plugin/compress'; // 暂不需要
import configArcoResolverPlugin from './plugin/arcoResolver'; // 这个插件会导致build失败，暂不使用
import configImageminPlugin from './plugin/imagemin';
import getViteEnv from '../src/utils/common/title';

const mode = 'production';
export default mergeConfig(
  {
    mode,
    plugins: [
      configVisualizerPlugin(),
      // configCompressPlugin('gzip'),
      // configArcoResolverPlugin(),
      configImageminPlugin(),
      createHtmlPlugin({
        inject: {
          data: {
            VITE_APP_TITLE: getViteEnv(mode, 'VITE_APP_TITLE'),
          },
        },
      }),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            arco: ['@arco-design/web-vue'],
            chart: ['echarts', 'vue-echarts'],
            vue: ['vue', 'vue-router', 'pinia', '@vueuse/core', 'vue-i18n'],
          },
        },
      },
      chunkSizeWarningLimit: 2000,
      reportCompressedSize: false,
      // sourcemap: true,
    },
  },
  baseConfig,
);
