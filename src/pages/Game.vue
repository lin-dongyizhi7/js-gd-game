<!--
 * @Author: 凛冬已至 2985956026@qq.com
 * @Date: 2025-08-18 16:53:29
 * @LastEditors: 凛冬已至 2985956026@qq.com
 * @LastEditTime: 2025-08-18 17:47:23
 * @FilePath: \js-gd-game\src\pages\Game.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="game-page">
    <div class="toolbar">
      <button @click="goHome">返回</button>
      <div>模式: {{ mode }}｜场景: {{ sceneKey }}｜P1: {{ p1 }}｜P2: {{ p2 }}</div>
    </div>
    <div ref="containerRef" class="viewport"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { GameEngine } from "@/game/core/GameEngine";
import type { GameMode, SceneKey, CharacterKey } from "@/game/types";

const route = useRoute();
const router = useRouter();

const mode = (route.query.mode as GameMode) || "solo";
const sceneKey = (route.query.scene as SceneKey) || "dojo";
const p1 = (route.query.p1 as CharacterKey) || "ninja";
const p2 = (route.query.p2 as CharacterKey) || "cpu";

const containerRef = ref<HTMLDivElement | null>(null);
let engine: GameEngine | null = null;

function goHome() {
  router.push({ name: "home" });
}

onMounted(() => {
  if (!containerRef.value) return;
  engine = new GameEngine({
    container: containerRef.value,
    mode,
    sceneKey,
    player1: p1,
    player2: p2,
  });
  engine.start();
});

onBeforeUnmount(() => {
  engine?.dispose();
});
</script>

<style scoped>
.game-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.toolbar {
  padding: 8px 12px;
  display: flex;
  gap: 12px;
  align-items: center;
  background: rgba(255, 255, 255, 0.06);
}
.viewport {
  flex: 1;
}
</style>
