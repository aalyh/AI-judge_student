<script setup lang="ts">
import { getAnswersheet } from "@/api/exam";
import { showImagePreview } from "vant";
import latexDisplay from "@/components/common/latexDisplay.vue";
interface Item {
  comment: string;
  id: number;
  problem: string;
  score: number;
  total: number;
  url: string;
}

const route = useRoute();
let id = route.query.id;
const url = ref();
const list = ref<Item[]>();

const onClickLeft = () => history.back();
function onClickRight() {
  showImagePreview({
    images: [url.value],
  });
}

function ansewerSheet(url: string) {
  showImagePreview({
    images: [url],
  });
}

function load() {
  id = JSON.parse(route.query.id as any);
  getAnswersheet(id as number).then((res) => {
    console.log(res, "阅卷结果");
    url.value = res.data.url;
    list.value = res.data.list;
  });
}
load();
</script>

<template>
  <div id="container" class="h-full w-full">
    <header>
      <van-nav-bar
        title="阅卷结果"
        left-text="返回"
        right-text="查看答题卡"
        @click-right="onClickRight"
        left-arrow
        @click-left="onClickLeft"
      />
    </header>
    <div
      class="tabs min-h-[calc(100vh-89px)] bg-[rgba(232,255,234,0.29)] w-full box-border"
    >
      <div
        class="card bg-white w-[calc(100vw-2rem)] min-h-50 mb-4 p-4"
        v-for="item in list"
        :key="item.id"
      >
        <van-row>
          <van-col span="18" style="font-size: 20px">题目</van-col>
          <van-col span="6">分值：{{ item.score }} / {{ item.total }}</van-col>
        </van-row>
        <van-row>
          <van-col span="24">
            <!-- {{ item.problem }} -->
            <latexDisplay :problem="item.problem"></latexDisplay>
          </van-col>
        </van-row>
        <van-row>
          <van-col span="24">教师评语</van-col>
        </van-row>
        <van-row>
          <van-col span="24" style="color: red">
            {{ item.comment || "无" }}
            <!-- <latexDisplay
              :problem="item.comment"
              v-show="item.comment !== ''"
            ></latexDisplay>
            <span v-show="item.comment === ''">无</span> -->
          </van-col>
        </van-row>
        <van-row>
          <van-col span="24"
            ><van-button
              type="primary"
              size="mini"
              @click="ansewerSheet(item.url)"
              >查看答题卡</van-button
            ></van-col
          >
        </van-row>
      </div>
    </div>
  </div>
</template>

<style scoped>
.van-nav-bar {
  --van-nav-bar-height: 89px;
}
</style>
