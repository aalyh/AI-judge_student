<script setup lang="ts">
import total from "./components/total.vue";
import math from "./components/math.vue";
import chinese from "./components/chineses.vue";
import english from "./components/english.vue";
import comprehensive from "./components/comprehensive.vue";
const onClickLeft = () => history.back();
let active = ref(0);
</script>

<template>
  <div id="container" class="h-full w-full">
    <header>
      <van-nav-bar
        title="学情报告"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </header>
    <div class="tabs h-[calc(100vh-89px)] bg-[rgba(232,255,234,0.29)] w-full">
      <van-tabs v-model:active="active">
        <van-tab title="总分"> <total></total></van-tab>
        <van-tab title="语文"><chinese></chinese></van-tab>
        <van-tab title="数学"><math></math></van-tab>
        <van-tab title="英语"><english></english></van-tab>
        <van-tab title="理综/文综"><comprehensive></comprehensive></van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<style scoped>
.van-nav-bar {
  --van-nav-bar-height: 89px;
}
</style>
