import { DirectiveBinding, ObjectDirective } from 'vue';
import { throttle } from '@/utils/common/performance';

/**
 * 节流指令
 * @example v-throttle:click="fn"
 * @param el 指令绑定的DOM
 * @param binding 传给指令的各种值
 */
function useThrottleDirective(el: HTMLElement, binding: DirectiveBinding) {
  const { value, arg } = binding;
  el.addEventListener(arg as string, throttle(value));
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    useThrottleDirective(el, binding);
  },
  beforeUnmount(el: HTMLElement, binding: DirectiveBinding) {
    el.removeEventListener(binding.arg as string, () => {});
  },
} as ObjectDirective;
