<template>
	<div class="preview3d" ref="container"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { AmbientLight, DirectionalLight, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const props = defineProps<{ model?: string | null, name: string }>()

const container = ref<HTMLDivElement | null>(null)
let renderer: WebGLRenderer | null = null
let scene: Scene | null = null
let camera: PerspectiveCamera | null = null
let mounted = false
let lockedHeight = 0

function setupScene() {
	if (!container.value) return
	lockedHeight = container.value.clientHeight
	renderer = new WebGLRenderer({ antialias: true, alpha: true })
	renderer.setSize(container.value.clientWidth, lockedHeight)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	container.value.appendChild(renderer.domElement)

	scene = new Scene()
	// 透明背景以显示默认背景图
	scene.background = null

	camera = new PerspectiveCamera(60, container.value.clientWidth / lockedHeight, 0.1, 100)
	camera.position.set(0, 1.2, 3)

	const amb = new AmbientLight(0xffffff, 0.8)
	scene.add(amb)
	const dir = new DirectionalLight(0xffffff, 1)
	dir.position.set(2, 3, 2)
	scene.add(dir)

	if (props.model) {
		tryLoadModel(props.model)
	}

	window.addEventListener('resize', onResize)
	animate()
}

function tryLoadModel(url: string) {
	if (!scene) return
	const loader = new GLTFLoader()
	loader.load(url, (gltf) => {
		if (!scene) return
		// 加载模型到场景
		const model = gltf.scene
		model.position.set(0, 0, 0)
		scene.add(model)
	}, () => {}, () => {
		// 加载失败则保留默认背景
	})
}

function onResize() {
	if (!container.value || !renderer || !camera) return
	// 仅根据宽度自适应，高度保持初始化时的锁定值
	renderer.setSize(container.value.clientWidth, lockedHeight)
	camera.aspect = container.value.clientWidth / lockedHeight
	camera.updateProjectionMatrix()
}

function animate() {
	if (!mounted || !renderer || !scene || !camera) return
	renderer.render(scene, camera)
	requestAnimationFrame(animate)
}

onMounted(() => {
	mounted = true
	setupScene()
})

onBeforeUnmount(() => {
	mounted = false
	window.removeEventListener('resize', onResize)
	if (renderer) { renderer.dispose(); if (renderer.domElement.parentElement) renderer.domElement.parentElement.removeChild(renderer.domElement); renderer = null }
	if (scene) { scene.traverse((obj: any) => { if (obj.isMesh) { obj.geometry?.dispose?.(); obj.material?.dispose?.() } }); scene = null }
	camera = null
})

watch(() => props.model, (m) => {
	if (m && scene) tryLoadModel(m)
})
</script>

<style scoped lang="less">
.preview3d {
	height: 100%;
	width: 100%;
	border-radius: 8px;
	overflow: hidden;
	background: #0a0d18 url('/pixel-space.png') center/cover no-repeat;
}
</style>


