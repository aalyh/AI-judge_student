<script setup lang="ts">
import { router } from "@/router/index";

function intoStudyReport() {
  router.push("/studyReport");
}
</script>

<template>
  <div
    id="home"
    class="w-full h-full"
    style="background: rgba(232, 255, 234, 0.29)"
  >
    <header
      class="h-8rem bg-pink w-full bg-cover"
      style="
        background-image: url(&quot;https://sulli-k.oss-cn-chengdu.aliyuncs.com/images/20240329092700.png&quot;);
      "
    ></header>
    <nav class="h-5rem bg-white w-full flex text-xl" style="color: #3d3d3d">
      <div
        class="h-50% w-50vw my-4"
        style="text-align: center; border-right: 1px solid #d8d8d8"
      >
        <span class="tabler:align-box-center-middle" text=" xl"></span>
        我的课程
      </div>
      <div class="h-50% w-50vw my-4" style="text-align: center">成绩查询</div>
    </nav>
    <div id="body" class="p-4" style="box-sizing: border-box">
      <div
        id="contain"
        class="bg-white w-full h-34rem border-rd-14px p-4"
        style="box-sizing: border-box"
      >
        <div id="title" class="m-0 text-1.8rem font-thin text-center">
          最新学情
        </div>
        <div id="card_container" class="h-50vh flex flex-col justify-start">
          <div
            id="card"
            class="w-full h-15rem bg-[rgba(232,255,234,0.47)] border-rd-14px my-5 p-5 text-center"
            style="box-sizing: border-box"
          >
            <p class="text-1.2rem">
              泸州高中2021届高三第二学期第15周考（2021年5月15-21日）
            </p>
            <p>2021.06.01</p>
            <div
              class="w-full h-3.1rem bg-#12D2AC border-rd-14px text-light-100 border-#12D2AC"
              style="line-height: 3.1rem"
              @click="intoStudyReport"
            >
              学情报告
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

