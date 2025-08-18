import type { InputState } from '../types'
import { Character } from './Character'

export class AIController {
  private state: InputState
  private cooldown = 0

  constructor(private readonly self: Character, private readonly target: Character) {
    this.state = { moveX: 0, jump: false, light: false, heavy: false, skill: false, ultimate: false }
  }

  public tick(deltaSeconds: number) {
    this.cooldown -= deltaSeconds
    // 简易追踪与进攻策略
    const dx = this.target.object.position.x - this.self.object.position.x
    this.state.moveX = Math.abs(dx) > 0.5 ? Math.sign(dx) : 0
    // 面向目标
    if (dx > 0) {
      this.self.facing = 1
    } else {
      this.self.facing = -1
    }
    if (this.cooldown <= 0) {
      // 简单随机动作
      const r = Math.random()
      this.clearActions()
      if (Math.abs(dx) < 1.6) {
        if (r < 0.6) this.state.light = true
        else if (r < 0.85) this.state.heavy = true
        else if (r < 0.95) this.state.skill = true
        else this.state.ultimate = true
      } else if (r < 0.15) {
        this.state.jump = true
      }
      this.cooldown = 0.3 + Math.random() * 0.5
    } else {
      // 冷却中不重复触发按钮
      this.clearActions()
    }
  }

  public snapshot(): InputState {
    return { ...this.state }
  }

  private clearActions() {
    this.state.jump = false
    this.state.light = false
    this.state.heavy = false
    this.state.skill = false
    this.state.ultimate = false
  }
}


