<template>
  <div
    class="userContainer flex-col justify-center items-center w-full h-full bg-[rgba(232,255,234,0.29)] z-0 pt-10 box-border"
  >
    <div class="w-full text-center flex justify-center">
      <div
        class="avator w-30 h-30 border-rd-50% items-center bg-no-repeat"
        :style="{
          backgroundImage: 'url(' + circleUrl + ')',
          backgroundSize: 'cover',
        }"
      ></div>
    </div>
    <div class="msg w-80% p-5 mx-7">
      <!-- <van-row>
        <van-col span="12" offset="6">用户名：{{ userMsg.username }}</van-col>
      </van-row>
      <van-row>
        <van-col span="12" offset="6">姓名：{{ userMsg.nickname }}</van-col>
      </van-row>
      <van-row>
        <van-col span="12" offset="6">邮箱：{{ userMsg.email }}</van-col>
      </van-row> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { getInfoAPI } from "@/api/user";
import { ref } from "vue";
interface User {
  auth: string;
  avatar: string;
  email: string;
  nickname: string;
  username: string;
}
let circleUrl = ref(
  "https://sulli-k.oss-cn-chengdu.aliyuncs.com/images/20240307201531.jpg"
);
const userMsg = ref<User[]>();
async function load() {
  let res = await getInfoAPI();
  userMsg.value = res.data;
  console.log(userMsg.value);
}
load();
</script>
