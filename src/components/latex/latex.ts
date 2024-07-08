import markdownit from 'markdown-it';
// @ts-ignore
import mk from '@vscode/markdown-it-katex';

/**
 * @returns HTML字符串
 */
export default function render(src: string) {
  // @docs https://github.com/markdown-it/markdown-it
  const md = markdownit({
    html: false,
    linkify: true,
    typographer: true,
  });
  md.use(mk, {
    throwOnError: false,
    // 渲染失败时染色
    errorColor: ' #cc0000',
  });
  // 渲染HTML时永远注意XSS问题
  return md.render(src);
}
