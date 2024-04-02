<script setup lang="ts">
import { showFailToast, showSuccessToast, showToast } from "vant";
import { debounce } from "@/utils/fluentCtrl/index";
import { filterCN } from "@/filter/input";
import { sendCodeAPI, retrievePwdAPI } from "@/api/user";
import { mailReg } from "@/utils/regExp";
import { RegisterFormType } from "@/types/user";
interface loginForm {
  name: string | number;
  password: string;
}
interface changePwdFormTip {
  icon: string;
  placeholder: string;
}
const loginForm: loginForm = reactive({
  name: "",
  password: "",
});
const emits = defineEmits<{
  (e: "onLogin", arg1: loginForm): void;
}>();
const login = debounce((): void => {
  if (!loginForm.name || !loginForm.password) {
    showFailToast("请输入账号密码");
    return;
  }
  emits("onLogin", loginForm);
});
const updateForm = debounce((e: InputEvent, key: "name" | "password") => {
  loginForm[key] = (e.target as HTMLInputElement).value;
});

const isLogin = ref(true);
function exchangeForm() {
  if (isLogin.value) {
    setTimeout(() => {
      loginForm.name = "";
      loginForm.password = "";
    }, 400);
  } else {
    setTimeout(() => {
      Object.keys(changePwdForm).forEach((key) => (changePwdForm[key] = ""));
      codeBtnContent.value = "发送验证码";
    }, 300 + 500);
  }
  isLogin.value = !isLogin.value;
}

const changePwdForm: RegisterFormType = reactive({
  userName: "",
  password: "",
  rePassword: "",
  mail: "",
  code: "",
});
const changePwdFormTips: changePwdFormTip[] = [
  { icon: "contact-o", placeholder: "请输入账号" },
  { icon: "bag-o", placeholder: "请设置新密码" },
  { icon: "bag-o", placeholder: "再次确认密码" },
  { icon: "envelop-o", placeholder: "请输入QQ邮箱" },
  { icon: "completed-o", placeholder: "请输入验证码" },
];

const codeBtnContent = ref<string | number>("发送验证码");
const sendCode = debounce((): void => {
  if (mailReg.test(changePwdForm.mail)) {
    sendCodeAPI(changePwdForm.mail).then(({ code }) => {
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

const changePwd = () => {
  if (Object.values(changePwdForm).some((v) => !v)) {
    showFailToast("有数据尚未填写");
    return;
  }
  if (changePwdForm.password != changePwdForm.rePassword) {
    showFailToast("密码不一致");
    return;
  }
  retrievePwdAPI(changePwdForm).then(({ code }) => {
    if (code == 200) {
      showSuccessToast("修改成功");
      setTimeout(() => {
        exchangeForm();
      }, 450);
    }
  });
};
const updateChangePwdForm = debounce(
  (e: InputEvent, key: keyof RegisterFormType) => {
    changePwdForm[key] = (e.target as HTMLInputElement).value;
  },
);
</script>

<template>
  <div class="flex flex-col justify-between">
    <div class="text-teal-300 text-9xl h-1/4 relative font-900">N</div>
    <div class="w-full bg-teal-300 relative h-full">
      <transition name="login" mode="in-out">
        <div
          v-show="isLogin"
          style="transform: translateX(-50%)"
          class="flex flex-col justify-between items-center left-1/2 absolute top-30"
        >
          <ul>
            <li class="mb-8">
              <label for="username"
                ><van-icon name="contact-o" size="1.2em"
              /></label>
              <input
                type="text"
                name="username"
                class="loginInput"
                placeholder="请输入账号"
                :maxlength="25"
                :value="loginForm.name"
                @input.trim="(e) => updateForm(e as InputEvent, 'name')"
                @keyup="filterCN"
              />
            </li>
            <li>
              <label for="password"
                ><van-icon name="bag-o" size="1.2em"
              /></label>
              <input
                type="text"
                name="password"
                class="loginInput"
                placeholder="请输入密码"
                :value="loginForm.password"
                :maxlength="25"
                @input.trim="(e) => updateForm(e as InputEvent, 'password')"
                @keyup="filterCN"
              />
            </li>
          </ul>
          <span
            class="font-900 text-white relative top-6 left-20"
            @click="exchangeForm"
            >忘记密码 ?</span
          >
          <div
            class="text-teal-400 font-bold text-xl w-1/1 relative top-40 text-center b-rounded-2 py-3 bg-white"
            @click="login"
          >
            登录
          </div>
        </div>
      </transition>
      <transition name="forget" mode="in-out">
        <div
          v-show="!isLogin"
          class="flex flex-col justify-between items-center relative top-20"
        >
          <ul>
            <li
              v-for="(_, key, index) in changePwdForm"
              :key="key"
              class="mb-3"
            >
              <label for="password"
                ><van-icon :name="changePwdFormTips[index].icon" size="1.2em" />
              </label>
              <input
                :type="
                  ['password', 'rePassword'].includes(key as string)
                    ? 'password'
                    : 'text'
                "
                name="password"
                class="loginInput"
                :value="changePwdForm[key]"
                :maxlength="key === 'code' ? 6 : 25"
                :placeholder="changePwdFormTips[index].placeholder"
                @input.trim="(e) => updateChangePwdForm(e as InputEvent, key)"
                @keyup="filterCN"
              />
              <button
                v-if="key == 'code'"
                :disabled="codeBtnContent != '发送验证码'"
                @click="sendCode"
                class="absolute b-0 right-20 translate-y-1/5 bg-#29c4ca px-2 py-1 text-sm w-fit b-rounded-1 text-white"
              >
                {{
                  typeof codeBtnContent == "number"
                    ? codeBtnContent + " 秒"
                    : codeBtnContent
                }}
              </button>
            </li>
          </ul>
          <div
            class="text-teal-400 font-bold text-lg w-2/3 relative top-10 text-center b-rounded-2 py-3 bg-white"
            @click="changePwd"
          >
            修改密码
          </div>
          <div
            class="text-teal-500 p-4 b-rounded-1/2 bg-white relative top-18"
            @click="exchangeForm"
          >
            <van-icon name="revoke" size="1.6em" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.loginInput {
  border: 0;
  border-radius: 10px;
  padding: 0.5rem 2rem;
  font-weight: bolder;
  color: rgb(191, 191, 191);
}
.loginInput:focus {
  color: gray;
}
label {
  position: absolute;
  color: gray;
  font-weight: bolder;
  padding: 0.5rem;
}
.login-enter-active {
  transition-delay: 0.5s;
}
.login-leave-active {
  transition-duration: 0.4s;
}
.login-enter-from,
.login-leave-to {
  opacity: 0;
  transform: translateX(-15%) scale(0.9);
}

.forget-enter-active {
  transition-delay: 0.5s;
}
.forget-leave-active {
  transition-duration: 0.4s;
}
.forget-enter-from,
.forget-leave-to {
  opacity: 0;
  transform: translateX(15%) scale(0.9);
}
</style>
