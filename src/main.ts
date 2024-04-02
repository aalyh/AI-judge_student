import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router/index";
import stores from "./stores/index";
import "./auth";
import "virtual:uno.css";
import "vant/es/toast/style";
import "vant/es/dialog/style";
import "vant/es/notify/style";
import "vant/es/image-preview/style";
import { Toast } from "vant";
import { Notify } from "vant";
import useDeviceStore from "./stores/modules/device";

const app = createApp(App);

app.use(router).use(stores).use(Toast).use(Notify);

const deviceStore = useDeviceStore();
deviceStore.initDeviceWH();
export type deviceStoreType = typeof deviceStore;

app.provide("$deviceStore", deviceStore);

app.mount("#app");
