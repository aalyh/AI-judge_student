import { router } from "./router";
import { checkToken, removeToken } from "./utils/token";
import NProgress from "nprogress"; // 路由加载时候的进度条
import getPageTitle from "./utils/pageTitle";
import useUserStore from "@/stores/modules/userInfo/index";
import { showNotify } from "vant";
import { RouteLocationNormalized } from "vue-router";
let userStore: any;

NProgress.configure({ showSpinner: false });

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    NProgress.start();
    document.title = getPageTitle(to.meta.title as string | undefined);
    const isEffective = checkToken();
    if (!userStore) userStore = useUserStore();
    if (isEffective && to.path != "/" && from.path != "/") {
      return to.fullPath;
    } else if (!isEffective && userStore.token) {
      const msg = "登录过期, 请重新登陆";
      showNotify({ type: "danger", message: msg });
      userStore
        .logout()
        .then(() => {
          userStore.$reset();
          removeToken();
          return `/?redirect=${to.path}`;
        })
        .catch((err) => {
          showNotify({
            type: "danger",
            message: "服务器异常",
          });
          console.error(err);
          return `/?redirect=${to.path}`;
        });
    }
    NProgress.done();
  },
);

router.afterEach(() => {
  NProgress.done();
});
