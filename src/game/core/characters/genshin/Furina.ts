import { Character, CharacterOptions } from '../Character'
import type { CharacterStats, PassiveSkill } from '../../types'

export interface FurinaStats extends CharacterStats {
  element: string
}

export interface FurinaOptions extends CharacterOptions {
  stats: FurinaStats
}

export class Furina extends Character {
  public readonly element: string
  public readonly passives: PassiveSkill[]
  private isHighHpForm: boolean = true // true为高生命形态，false为低生命形态

  constructor(options: FurinaOptions) {
    super(options)
    this.element = options.stats.element
    this.passives = options.passives ?? []
  }

  // 芙宁娜技能：水中幻愿 - 切换生命值形态
  public castSkill() {
    if (this.stats.specialCharge < 25) return 0

    this.currentAction = 'skill'
    this.stats.specialCharge -= 25

    // 切换形态
    this.isHighHpForm = !this.isHighHpForm

    // 根据形态造成不同的水元素伤害
    const baseDamage = Math.floor(this.stats.attack * 2.2)
    if (this.isHighHpForm) {
      // 高生命形态：治疗效果
      const healAmount = Math.floor(this.stats.maxHp * 0.1)
      this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + healAmount)
      return baseDamage
    } else {
      // 低生命形态：伤害提升
      return Math.floor(baseDamage * 1.3)
    }
  }

  public castUltimate() {
    if (this.stats.specialCharge < this.stats.specialChargeMax) return 0

    this.currentAction = 'ultimate'
    this.stats.specialCharge = 0

    // 芙宁娜大招：盛大谢幕，引发水之洪流
    const baseDamage = Math.floor(this.stats.attack * 4)

    // 根据形态提供不同效果
    if (this.isHighHpForm) {
      // 高生命形态：恢复能量
      this.stats.specialCharge = Math.min(this.stats.specialChargeMax, this.stats.specialCharge + 30)
    }

    return baseDamage
  }

  // 芙宁娜重击：水刃
  public attackHeavy() {
    const baseDamage = super.attackHeavy()

    // 处于高生命形态时，额外回复5点能量
    if (this.isHighHpForm) {
      this.stats.specialCharge = Math.min(this.stats.specialChargeMax, this.stats.specialCharge + 5)
    }

    return baseDamage
  }

  // 芙宁娜被动：众水之愿 - 能量获取提升
  public hasPassive(key: string): boolean {
    return this.passives.some(passive => passive.key === key)
  }

  public getPassiveDescription(key: string): string | undefined {
    const passive = this.passives.find(p => p.key === key)
    return passive?.description
  }

  // 获取当前形态
  public getCurrentForm(): 'high' | 'low' {
    return this.isHighHpForm ? 'high' : 'low'
  }

  // 检查是否为高生命形态
  public isHighHpFormState(): boolean {
    return this.isHighHpForm
  }

  // 强制切换形态
  public toggleForm() {
    this.isHighHpForm = !this.isHighHpForm
  }

  // 重写能量获取，众水之愿被动提升
  public getEnergyGain(): number {
    let energyGain = 10
    if (this.hasPassive('charge_gain_up')) {
      energyGain += 3 // 能量获取提升
    }
    return energyGain
  }
}
