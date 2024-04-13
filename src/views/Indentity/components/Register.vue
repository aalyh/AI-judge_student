<script setup lang="ts">
import type { RegisterFormType, LoginParamsModel } from "@/types/user";
import { debounce } from "@/utils/fluentCtrl";
import { showFailToast, showToast } from "vant";
import { sendCodeAPI, registerAPI } from "@/api/user";
import { mailReg } from "@/utils/regExp";
const emits = defineEmits<{
  (e: "onLogin", loginParams: LoginParamsModel): void;
}>();
const SpeInput = defineAsyncComponent(
  () => import("@/components/speInput/index.vue"),
);
const form = ref<RegisterFormType>({
  username: "",
  password: "",
  rePassword: "",
  mail: "",
  code: "",
});
const formKeys = [
  { key: "userName", placeholder: "用户名" },
  { key: "password", placeholder: "密码" },
  { key: "rePassword", placeholder: "再次输入密码确认" },
  { key: "mail", placeholder: "邮箱" },
  { key: "code", placeholder: "验证码" },
];
const codeBtnContent = ref<string | number>("发送验证码");
const sendCode = debounce((): void => {
  if (mailReg.test(form.value.mail)) {
    sendCodeAPI(form.value.mail).then(({ code }) => {
      showToast({ type: "success", message: "验证码已发送" });
      if (code == 200) {
        codeBtnContent.value = 60;
        let codeTimer: NodeJS.Timeout | null = setInterval(() => {
          (codeBtnContent.value as number)--;
        }, 1 * 1000);

        setTimeout(() => {
          clearInterval(codeTimer as NodeJS.Timeout);
          codeTimer = null;
          codeBtnContent.value = "发送验证码";
        }, 60 * 1000);
      }
    });
  } else {
    showToast({ type: "fail", message: "请检查邮箱格式" });
  }
});
const register = debounce(async (): Promise<void> => {
  if (Object.values(form.value).some((item) => !item)) {
    showFailToast("有数据尚未填写");
    return;
  }
  if (form.value.password != form.value.rePassword) {
    showFailToast("密码不一致");
    return;
  }
  if (!mailReg.test(form.value.mail)) {
    showToast({ type: "fail", message: "请检查邮箱格式" });
    return;
  }
  try {
    const { code, message } = await registerAPI(form.value);
    if (code == 200) {
      showToast({ type: "success", message: "注册成功, 即将登录" });
      setTimeout(() => {
        emits("onLogin", {
          name: form.value.userNamem,
          password: form.value.password,
        });
      }, 600);
    } else {
      showFailToast(message as string);
      return;
    }
  } catch (e) {
    console.log(e);
  }
});
</script>

<template>
  <div class="">
    <div
      class="text-teal-300 text-9xl absolute left-1/2 top-15 font-900"
      style="transform: translateX(-50%)"
    >
      N
    </div>
    <div style="backdrop-filter: blur(50px)">
      <template v-for="item in formKeys">
        <div
          :class="[
            item.key == 'code' ? 'flex justify-between items-center' : '',
          ]"
        >
          <SpeInput
            :value="form[item.key]"
            :placeholder="item.placeholder"
            @update:value="(val) => (form[item.key] = val)"
            class="mb-5"
            :password="item.key == 'password' || item.key == 'rePassword'"
            :maxlength="item.key != 'code' ? 25 : 6"
          />
          <button
            v-if="item.key == 'code'"
            :disabled="codeBtnContent != '发送验证码'"
            @click="sendCode"
            class="absolute b-0 -right-2 bg-#29c4ca px-3 py-1 w-fit b-rounded-1 text-white mb-6"
          >
            {{
              typeof codeBtnContent == "number"
                ? codeBtnContent + " 秒"
                : codeBtnContent
            }}
          </button>
        </div>
      </template>
    </div>

    <div
      class="relative top-20 w-2/5 px-4 py-3 b-rounded-2 text-xl bg-teal-400 text-center text-white font-bold"
      style="letter-spacing: 5px"
      @click="register"
    >
      注册
    </div>
  </div>
</template>
