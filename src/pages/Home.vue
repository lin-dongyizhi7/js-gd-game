<template>
  <div class="start-page">
    <div class="center">
      <h1>GD Fight</h1>
      <button class="primary" @click="goMode">开始游戏</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
function goMode() {
  router.push({ name: "mode" });
}
</script>

<style scoped lang="less">
.start-page {
  height: 100%;
  width: 100%;
  background: url("/pixel-space.png") center/cover no-repeat fixed #000;
  display: grid;
  place-items: center;
}

.center {
  text-align: center;
  background: rgba(0, 0, 0, 0.35);
  padding: 24px 32px;
  border-radius: 12px;
}

h1 {
  margin: 0 0 16px;
}

.primary {
  font-size: 18px;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: #7ccfff;
  color: #06111b;
}
</style>
