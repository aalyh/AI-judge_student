/* eslint import/no-cycle: [2, { maxDepth: 3 }] */
import { createPinia } from 'pinia';
import useAppStore from './modules/app/index';
import useUserStore from './modules/user/index';
import useTabBarStore from './modules/tab-bar';

const pinia = createPinia();

export { useAppStore, useUserStore, useTabBarStore };
export default pinia;
