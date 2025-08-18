import type { InputState } from '../types'

type KeyAction = keyof InputState | 'moveLeft' | 'moveRight'

export class KeyboardInput {
  private state: InputState
  private readonly keyMap: Record<string, KeyAction>

  constructor(customKeyMap?: Partial<Record<string, KeyAction>>) {
    this.state = {
      moveX: 0,
      jump: false,
      light: false,
      heavy: false,
      skill: false,
      ultimate: false,
    }
    this.keyMap = {
      ArrowLeft: 'moveLeft',
      ArrowRight: 'moveRight',
      Space: 'jump',
      KeyJ: 'light',
      KeyK: 'heavy',
      KeyU: 'skill',
      KeyI: 'ultimate',
      ...customKeyMap,
    }
  }

  public bind() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  }

  public unbind() {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
  }

  public snapshot(): InputState {
    return { ...this.state }
  }

  private onKeyDown = (e: KeyboardEvent) => {
    const mapped = this.keyMap[e.code]
    if (!mapped) return
    if (mapped === 'moveLeft') {
      this.state.moveX = -1
      return
    }
    if (mapped === 'moveRight') {
      this.state.moveX = 1
      return
    }
    ;(this.state as any)[mapped] = true
  }

  private onKeyUp = (e: KeyboardEvent) => {
    const mapped = this.keyMap[e.code]
    if (!mapped) return
    if (mapped === 'moveLeft' && this.state.moveX < 0) {
      this.state.moveX = 0
      return
    }
    if (mapped === 'moveRight' && this.state.moveX > 0) {
      this.state.moveX = 0
      return
    }
    ;(this.state as any)[mapped] = false
  }
}


