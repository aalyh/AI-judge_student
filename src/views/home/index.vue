<template>
  <div
    id="home"
    class="w-full h-full"
    style="background: rgba(232, 255, 234, 0.29)"
  >
    <transition name="index">
      <div v-show="choice === 1">
        <header
          class="h-10vh bg-pink w-full bg-cover"
          style="
            background-image: url(&quot;https://sulli-k.oss-cn-chengdu.aliyuncs.com/images/20240329092700.png&quot;);
          "
        ></header>
        <nav class="h-10vh bg-white w-full flex text-xl" style="color: #3d3d3d">
          <div
            class="h-50% w-50vw my-4"
            style="text-align: center; border-right: 1px solid #d8d8d8"
          >
            <span class="tabler:align-box-center-middle" text=" xl"></span>
            我的课程
          </div>
          <div class="h-50% w-50vw my-4" style="text-align: center">
            成绩查询
          </div>
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
            <div
              id="card_container"
              class="h-60vh flex flex-col justify-start overflow-scroll"
            >
              <div
                id="card"
                class="w-full h-15rem bg-[rgba(232,255,234,0.47)] border-rd-14px my-5 p-5 text-center"
                style="box-sizing: border-box"
                v-for="item in examList"
                :key="item.id"
              >
                <p class="text-1.2rem">
                  {{ item.name }}
                </p>
                <!-- <p class="text-1.2rem">
                  {{ item.description }}
                </p> -->
                <p>
                  {{ timeFormat(item.time) }}—{{ timeFormat(item.timeLimit) }}
                </p>
                <div
                  class="w-full h-3.1rem bg-#12D2AC border-rd-14px text-light-100 border-#12D2AC"
                  style="line-height: 3.1rem"
                  @click="intoStudyReport(item.id)"
                >
                  学情报告
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { getGroupList } from "@/api/exam";
import timeFormat from "@/utils/common/timeFormat";

interface listType {
  id: number;
  description: string;
  name: string;
  state: number;
  time: number;
  timeLimit: number;
}
type Paging<T extends object = object> = T & {
  page: number;
  pageSize: number;
  key?: string;
};

let choice = ref(1);
const examList = ref<listType[]>();

const router = useRouter();
const pagination = reactive<Paging>({
  page: 1,
  pageSize: 10,
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function intoStudyReport(id: any) {
  router.push({ path: `/studyReport`, query: { id } });
}
async function load() {
  let res = await getGroupList(toRaw(pagination) as Paging<{ key: string }>);
  console.log(res);
  examList.value = res.data.list;
}
onMounted(() => {
  load();
});
</script>

<style>
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
