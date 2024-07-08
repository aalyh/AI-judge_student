import { mergeConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import { createHtmlPlugin } from 'vite-plugin-html';
import baseConfig from './vite.config.base';
import getViteEnv from '../src/utils/common/title';

const mode = 'development';
export default mergeConfig(
  {
    mode,
    server: {
      open: true,
      fs: {
        strict: true,
      },
    },
    plugins: [
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
        failOnError: false,
        fix: true,
      }),
      createHtmlPlugin({
        inject: {
          data: {
            VITE_APP_TITLE: getViteEnv(mode, 'VITE_APP_TITLE'),
          },
        },
      }),
    ],
  },
  baseConfig,
);
