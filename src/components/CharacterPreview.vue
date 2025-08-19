<template>
	<div class="preview3d" ref="container"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { AmbientLight, BoxGeometry, DirectionalLight, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MMDLoader } from 'three-mmd-loader'

interface CharacterData {
  model: string
  model2?: string
  transform_duration?: number
  current_form?: 'form1' | 'form2'
}

const props = defineProps<{ model?: string | null, name: string, characterData?: CharacterData }>()

const container = ref<HTMLDivElement | null>(null)
let renderer: WebGLRenderer | null = null
let scene: Scene | null = null
let camera: PerspectiveCamera | null = null
let placeholderCube: Mesh | null = null
let currentModel: any = null
let currentMMDModel: any = null
let mounted = false
let lockedHeight = 0
let transformTimer: number | null = null
let isTransformed = false

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

	// 添加占位立方体
	placeholderCube = new Mesh(
		new BoxGeometry(1, 1.2, 0.6),
		new MeshStandardMaterial({ color: 0x6bc1ff, transparent: true, opacity: 0.8 })
	)
	scene.add(placeholderCube)

	// 如果有模型路径，尝试加载
	if (props.model) {
		tryLoadModel(props.model)
	}

	window.addEventListener('resize', onResize)
	animate()
}

function tryLoadModel(url: string) {
	if (!scene) return

	// 清除之前的模型
	if (currentModel) {
		scene.remove(currentModel)
		currentModel = null
	}
	if (currentMMDModel) {
		scene.remove(currentMMDModel)
		currentMMDModel = null
	}

	// 隐藏占位立方体
	if (placeholderCube) {
		placeholderCube.visible = false
	}

	// 检查文件类型
	if (url.endsWith('.pmd') || url.endsWith('.pmx')) {
		// 加载MMD模型
		loadMMDModel(url)
	} else {
		// 加载普通glTF模型
		loadGLTFModel(url)
	}
}

// 加载MMD模型
function loadMMDModel(url: string) {
	const loader = new MMDLoader()
	loader.load(
		url,
		(object: any) => {
			if (!scene) return

			currentMMDModel = object.mesh
			currentMMDModel.position.set(0, 0, 0)
			scene.add(currentMMDModel)

			console.log('MMD model loaded successfully:', url)
		},
		(progress: any) => {
			console.log('Loading MMD model:', progress)
		},
		(error: any) => {
			console.error('Failed to load MMD model:', error)
			if (placeholderCube) {
				placeholderCube.visible = true
			}
		}
	)
}

// 加载GLTF模型
function loadGLTFModel(url: string) {
	const loader = new GLTFLoader()
	loader.load(
		url,
		(gltf) => {
			if (!scene) return
			currentModel = gltf.scene
			currentModel.position.set(0, 0, 0)
			scene.add(currentModel)
			console.log('GLTF model loaded successfully:', url)
		},
		(error) => {
			console.error('Failed to load GLTF model:', error)
			if (placeholderCube) {
				placeholderCube.visible = true
			}
		}
	)
}

// 触发形态转换（开大后）
function triggerTransform() {
	if (!props.characterData?.model2 || isTransformed) return

	isTransformed = true
	console.log('Character transformed to form 2!')

	// 加载第二形态模型
	tryLoadModel(props.characterData.model2)

	// 设置定时器，在指定时间后恢复第一形态
	if (props.characterData.transform_duration) {
		transformTimer = window.setTimeout(() => {
			isTransformed = false
			console.log('Character returned to form 1!')

			// 恢复第一形态模型
			if (props.characterData?.model) {
				tryLoadModel(props.characterData.model)
			}
		}, props.characterData.transform_duration * 1000)
	}
}

// 切换形态（技能触发，如芙宁娜）
function toggleForm() {
	if (!props.characterData?.model2) return

	if (isTransformed) {
		// 切换到第一形态
		isTransformed = false
		console.log('Character switched to form 1!')
		if (props.characterData?.model) {
			tryLoadModel(props.characterData.model)
		}
	} else {
		// 切换到第二形态
		isTransformed = true
		console.log('Character switched to form 2!')
		tryLoadModel(props.characterData.model2)
	}
}

// 强制设置形态
function setForm(form: 'form1' | 'form2') {
	if (!props.characterData) return

	if (form === 'form1') {
		isTransformed = false
		if (props.characterData.model) {
			tryLoadModel(props.characterData.model)
		}
	} else if (form === 'form2' && props.characterData.model2) {
		isTransformed = true
		tryLoadModel(props.characterData.model2)
	}
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

	// 旋转占位立方体
	if (placeholderCube && placeholderCube.visible) {
		placeholderCube.rotation.y += 0.01
		placeholderCube.rotation.x += 0.004
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

	// 清理定时器
	if (transformTimer) {
		clearTimeout(transformTimer)
		transformTimer = null
	}

	if (renderer) {
		renderer.dispose()
		if (renderer.domElement.parentElement) {
			renderer.domElement.parentElement.removeChild(renderer.domElement)
		}
		renderer = null
	}

	if (scene) {
		scene.traverse((obj: any) => {
			if (obj.isMesh) {
				obj.geometry?.dispose?.()
				obj.material?.dispose?.()
			}
		})
		scene = null
	}

	camera = null
	placeholderCube = null
	currentModel = null
	currentMMDModel = null
})

watch(() => props.model, (newModel, oldModel) => {
	if (newModel && scene && newModel !== oldModel) {
		tryLoadModel(newModel)
	} else if (!newModel && placeholderCube && scene) {
		// 如果没有模型，显示占位立方体
		if (currentModel) {
			scene.remove(currentModel)
			currentModel = null
		}
		if (currentMMDModel) {
			scene.remove(currentMMDModel)
			currentMMDModel = null
		}
		placeholderCube.visible = true
	}
})

// 暴露形态转换方法给父组件
defineExpose({
	triggerTransform,  // 开大后自动切换（如黄泉）
	toggleForm,        // 技能切换形态（如芙宁娜）
	setForm,           // 强制设置形态
	getCurrentForm: () => isTransformed ? 'form2' : 'form1'  // 获取当前形态
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


