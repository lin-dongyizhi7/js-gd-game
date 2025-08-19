import { Character, CharacterOptions } from '../Character'
import type { CharacterStats, PassiveSkill } from '../../types'

export interface KeqingStats extends CharacterStats {
  element: string
}

export interface KeqingOptions extends CharacterOptions {
  stats: KeqingStats
}

export class Keqing extends Character {
  public readonly element: string
  public readonly passives: PassiveSkill[]
  private thunderStakePosition: { x: number; z: number } | null = null

  constructor(options: KeqingOptions) {
    super(options)
    this.element = options.stats.element
    this.passives = options.passives ?? []
  }

  // 刻晴技能：星斗归位
  public castSkill() {
    if (this.stats.specialCharge < 25) return 0

    this.currentAction = 'skill'
    this.stats.specialCharge -= 25

    // 投掷雷楔并瞬移至目标位置
    this.thunderStakePosition = {
      x: this.object.position.x + (this.facing * 3), // 前方3单位
      z: this.object.position.z
    }

    // 瞬移至雷楔位置
    this.object.position.x = this.thunderStakePosition.x
    this.object.position.z = this.thunderStakePosition.z

    const baseDamage = Math.floor(this.stats.attack * 2.2)
    return baseDamage
  }

  public castUltimate() {
    if (this.stats.specialCharge < this.stats.specialChargeMax) return 0

    this.currentAction = 'ultimate'
    this.stats.specialCharge = 0

    // 刻晴大招：天街巡游，召唤雷罚领域
    const baseDamage = Math.floor(this.stats.attack * 4)
    return baseDamage
  }

  // 刻晴重击：瞬身斩
  public attackHeavy() {
    const baseDamage = super.attackHeavy()

    // 若目标带有雷楔标记，额外造成50%伤害
    if (this.thunderStakePosition) {
      return Math.floor(baseDamage * 1.5)
    }

    return baseDamage
  }

  // 刻晴被动：雷影步 - 移动速度提升
  public hasPassive(key: string): boolean {
    return this.passives.some(passive => passive.key === key)
  }

  public getPassiveDescription(key: string): string | undefined {
    const passive = this.passives.find(p => p.key === key)
    return passive?.description
  }

  // 获取雷楔位置
  public getThunderStakePosition() {
    return this.thunderStakePosition
  }

  // 清除雷楔标记
  public clearThunderStake() {
    this.thunderStakePosition = null
  }

  // 重写移动速度，雷影步被动提升
  public getMoveSpeed(): number {
    let moveSpeed = this.stats.moveSpeed
    if (this.hasPassive('move_speed_up')) {
      moveSpeed *= 1.2 // 移动速度提升20%
    }
    return moveSpeed
  }
}
