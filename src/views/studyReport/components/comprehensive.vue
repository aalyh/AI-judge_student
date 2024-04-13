<script setup lang="ts">
import { ref } from "vue";
const activeName = ref("b");
</script>
<template>
  <div class="container">
    <div class="bg-white h-15vh w-full my-5 border-rd-14px p-4 box-border">
      <van-row>
        <van-col span="24">理综/文综</van-col>
      </van-row>
      <van-row>
        <van-col span="12" style="line-height: 3.5rem"
          ><span class="text-size-13">126</span><span>分</span></van-col
        >
        <van-col span="12" style="line-height: 4.5rem" class="text-#979797"
          ><span>满分150分</span></van-col
        >
      </van-row>
    </div>
    <div class="bg-white h-60vh w-full my-5 border-rd-14px p-4 box-border">
      <van-row>
        <van-col span="24">历次成绩变化</van-col>
      </van-row>
      <van-row>
        <van-col span="8">
          <van-tabs v-model:active="activeName">
            <van-tab title="班级排名" name="a">班级排名</van-tab>
            <!-- <van-tab title="年级排名" name="b">年级paim</van-tab> -->
          </van-tabs>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<style></style>
