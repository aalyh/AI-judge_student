<script setup lang="ts">
import comprehensive from "./components/comprehensive.vue";
import total from "./components/total.vue";
import english from "./components/english.vue";
import math from "./components/math.vue";
import chinese from "./components/chineses.vue";
import { useRoute } from "vue-router";
import { getDetailAll } from "@/api/exam";
import { toRef } from "vue";

export interface subject {
  examId: number;
  name: string;
  score: number;
  subjectId: number;
  total: number;
}

const route = useRoute();
const onClickLeft = () => history.back();
let active = ref(0);
let id = route.query.id;
let totalScore = ref();
let subjects = ref<subject[]>();
let mathSub = ref<subject>();
let chineseSub = ref<subject>();
let englishSub = ref<subject>();

async function load() {
  id = JSON.parse(route.query.id as any);
  let res = await getDetailAll(id as number);
  console.log(res);
  subjects.value = res.data.subjects;
  totalScore.value = res.data.total;
  res.data.subjects.forEach((element: subject) => {
    if (element.name === "数学") {
      mathSub = toRef(element);
    } else if (element.name === "语文") {
      chineseSub = toRef(element);
    } else if (element.name === "英语") {
      englishSub = toRef(element);
    }
  });
  console.log(total.value, mathSub.value, chineseSub.value, englishSub.value);
}
load();
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
        <van-tab title="总分"> <total :data="totalScore"></total></van-tab>
        <van-tab title="语文"><chinese :data="chineseSub"></chinese></van-tab>
        <van-tab title="数学"><math :data="mathSub"></math></van-tab>
        <van-tab title="英语"><english :data="englishSub"></english></van-tab>
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
