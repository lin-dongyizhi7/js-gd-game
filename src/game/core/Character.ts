import { Group, Object3D, Vector3 } from 'three'
import type { CharacterStats, InputState, UpdateContext, PassiveSkill } from '../types'

export type CharacterAction = 'idle' | 'run' | 'jump' | 'attackLight' | 'attackHeavy' | 'skill' | 'ultimate' | 'hit' | 'dead'

export interface CharacterOptions {
  name: string
  stats: CharacterStats
  teamId: number
  spawnPosition?: Vector3
  passives?: PassiveSkill[]
}

export class Character {
  public readonly name: string
  public readonly teamId: number
  public readonly object: Group
  public stats: CharacterStats
  public velocity: Vector3
  public grounded: boolean
  public currentAction: CharacterAction
  public facing: 1 | -1
  public passives: PassiveSkill[]

  constructor(options: CharacterOptions) {
    this.name = options.name
    this.teamId = options.teamId
    this.stats = { ...options.stats }
    this.object = new Group()
    this.velocity = new Vector3(0, 0, 0)
    this.grounded = true
    this.currentAction = 'idle'
    this.facing = 1
    this.passives = options.passives ?? []

    const spawn = options.spawnPosition ?? new Vector3(0, 0, 0)
    this.object.position.copy(spawn)
  }

  // 占位：未来接入动画/骨骼系统
  public attachModel(_model: Object3D) {
    this.object.add(_model)
  }

  public takeDamage(rawDamage: number) {
    const damage = Math.max(1, Math.floor(rawDamage - this.stats.defense))
    this.stats.hp = Math.max(0, this.stats.hp - damage)
    if (this.stats.hp === 0) {
      this.currentAction = 'dead'
    } else {
      this.currentAction = 'hit'
    }
  }

  private performAttack(base: number, action: CharacterAction) {
    this.currentAction = action
    // 充能（用于技能/大招），被动影响获取量
    let gain = 10
    if (this.hasPassive('charge_gain_up')) gain += 5
    this.stats.specialCharge = Math.min(this.stats.specialChargeMax, this.stats.specialCharge + gain)
    return base
  }

  public attackLight() {
    return this.performAttack(this.stats.attack, 'attackLight')
  }

  public attackHeavy() {
    return this.performAttack(Math.floor(this.stats.attack * 1.8), 'attackHeavy')
  }

  public castSkill() {
    if (this.stats.specialCharge < 25) return 0
    this.currentAction = 'skill'
    this.stats.specialCharge -= 25
    return Math.floor(this.stats.attack * 2.2)
  }

  public castUltimate() {
    if (this.stats.specialCharge < this.stats.specialChargeMax) return 0
    this.currentAction = 'ultimate'
    this.stats.specialCharge = 0
    return Math.floor(this.stats.attack * 4)
  }

  public jump() {
    if (!this.grounded) return
    this.grounded = false
    this.velocity.y = this.stats.jumpPower
    this.currentAction = 'jump'
  }

  public updateFromInput(input: InputState) {
    // 水平移动
    const moveX = input.moveX
    this.object.position.x += moveX * this.stats.moveSpeed
    if (Math.abs(moveX) > 0.01) {
      this.currentAction = 'run'
      this.facing = moveX > 0 ? 1 : -1
      this.object.scale.x = this.facing
    } else if (this.grounded) {
      this.currentAction = 'idle'
    }

    if (input.jump) this.jump()
    if (input.light) this.attackLight()
    if (input.heavy) this.attackHeavy()
    if (input.skill) this.castSkill()
    if (input.ultimate) this.castUltimate()
  }

  public tick(ctx: UpdateContext) {
    // 简易重力
    if (!this.grounded) {
      this.velocity.y -= 9.8 * ctx.deltaSeconds
      this.object.position.y += this.velocity.y * ctx.deltaSeconds
      if (this.object.position.y <= 0) {
        this.object.position.y = 0
        this.velocity.y = 0
        this.grounded = true
        if (this.currentAction === 'jump') this.currentAction = 'idle'
      }
    }
  }

  private hasPassive(key: string): boolean {
    return this.passives.some(p => p.key === key)
  }
}


