<script setup lang="ts"></script>

<template>
  <div style="width: 100vw; height: 100vh; overflow-y: auto">
    <router-view v-slot="{ Component }">
      <transition name="switchPage">
        <keep-alive :include="['layout']">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
  <van-number-keyboard safe-area-inset-bottom />
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  list-style: none;
  text-decoration: none;
}
</style>

