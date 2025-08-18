<template>
	<div class="preview3d" ref="container"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { AmbientLight, BoxGeometry, Color, DirectionalLight, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const props = defineProps<{ model?: string | null, name: string }>()

const container = ref<HTMLDivElement | null>(null)
let renderer: WebGLRenderer | null = null
let scene: Scene | null = null
let camera: PerspectiveCamera | null = null
let cube: Mesh | null = null
let mounted = false

function setupScene() {
	if (!container.value) return
	renderer = new WebGLRenderer({ antialias: true, alpha: true })
	renderer.setSize(container.value.clientWidth, container.value.clientHeight)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	container.value.appendChild(renderer.domElement)

	scene = new Scene()
	scene.background = new Color(0x000000)

	camera = new PerspectiveCamera(60, container.value.clientWidth / container.value.clientHeight, 0.1, 100)
	camera.position.set(0, 1.2, 3)

	const amb = new AmbientLight(0xffffff, 0.8)
	scene.add(amb)
	const dir = new DirectionalLight(0xffffff, 1)
	dir.position.set(2, 3, 2)
	scene.add(dir)

	// 占位几何体
	cube = new Mesh(new BoxGeometry(1, 1.2, 0.6), new MeshStandardMaterial({ color: 0x6bc1ff }))
	scene.add(cube)

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
		// 替换占位体
		if (cube) { scene.remove(cube); cube.geometry.dispose(); (cube.material as any).dispose?.(); cube = null }
		const model = gltf.scene
		model.position.set(0, 0, 0)
		scene.add(model)
	}, () => {}, () => {
		// 加载失败则保留占位
	})
}

function onResize() {
	if (!container.value || !renderer || !camera) return
	renderer.setSize(container.value.clientWidth, container.value.clientHeight)
	camera.aspect = container.value.clientWidth / container.value.clientHeight
	camera.updateProjectionMatrix()
}

function animate() {
	if (!mounted || !renderer || !scene || !camera) return
	if (cube) {
		cube.rotation.y += 0.01
		cube.rotation.x += 0.004
	}
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

<style scoped>
.preview3d { height: 100%; width: 100%; border-radius: 8px; overflow: hidden; background: radial-gradient(120% 120% at 50% 10%, #141824 0%, #090b12 60%); }
</style>


