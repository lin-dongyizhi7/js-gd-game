import { Character, CharacterOptions } from '../Character'
import type { CharacterStats, PassiveSkill } from '../../types'

export interface SkirkStats extends CharacterStats {
  element: string
}

export interface SkirkOptions extends CharacterOptions {
  stats: SkirkStats
}

export class Skirk extends Character {
  public readonly element: string
  public readonly passives: PassiveSkill[]
  private criticalRateBuff: number = 0
  private criticalRateBuffTimer: number | null = null
  private readonly criticalRateBuffDuration: number = 4000 // 4秒

  constructor(options: SkirkOptions) {
    super(options)
    this.element = options.stats.element
    this.passives = options.passives ?? []
  }

  // 丝柯克技能：暗影突刺
  public castSkill() {
    if (this.stats.specialCharge < 25) return 0
    
    this.currentAction = 'skill'
    this.stats.specialCharge -= 25
    
    // 闪现至敌人身后发动突袭，造成冰霜伤害
    const baseDamage = Math.floor(this.stats.attack * 2.2)
    
    return baseDamage
  }

  public castUltimate() {
    if (this.stats.specialCharge < this.stats.specialChargeMax) return 0
    
    this.currentAction = 'ultimate'
    this.stats.specialCharge = 0
    
    // 丝柯克大招：深渊降临
    // 召唤深渊能量爆发，对大范围敌人造成持续冰霜与暗影伤害
    const baseDamage = Math.floor(this.stats.attack * 4)
    
    return baseDamage
  }

  // 丝柯克重击：深渊突刺
  public attackHeavy() {
    const baseDamage = super.attackHeavy()
    
    // 蓄力贯穿突刺，造成冰霜伤害
    // 若本次攻击造成暴击，则在4秒内提升自身10%暴击率
    
    return baseDamage
  }

  // 丝柯克被动：深渊之噬 - 暴击率提升
  public hasPassive(key: string): boolean {
    return this.passives.some(passive => passive.key === key)
  }

  public getPassiveDescription(key: string): string | undefined {
    const passive = this.passives.find(p => p.key === key)
    return passive?.description
  }

  // 处理暴击，提升暴击率
  public handleCriticalHit() {
    this.criticalRateBuff += 10 // 提升10%暴击率
    
    // 重置定时器
    if (this.criticalRateBuffTimer) {
      clearTimeout(this.criticalRateBuffTimer)
    }
    
    this.criticalRateBuffTimer = window.setTimeout(() => {
      this.clearCriticalRateBuff()
    }, this.criticalRateBuffDuration)
  }

  // 清除暴击率加成
  private clearCriticalRateBuff() {
    this.criticalRateBuff = 0
    this.criticalRateBuffTimer = null
  }

  // 获取当前暴击率加成
  public getCriticalRateBuff(): number {
    return this.criticalRateBuff
  }

  // 检查是否有暴击率加成
  public hasCriticalRateBuff(): boolean {
    return this.criticalRateBuff > 0
  }

  // 获取暴击率加成剩余时间
  public getCriticalRateBuffRemainingTime(): number {
    if (this.criticalRateBuff === 0 || !this.criticalRateBuffTimer) {
      return 0
    }
    // 这里需要更精确的时间计算，暂时返回0
    return 0
  }

  // 清理资源
  public destroy() {
    if (this.criticalRateBuffTimer) {
      clearTimeout(this.criticalRateBuffTimer)
      this.criticalRateBuffTimer = null
    }
  }
}
