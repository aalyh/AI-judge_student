import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

import { IconifyIconCustomisations } from '@iconify/utils';

export default defineConfig({
  content: {
    pipeline: {
      include: [/\.(vue|ts)($|\?)/],
    },
  },
  // 自定义一组样式的缩写
  shortcuts: {
    'wh-full': 'w-full h-full',
    'f-col': 'flex flex-col',
    'f-row': 'flex flex-row',
  },
  // 配置规则
  rules: [],
  // 设置一些主题, 比如, 你可以在颜色里设置全局通用的颜色并取别名
  theme: {
    colors: {
      // ...
      // 设置color上, 你可以使用各种颜色编码
      success: '#1cdd74',
      // 你也可以使用一系列根元素上定义好的CSS变量
      error: 'rgb(var(--error-color))',
    },
    // 设置断点, 用于移动端适配，后面需要适配移动端时候，可以配置这个，暂时这些断点都用不上
    // 但需要注意的是, 这里的设置会覆盖全局, 如果这里没有设置, 那么可以使用默认的所有断点
    // 如果这里进行了设置, 那么就只能使用这里设置的断点, 例如, 这里没有配置xl，开发中就不可以使用xl断点了
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
    },
  },
  presets: [
    presetUno(),
    // 令样式可属性化, 不用全部写在class里, 便于组织
    presetAttributify(),
    // 预设图标, 可用图标集npm包需要自己去npm查找
    /**
     * @description 支持使用的图标集
     * @link https://www.npmjs.com/search?q=%40iconify-json
     */
    presetIcons({
      // 自定义图标样式的前缀
      prefix: ['i-'],
      collections: {
        /**
         * 配置集合缩写名为tb
         * 图标使用格式: i-tb-<icon> 或者 i-tb:<icon>
         * @description 本项目引入的tabler图标集
         * @link https://icones.js.org/collection/tabler
         */
        tabler: () => import('@iconify-json/tabler/icons.json').then((i) => i.default),
      },
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
      /**
       * @description 图标自定义配置项的类型文档
       * @link https://iconify.design/docs/libraries/utils/icon-customisations.html
       */
      customizations: {
        // 在这里配置图标的全局通用基本样式, 比如统一宽高
        customize(props: Required<IconifyIconCustomisations>) {
          props.width = '2em';
          props.height = '2em';
          return props;
        },
        // 对特定的图标自定义
        iconCustomizer(collection, icon, props) {
          // 判断collect和icon, 然后设置props, 不需要返回值
        },
      },
    }),
    presetTypography(),
  ],
  transformers: [
    // 配置需要的转换器, 比如使用类似TailwindCSS的@apply指令、比如支持jsx/tsx文件等
    transformerDirectives(),
    transformerVariantGroup(),
  ],
});
