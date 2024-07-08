import { App, ObjectDirective } from 'vue';
import permission from './permission';
import debounce from './debounce';
import throttle from './throttle';

interface DirectiveMapType {
  [key: string]: ObjectDirective;
}
const directiveMap: DirectiveMapType = {
  permission,
  debounce,
  throttle,
};

export default {
  install(Vue: App) {
    Object.keys(directiveMap).forEach((key) => {
      Vue.directive(key, directiveMap[key]);
    });
  },
};
