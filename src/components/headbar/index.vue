<script setup lang="ts">
import { useRouter } from "vue-router";
import type { ShareSheetOptions, ShareSheetOption } from "vant";
const router = useRouter();
const props = defineProps<{
  title?: string;
  share?: boolean;
  ShareOptions?: ShareSheetOptions;
  defaultBack?: boolean;
}>();
const emits = defineEmits<{
  onBack: [];
}>();
const goBack = () => {
  emits("onBack");
  if (props.defaultBack) {
    router.back();
  }
};
const showShare = ref(false);
const openShareSheet = () => {};
const onSelect = (option: ShareSheetOption, index: number): void => {};
</script>

<template>
  <div class="w-full h-1/14 flex justify-between items-center">
    <van-icon name="arrow-left" @click="goBack" size="25" class="ml-4" />
    <!-- <i i-tabler:arrow-badge-left @click="goBack"></i> -->
    <div>
      <span v-if="title">{{ title }}</span>
    </div>
    <div class="mr-4">
      <i v-if="share" i-tabler-share @click="openShareSheet"></i>
      <van-share-sheet
        v-if="share"
        v-model:show="showShare"
        title="分享给其他人"
        teleport="body"
        :options="ShareOptions"
        @select="onSelect"
      />
    </div>
  </div>
</template>

<style scoped></style>
