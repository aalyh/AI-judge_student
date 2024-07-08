import { DirectiveBinding, ObjectDirective } from 'vue';
import { debounce } from '@/utils/common/performance';

/**
 * 防抖指令
 * @example v-debounce:click="fn"
 * @param el 指令绑定的DOM
 * @param binding 传给指令的各种值
 */
function useDebounceDirective(el: HTMLElement, binding: DirectiveBinding) {
  const { value, arg } = binding;
  el.addEventListener(arg as string, debounce(value));
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    useDebounceDirective(el, binding);
  },
  beforeUnmount(el: HTMLElement, binding: DirectiveBinding) {
    el.removeEventListener(binding.arg as string, () => {});
  },
} as ObjectDirective;
