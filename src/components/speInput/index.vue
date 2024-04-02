<script setup lang="ts">
import { debounce } from "@/utils/fluentCtrl";
import { filterCN } from "@/filter/input";
defineProps<{
  value: string;
  placeholder?: string;
  maxlength?: number;
  password?: boolean;
}>();
const emits = defineEmits<{
  (e: "update:value", value: string): void;
}>();
const onchange = debounce((e: InputEvent) => {
  emits("update:value", (e.target as HTMLInputElement).value);
});
</script>

<template>
  <div class="w-fit">
    <input
      p=" x-4 y-2"
      border=" b-2 gray-300"
      class="b-0 font-bold m-auto w-1/1"
      style="transform: translateX(-1rem)"
      :type="password ? 'password' : 'text'"
      :placeholder="placeholder ?? '请输入内容'"
      :value="value"
      :maxlength="maxlength ?? 25"
      @input.trim="(e: Event) => onchange(e as InputEvent)"
      @keyup="filterCN"
    />
  </div>
</template>

<style scoped></style>
