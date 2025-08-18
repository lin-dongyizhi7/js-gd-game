<template>
	<div class="home">
		<h1>GD Fight</h1>
		<div class="section">
			<h2>选择模式</h2>
			<div class="options">
				<label><input type="radio" value="solo" v-model="mode" /> 单人(人机)</label>
				<label><input type="radio" value="pvp" v-model="mode" /> 双人(PvP)</label>
			</div>
		</div>
		<div class="section">
			<h2>选择场景</h2>
			<select v-model="sceneKey">
				<option v-for="s in scenes" :key="s.key" :value="s.key">{{ s.name }}</option>
			</select>
		</div>
		<div class="section">
			<h2>选择角色</h2>
			<div class="chars">
				<div class="char" v-for="c in characters" :key="c.key">
					<label>
						<input type="radio" :value="c.key" v-model="p1" /> P1: {{ c.name }}
					</label>
					<label v-if="mode==='pvp'">
						<input type="radio" :value="c.key" v-model="p2" /> P2: {{ c.name }}
					</label>
				</div>
			</div>
		</div>
		<div class="actions">
			<button @click="startGame">开始游戏</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const mode = ref<'solo' | 'pvp'>('solo')
const scenes = [
	{ key: 'dojo', name: '道场' },
	{ key: 'city', name: '城市屋顶' },
	{ key: 'forest', name: '森林平台' },
]
const sceneKey = ref('dojo')

const characters = [
	{ key: 'ninja', name: '忍者' },
	{ key: 'knight', name: '骑士' },
	{ key: 'mage', name: '法师' },
]
const p1 = ref('ninja')
const p2 = ref('knight')

function startGame() {
	router.push({
		name: 'game',
		query: {
			mode: mode.value,
			scene: sceneKey.value,
			p1: p1.value,
			p2: mode.value === 'pvp' ? p2.value : 'ai',
		},
	})
}
</script>

<style scoped>
.home { padding: 24px; }
.section { margin-bottom: 16px; }
.options { display: flex; gap: 16px; }
.chars { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.char { background: rgba(255,255,255,0.06); padding: 8px; border-radius: 6px; }
.actions { margin-top: 16px; }
</style>


