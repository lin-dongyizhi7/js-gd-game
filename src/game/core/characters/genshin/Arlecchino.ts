import { Character, CharacterOptions } from '../Character'
import type { CharacterStats, PassiveSkill } from '../../types'

export interface ArlecchinoStats extends CharacterStats {
  element: string
}

export interface ArlecchinoOptions extends CharacterOptions {
  stats: ArlecchinoStats
}

export class Arlecchino extends Character {
  public readonly element: string
  public readonly passives: PassiveSkill[]
  private pyroDamageBuff: number = 0
  private pyroDamageBuffTimer: number | null = null
  private readonly pyroDamageBuffDuration: number = 3000 // 3秒

  constructor(options: ArlecchinoOptions) {
    super(options)
    this.element = options.stats.element
    this.passives = options.passives ?? []
  }

  // 仆人技能：炼狱之拥
  public castSkill() {
    if (this.stats.specialCharge < 25) return 0
    
    this.currentAction = 'skill'
    this.stats.specialCharge -= 25
    
    // 释放火焰冲击波，造成火元素伤害并附加灼烧效果
    const baseDamage = Math.floor(this.stats.attack * 2.2)
    
    // 激活炎之执炬被动
    this.activatePyroDamageBuff()
    
    return baseDamage
  }

  public castUltimate() {
    if (this.stats.specialCharge < this.stats.specialChargeMax) return 0
    
    this.currentAction = 'ultimate'
    this.stats.specialCharge = 0
    
    // 仆人大招：烬火燎原
    // 召唤炼狱之火席卷战场，对所有敌人造成巨额火元素伤害
    const baseDamage = Math.floor(this.stats.attack * 4)
    
    // 大招后重置火元素伤害加成
    this.resetPyroDamageBuff()
    
    return baseDamage
  }

  // 仆人重击：炽火重斩
  public attackHeavy() {
    const baseDamage = super.attackHeavy()
    
    // 蓄力后以炽火重斩造成火元素伤害
    // 并使目标在3秒内受到的火元素伤害提升15%
    
    return baseDamage
  }

  // 仆人被动：炎之执炬 - 火元素伤害提升
  public hasPassive(key: string): boolean {
    return this.passives.some(passive => passive.key === key)
  }

  public getPassiveDescription(key: string): string | undefined {
    const passive = this.passives.find(p => p.key === key)
    return passive?.description
  }

  // 激活火元素伤害加成
  private activatePyroDamageBuff() {
    this.pyroDamageBuff += 15 // 提升15%火元素伤害
    
    // 重置定时器
    if (this.pyroDamageBuffTimer) {
      clearTimeout(this.pyroDamageBuffTimer)
    }
    
    this.pyroDamageBuffTimer = window.setTimeout(() => {
      this.clearPyroDamageBuff()
    }, this.pyroDamageBuffDuration)
  }

  // 清除火元素伤害加成
  private clearPyroDamageBuff() {
    this.pyroDamageBuff = 0
    this.pyroDamageBuffTimer = null
  }

  // 重置火元素伤害加成
  private resetPyroDamageBuff() {
    this.pyroDamageBuff = 0
    if (this.pyroDamageBuffTimer) {
      clearTimeout(this.pyroDamageBuffTimer)
      this.pyroDamageBuffTimer = null
    }
  }

  // 获取当前火元素伤害加成
  public getPyroDamageBuff(): number {
    return this.pyroDamageBuff
  }

  // 检查是否有火元素伤害加成
  public hasPyroDamageBuff(): boolean {
    return this.pyroDamageBuff > 0
  }

  // 重写伤害计算，应用火元素伤害加成
  public attackLight() {
    const baseDamage = super.attackLight()
    if (this.hasPyroDamageBuff()) {
      return Math.floor(baseDamage * (1 + this.pyroDamageBuff / 100))
    }
    return baseDamage
  }

  public attackHeavy() {
    const baseDamage = super.attackHeavy()
    if (this.hasPyroDamageBuff()) {
      return Math.floor(baseDamage * (1 + this.pyroDamageBuff / 100))
    }
    return baseDamage
  }

  public castSkill() {
    const baseDamage = super.castSkill()
    if (this.hasPyroDamageBuff()) {
      return Math.floor(baseDamage * (1 + this.pyroDamageBuff / 100))
    }
    return baseDamage
  }

  public castUltimate() {
    const baseDamage = super.castUltimate()
    if (this.hasPyroDamageBuff()) {
      return Math.floor(baseDamage * (1 + this.pyroDamageBuff / 100))
    }
    return baseDamage
  }

  // 获取火元素伤害加成剩余时间
  public getPyroDamageBuffRemainingTime(): number {
    if (this.pyroDamageBuff === 0 || !this.pyroDamageBuffTimer) {
      return 0
    }
    // 这里需要更精确的时间计算，暂时返回0
    return 0
  }

  // 清理资源
  public destroy() {
    if (this.pyroDamageBuffTimer) {
      clearTimeout(this.pyroDamageBuffTimer)
      this.pyroDamageBuffTimer = null
    }
  }
}
