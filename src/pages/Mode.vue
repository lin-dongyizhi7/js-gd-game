<template>
  <div class="mode-page">
    <div class="panel">
      <h2>选择游戏模式</h2>
      <div class="btns">
        <button class="big" @click="go('solo')">单人游戏</button>
        <button class="big" @click="go('pvp')">多人游戏</button>
      </div>
      <button class="link" @click="back">返回</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
function go(mode: "solo" | "pvp") {
  router.push({ name: "select", query: { mode } });
}
function back() {
  router.push({ name: "home" });
}
</script>

<style scoped lang="less">
.mode-page {
  height: 100%;
  width: 100%;
  background: url("/pixel-space.png") center/cover no-repeat fixed #000;
  display: grid;
  place-items: center;
}

.panel {
  text-align: center;
  background: rgba(0, 0, 0, 0.35);
  padding: 24px 32px;
  border-radius: 12px;
}

.btns {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin: 16px 0;
}

.big {
  font-size: 18px;
  padding: 14px 22px;
  border-radius: 10px;
  border: none;
  background: #7ccfff;
  color: #06111b;
}

.link {
  margin-top: 8px;
  background: transparent;
  color: #cde7ff;
  border: none;
  text-decoration: underline;
  cursor: pointer;
}
</style>
