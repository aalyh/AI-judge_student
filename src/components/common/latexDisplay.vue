<template>
  <span
    ref="latex"
    class="katex"
    v-html="rawHTML"
    style="font-size: 14px"
  ></span>
</template>

<script setup lang="ts">
import katex from "katex";
import "katex/dist/katex.css";

const props = defineProps<{
  problem: string;
}>();
let rawHTML = ref("");

function format() {
  rawHTML.value = props.problem.replace(/\$/g, "");
  console.log(rawHTML.value);
  rawHTML.value = katex.renderToString(props.problem.replace(/\$/g, ""), {
    throwOnError: false,
  });
}
format();
</script>

<style></style>
