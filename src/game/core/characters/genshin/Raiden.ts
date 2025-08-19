import { Character, CharacterOptions } from '../Character'
import type { CharacterStats, PassiveSkill } from '../../types'

export interface RaidenStats extends CharacterStats {
  element: string
}

export interface RaidenOptions extends CharacterOptions {
  stats: RaidenStats
}

export class Raiden extends Character {
  public readonly element: string
  public readonly passives: PassiveSkill[]
  private isEyeOpen: boolean = false

  constructor(options: RaidenOptions) {
    super(options)
    this.element = options.stats.element
    this.passives = options.passives ?? []
  }

  // 雷电将军技能：神变·恶曜开眼
  public castSkill() {
    if (this.stats.specialCharge < 25) return 0
    
    this.currentAction = 'skill'
    this.stats.specialCharge -= 25
    
    // 展开领域，提升自身及队友攻击
    this.isEyeOpen = true
    
    // 领域持续期间，攻击力提升
    const baseDamage = Math.floor(this.stats.attack * 2.2)
    return baseDamage
  }

  public castUltimate() {
    if (this.stats.specialCharge < this.stats.specialChargeMax) return 0
    
    this.currentAction = 'ultimate'
    this.stats.specialCharge = 0
    
    // 雷电将军大招：奥义·梦想真说，大范围雷元素伤害
    const baseDamage = Math.floor(this.stats.attack * 4)
    return baseDamage
  }

  // 雷电将军重击：雷鸣斩击
  public attackHeavy() {
    const baseDamage = super.attackHeavy()
    
    // 命中后本次能量获取提高20%，持续2秒
    if (this.isEyeOpen) {
      // 在领域状态下，重击伤害提升
      return Math.floor(baseDamage * 1.2)
    }
    
    return baseDamage
  }

  // 雷电将军被动：神变 - 能量上限与获取提升
  public hasPassive(key: string): boolean {
    return this.passives.some(passive => passive.key === key)
  }

  public getPassiveDescription(key: string): string | undefined {
    const passive = this.passives.find(p => p.key === key)
    return passive?.description
  }

  // 获取领域状态
  public isEyeOpenState(): boolean {
    return this.isEyeOpen
  }

  // 关闭领域
  public closeEye() {
    this.isEyeOpen = false
  }
}
