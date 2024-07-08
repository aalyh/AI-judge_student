<script setup lang="ts">
  import { Vue3SeamlessScroll } from 'vue3-seamless-scroll';
  import { ref, watch } from 'vue';
  import { HttpResponse } from '@/utils/request';
  import { ListResponse } from '@/api/types';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';

  const props = defineProps<{
    title: string;
    columns: { name: string; dataIndex: string }[];
    fullScreenDom?: HTMLElement;
    loadApi: (...args: any[]) => Promise<HttpResponse<ListResponse<any>>>;
    requestParams: Record<string, any>;
    formart?: (...args: any[]) => any;
  }>();
  const { loading, setLoading } = useLoading(true);
  const dataSource = ref<any[]>([]);
  watch(
    () => props.loadApi,
    (fn) => {
      if (fn) {
        const { formart } = props;
        fn(props.requestParams)
          .then((res) => {
            const { list, total } = res.data;
            if (formart) {
              list.forEach((item) => {
                formart(item);
              });
            }
            dataSource.value = list ?? [];

            if (!dataSource.value.length) {
              Message.warning(`${props.title} 暂无数据`);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    { immediate: true },
  );
</script>

<template>
  <a-spin
    class="wh-full"
    :loading="loading"
    :size="20"
    dot
    tip="数据加载中"
  >
    <div class="wh-full flex flex-col items-center justify-start">
      <div class="text-white text-lg font-bold">{{ title }}</div>
      <div class="mt-2 flex items-center w-1/1 px-2 justify-center">
        <span
          v-for="(item, index) in columns"
          :key="index"
          class="text-[#32D8D8] flex-1 text-center"
          >{{ item.name }}</span
        >
      </div>
      <div
        v-if="!loading && dataSource && dataSource.length"
        class="w-full py-2"
      >
        <vue3-seamless-scroll
          :list="dataSource"
          direction="up"
          :hover="true"
          :limit-scroll-num="10"
          :step="0.3"
          class="overflow-hidden w-1/1"
        >
          <div
            v-for="item in dataSource"
            :key="item.id"
            class="w-1/1 flex items-center justify-center px-2 cursor-pointer"
            hover="bg-[#d4e5ed4a]"
          >
            <span
              v-for="(t, index) in columns"
              :key="item.id + '' + index"
              :style="{
                width: `calc(100% / ${columns.length})`,
              }"
              class="text-white text-center mt-1"
            >
              <span v-if="!Array.isArray(item[t.dataIndex])">{{ item[t.dataIndex] }}</span>
              <!--挂载点修改为被全屏的元素, 但是不知道为什么不生效-->
              <a-popover
                v-else
                trigger="hover"
              >
                <div>{{ item[t.dataIndex][0] }}</div>
                <template #content>
                  {{ item[t.dataIndex].join(', ') }}
                </template>
              </a-popover>
            </span>
          </div>
        </vue3-seamless-scroll>
      </div>
      <div
        v-else-if="!loading"
        class="wh-full flex items-center justify-center text-white font-bold text-2xl"
      >
        暂无数据
      </div>
    </div>
  </a-spin>
</template>
