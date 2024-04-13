<script setup lang="ts">
import type { LoginParamsModel } from "@/types/user";
import { loginAPI } from "@/api/user";
import useUserStore from "@/stores/modules/userInfo";
import { getToken } from "@/utils/token";
import { useRouter } from "vue-router";
import { deviceStoreType } from "@/main";
const router = useRouter();
const choice = ref(-1);
const userStore = useUserStore();
// token有效就用token登录, 不然正常登录流程
const tokenLogin = async () => {
  const tokenObj = getToken();
  if (tokenObj) {
    const { expireTime, token } = tokenObj;
    let now = new Date().getTime();
    if (now < expireTime) {
      userStore.login(token).then(() => {
        router.replace({ path: "/main/home" });
      });
    }
  } else {
    return;
  }
};

const LoginPage = defineAsyncComponent(() => import("./components/Login.vue"));
const RegisterPage = defineAsyncComponent(
  () => import("./components/Register.vue")
);
const HeaderBar = defineAsyncComponent(
  () => import("@/components/headbar/index.vue")
);
const { deviceHeight } = inject("$deviceStore") as deviceStoreType;
const activeComp = shallowRef();
const handleChoose = (e: Event) => {
  let { value } = e.target as HTMLLIElement & { value: number };
  choice.value = value;
  if (choice.value == 0) {
    activeComp.value = LoginPage;
  } else if (choice.value == 1) {
    activeComp.value = RegisterPage;
  } else {
    activeComp.value = null;
  }
};
const handleLogin = (params: LoginParamsModel) => {
  console.log(params);
  loginAPI(params).then(
    ({ data }) => {
      const { token } = data;
      console.log(data);
      userStore.login(token).then(() => {
        setTimeout(() => {
          router.replace({ path: "/main/home" });
        }, 400);
      });
    },
    (err) => {
      console.log(err);
    }
  );
};
tokenLogin();
</script>

<template>
  <div>
    <div class="bg-teal-300 w-full h-[100vh]">
      <transition name="index">
        <div
          v-show="choice === -1"
          class="text-white text-9xl absolute left-1/2 top-40 font-900"
          style="transform: translateX(-50%)"
        >
          N
        </div>
      </transition>

      <transition name="index">
        <ul
          v-show="choice === -1"
          @click.capture="handleChoose"
          class="absolute bottom-25 m-0 w-full flex flex-col items-center"
        >
          <li
            value="0"
            class="block b-rounded-2 b-2 b-white text-teal-300 font-400 text-xl bg-white w-3/5 text-center py-3 mb-5"
          >
            登录
          </li>
          <li
            value="1"
            class="block text-white font-400 text-xl w-3/5 text-center py-3 b-solid b-white b-2 b-rounded-2"
          >
            注册
          </li>
        </ul>
      </transition>
    </div>

    <transition
      class="absolute top-0"
      v-show="choice != -1"
      name="switchPage"
      mode="in-out"
    >
      <div
        class="w-full bg-white overscroll-x-none"
        :style="{ height: deviceHeight + 'px' }"
      >
        <HeaderBar :default-back="false" @on-back="choice = -1" />
        <component
          @onLogin="handleLogin"
          class="flex-1 h-13/14 w-full flex flex-col justify-center items-center"
          :is="activeComp"
        />
        <div></div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.index-enter-active,
.index-leave-active {
  transition-duration: 0.3s;
}
.index-enter-from,
.index-leave-to {
  transform: scale(0.8);
  opacity: 0;
}
</style>
