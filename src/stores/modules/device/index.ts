import { defineStore } from "pinia";
import { deviceParamType } from "../types/device";
const useDeviceStore = defineStore("useDeviceStore", {
  state: (): deviceParamType => {
    return {
      deviceHeight: 0,
      deviceWidth: 0,
    };
  },
  actions: {
    async initDeviceWH() {
      const { clientHeight, clientWidth } = document.documentElement;
      this.deviceHeight = clientHeight;
      this.deviceWidth = clientWidth;
    },
  },
});

export default useDeviceStore;
