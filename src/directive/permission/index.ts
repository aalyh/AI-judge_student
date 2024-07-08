import { DirectiveBinding, ObjectDirective } from 'vue';
import { useUserStore } from '@/store';
import { checkPermissionIntersection } from '@/utils/arrayHelper';

/**
 * 鉴权
 * @param el
 * @param binding
 */
function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding;
  const userStore = useUserStore();
  const { auth } = userStore;

  if (Array.isArray(value)) {
    if (value.length > 0) {
      const permissionValues = value;

      const hasPermission = checkPermissionIntersection(auth, permissionValues);
      if (!hasPermission && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
  } else {
    throw new Error('无该权限');
  }
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
} as ObjectDirective;
