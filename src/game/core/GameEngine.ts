import { Clock, Color, PerspectiveCamera, Scene, WebGLRenderer, Vector3, AmbientLight, DirectionalLight, Group } from 'three'
import type { GameMode, SceneKey, CharacterKey, UpdateContext } from '../types'
import { Character } from './Character'
import { KeyboardInput } from './KeyboardInput'
import { createCharacter } from './CharacterFactory'
import { AIController } from './AIController'
import { createSceneGroup } from './SceneFactory'

export interface EngineOptions {
  container: HTMLElement
  mode: GameMode
  sceneKey: SceneKey
  player1: CharacterKey
  player2?: CharacterKey
}

function createDefaultStats() {
  return {
    maxHp: 100,
    hp: 100,
    attack: 10,
    defense: 2,
    moveSpeed: 0.12,
    jumpPower: 4.5,
    specialCharge: 0,
    specialChargeMax: 100,
  }
}

export class GameEngine {
  private renderer: WebGLRenderer
  private scene: Scene
  private camera: PerspectiveCamera
  private clock: Clock
  private container: HTMLElement

  private player1!: Character
  private player2?: Character
  private p1Input?: KeyboardInput
  private p2Input?: KeyboardInput
  private ai?: AIController
  private sceneGroup?: Group
  private running = false
  private lastTime = 0

  constructor(private readonly opts: EngineOptions) {
    this.container = opts.container

    this.renderer = new WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.renderer.setClearColor(new Color('#202124'))
    this.container.appendChild(this.renderer.domElement)

    this.scene = new Scene()
    this.camera = new PerspectiveCamera(60, this.aspect, 0.1, 1000)
    this.camera.position.set(0, 6, 12)
    this.camera.lookAt(0, 0, 0)
    this.clock = new Clock()

    // 场景
    this.sceneGroup = createSceneGroup(opts.sceneKey)
    this.scene.add(this.sceneGroup)

    const amb = new AmbientLight(0xffffff, 0.6)
    this.scene.add(amb)
    const dir = new DirectionalLight(0xffffff, 1)
    dir.position.set(5, 10, 7)
    this.scene.add(dir)

    this.setupPlayers()

    window.addEventListener('resize', this.onResize)
  }

  private get aspect() {
    return this.container.clientWidth / this.container.clientHeight
  }

  private setupPlayers() {
    this.player1 = createCharacter(this.opts.player1, 1, new Vector3(-2, 0, 0))
    this.scene.add(this.player1.object)
    const p2Key = this.opts.mode === 'pvp' ? (this.opts.player2 || 'knight') : 'cpu'
    this.player2 = createCharacter(p2Key, 2, new Vector3(2, 0, 0))
    this.player2.facing = -1
    this.player2.object.scale.x = -1
    this.scene.add(this.player2.object)

    // 输入
    this.p1Input = new KeyboardInput({
      ArrowLeft: 'moveLeft',
      ArrowRight: 'moveRight',
      Space: 'jump',
      KeyJ: 'light',
      KeyK: 'heavy',
      KeyU: 'skill',
      KeyI: 'ultimate',
    })
    this.p1Input.bind()

    if (this.opts.mode === 'pvp') {
      this.p2Input = new KeyboardInput({
        KeyA: 'moveLeft',
        KeyD: 'moveRight',
        KeyW: 'jump',
        KeyF: 'light',
        KeyG: 'heavy',
        KeyR: 'skill',
        KeyT: 'ultimate',
      })
      this.p2Input.bind()
    } else {
      this.ai = new AIController(this.player2, this.player1)
    }
  }

  public start() {
    if (this.running) return
    this.running = true
    this.lastTime = this.clock.getElapsedTime()
    this.renderer.setAnimationLoop(this.loop)
  }

  public stop() {
    this.running = false
    this.renderer.setAnimationLoop(null)
  }

  public dispose() {
    this.stop()
    window.removeEventListener('resize', this.onResize)
    this.renderer.dispose()
    this.container.removeChild(this.renderer.domElement)
    this.p1Input?.unbind()
    this.p2Input?.unbind()
  }

  private loop = () => {
    const now = this.clock.getElapsedTime()
    const deltaSeconds = Math.min(0.05, now - this.lastTime)
    this.lastTime = now
    this.update({ deltaSeconds })
    this.renderer.render(this.scene, this.camera)
  }

  public update(ctx: UpdateContext) {
    // 输入采样
    if (this.p1Input) this.player1.updateFromInput(this.p1Input.snapshot())
    if (this.opts.mode === 'pvp' && this.p2Input) this.player2?.updateFromInput(this.p2Input.snapshot())
    if (this.opts.mode === 'solo' && this.ai) {
      this.ai.tick(ctx.deltaSeconds)
      this.player2?.updateFromInput(this.ai.snapshot())
    }

    this.player1.tick(ctx)
    this.player2?.tick(ctx)
  }

  private onResize = () => {
    this.camera.aspect = this.aspect
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
  }
}


