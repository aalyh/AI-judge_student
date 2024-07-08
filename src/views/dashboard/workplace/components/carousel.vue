<template>
  <a-carousel
    indicator-type="slider"
    show-arrow="hover"
    auto-play
    style="width: 100%; height: 170px; border-radius: 4px; overflow: hidden"
  >
    <a-carousel-item
      v-for="(src, idx) in imageSrc"
      :key="idx"
    >
      <div>
        <img
          :src="src"
          style="width: 100%"
        />
      </div>
    </a-carousel-item>
  </a-carousel>
</template>

<script lang="ts" setup>
  const imageSrc = [
    'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560785477-d43d2b34e0df?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1644055066046-054ac0fc7213?q=80&w=2071&auto=format&fit=crop',
  ];
</script>
