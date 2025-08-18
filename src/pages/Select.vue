<template>
  <div class="select-page">
    <div class="filters">
      <button :class="{ active: filter === 'all' }" @click="setFilter('all')">全部</button>
      <button :class="{ active: filter === 'genshin' }" @click="setFilter('genshin')">原神</button>
      <button :class="{ active: filter === 'starrail' }" @click="setFilter('starrail')">星穹铁道</button>
    </div>
    <div class="side">
      <h3>{{ leftTitle }}</h3>
      <div class="preview">
        <CharacterPreview :name="leftChoice || '未选择'" :model="getModel(leftChoice)" />
      </div>
      <button class="confirm" :disabled="!leftChoice" @click="leftConfirmed = true">
        确认
      </button>
    </div>
    <div class="grid">
      <div class="card" v-for="r in roles" :key="r.key" @click="pick(r.key)">
        <div class="avatar">
          <img :src="r.avatar" :alt="r.name" @error="onAvatarError($event)" />
        </div>
        <div class="name">{{ r.name }}</div>
      </div>
      <div class="grid-footer">
        <button class="primary" :disabled="!canStart" @click="start">开始战斗</button>
        <button class="link" @click="back">返回</button>
      </div>
    </div>
    <div class="side">
      <h3>{{ rightTitle }}</h3>
      <div class="preview">
        <CharacterPreview :name="rightChoice || '未选择'" :model="getModel(rightChoice)" />
      </div>
      <button class="confirm" :disabled="!rightChoice" @click="rightConfirmed = true">
        确认
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const mode = (route.query.mode as "solo" | "pvp") || "solo";

import { listByGame, findByKey } from '@/game/config'
import type { GameId } from '@/game/config/types'
import CharacterPreview from '@/components/CharacterPreview.vue'

const initialGame = (route.query.game as GameId) || 'all'
const filter = ref<GameId | 'all'>(initialGame)
const roles = computed(() => filter.value === 'all' ? [...listByGame('genshin'), ...listByGame('starrail')] : listByGame(filter.value))

const leftChoice = ref<string>("");
const rightChoice = ref<string>("");
const leftConfirmed = ref(false);
const rightConfirmed = ref(false);

const leftTitle = computed(() => (mode === "pvp" ? "玩家一" : "玩家"));
const rightTitle = computed(() => (mode === "pvp" ? "玩家二" : "AI"));
const canStart = computed(
  () =>
    !!leftChoice.value &&
    !!rightChoice.value &&
    leftConfirmed.value &&
    rightConfirmed.value
);

function pick(key: string) {
  if (!leftConfirmed.value) {
    leftChoice.value = key;
    return;
  }
  if (!rightConfirmed.value) {
    rightChoice.value = key;
    return;
  }
}

function start() {
  router.push({
    name: "game",
    query: {
      mode,
      scene: "dojo",
      p1: leftChoice.value,
      p2: mode === "pvp" ? rightChoice.value : "cpu",
    },
  });
}

function back() {
  router.push({ name: "mode" });
}

function getModel(key: string): string | null {
  return findByKey(key)?.model ?? null
}

function onAvatarError(e: Event) {
  const img = e.target as HTMLImageElement
  img.onerror = null
  img.src = '/avatars/_placeholder.png'
}

function setFilter(g: GameId | 'all') {
  if (filter.value === g) return
  filter.value = g
  leftChoice.value = ''
  rightChoice.value = ''
  leftConfirmed.value = false
  rightConfirmed.value = false
}
</script>

<style scoped lang="less">
.select-page {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 12px;
  padding: 16px;
  align-items: start;
  --panel-height: 600px;
}

.filters {
  grid-column: 1 / -1;
  display: flex;
  gap: 8px;
  justify-content: center;

  button {
    padding: 6px 12px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.2);
    background: rgba(255,255,255,0.06);
    color: #cde7ff;
    cursor: pointer;

    &.active {
      background: #7ccfff;
      color: #06111b;
      border-color: transparent;
    }
  }
}

.side {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 12px;
  height: var(--panel-height);
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 12px;
}

.preview {
  height: auto;
  min-height: 0;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  display: grid;
  place-items: center;
  color: #cde7ff;
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  height: var(--panel-height);
  overflow-y: auto;

  // 隐藏垂直滚动条
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.card {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 12px;
  cursor: pointer;
  text-align: center;
}

.avatar {
  width: 72%;
  margin: 0 auto 8px;
  aspect-ratio: 1 / 1;
  background: #0b1020;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.confirm {
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background: #7ccfff;
  color: #06111b;
}

.grid-footer {
  grid-column: 1 / -1;
  position: sticky;
  bottom: 0;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 8px;
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 10px 8px;

  .primary {
    padding: 10px 16px;
    border-radius: 8px;
    border: none;
    background: #7ccfff;
    color: #06111b;
  }

  .link {
    padding: 10px 16px;
    border-radius: 8px;
    border: none;
    background: #808080;
    color: #ffffff;
  }
}
</style>

