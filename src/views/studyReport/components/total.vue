<script setup lang="ts">
import { ref } from "vue";
const activeName = ref("b");
</script>
<template>
  <div class="container">
    <div class="bg-white h-30vh w-full my-5 border-rd-14px p-4 box-border">
      <van-row>
        <van-col span="24">全科总分</van-col>
      </van-row>
      <van-row style="border-bottom: 1px solid #111">
        <van-col span="12" style="line-height: 3.5rem"
          ><span class="text-size-13">700</span><span>分</span></van-col
        >
        <van-col span="12" style="line-height: 4.5rem" class="text-#979797"
          ><span>满分750分</span></van-col
        >
      </van-row>
      <van-row class="text-center text-#979797 my-2">
        <van-col span="12">语文：126/150</van-col>
        <van-col span="12">数学：126/150</van-col>
      </van-row>
      <van-row class="text-center text-#979797 my-2">
        <van-col span="12">英语：126/150</van-col>
        <van-col span="12">理综：126/150</van-col>
      </van-row>
      <van-row class="text-center text-#979797 my-2">
        <van-col span="12">物理：126/150</van-col>
        <van-col span="12">化学：126/150</van-col>
      </van-row>
      <van-row class="text-center text-#979797 my-2">
        <van-col span="12">生物：126/150</van-col>
      </van-row>
    </div>
    <div class="bg-white h-50vh w-full my-5 border-rd-14px p-4 box-border">
      <van-row>
        <van-col span="24">历次成绩变化</van-col>
      </van-row>
      <van-row>
        <van-col span="8">
          <van-tabs v-model:active="activeName">
            <van-tab title="班级排名" name="a">班级排名</van-tab>
            <van-tab title="年级排名" name="b">年级paim</van-tab>
          </van-tabs>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<style></style>
