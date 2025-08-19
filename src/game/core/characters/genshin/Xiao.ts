import { Character, CharacterOptions } from '../Character'
import type { CharacterStats, PassiveSkill } from '../../types'

export interface XiaoStats extends CharacterStats {
  element: string
}

export interface XiaoOptions extends CharacterOptions {
  stats: XiaoStats
}

export class Xiao extends Character {
  public readonly element: string
  public readonly passives: PassiveSkill[]
  private isYakshaForm: boolean = false
  private yakshaFormTimer: number | null = null
  private readonly yakshaFormDuration: number = 10000 // 10秒
  private consecutiveDashes: number = 0
  private readonly maxConsecutiveDashes: number = 3

  constructor(options: XiaoOptions) {
    super(options)
    this.element = options.stats.element
    this.passives = options.passives ?? []
  }

  // 魈技能：风灵疾突
  public castSkill() {
    if (this.stats.specialCharge < 25) return 0
    
    this.currentAction = 'skill'
    this.stats.specialCharge -= 25
    
    // 快速冲刺并对路径敌人造成风元素伤害，可连续使用
    if (this.consecutiveDashes < this.maxConsecutiveDashes) {
      this.consecutiveDashes++
    }
    
    const baseDamage = Math.floor(this.stats.attack * 2.2)
    return baseDamage
  }

  public castUltimate() {
    if (this.stats.specialCharge < this.stats.specialChargeMax) return 0
    
    this.currentAction = 'ultimate'
    this.stats.specialCharge = 0
    
    // 魈大招：靖妖傩舞
    // 进入降魔形态，大幅提升攻击并以风元素撕裂敌人
    this.enterYakshaForm()
    
    const baseDamage = Math.floor(this.stats.attack * 4)
    return baseDamage
  }

  // 魈重击：风刃突刺
  public attackHeavy() {
    const baseDamage = super.attackHeavy()
    
    // 短暂蓄力向前突刺，造成风元素伤害
    // 若在空中释放，随后下落攻击额外造成100%风元素伤害
    
    return baseDamage
  }

  // 进入降魔形态
  private enterYakshaForm() {
    this.isYakshaForm = true
    
    // 设置定时器，10秒后自动退出
    if (this.yakshaFormTimer) {
      clearTimeout(this.yakshaFormTimer)
    }
    
    this.yakshaFormTimer = window.setTimeout(() => {
      this.exitYakshaForm()
    }, this.yakshaFormDuration)
  }

  // 退出降魔形态
  private exitYakshaForm() {
    this.isYakshaForm = false
    this.yakshaFormTimer = null
  }

  // 手动触发降魔形态
  public triggerYakshaForm() {
    if (!this.isYakshaForm) {
      this.enterYakshaForm()
    }
  }

  // 检查是否处于降魔形态
  public isYakshaFormActive(): boolean {
    return this.isYakshaForm
  }

  // 魈被动：降魔·平妖 - 空中攻击伤害提升
  public hasPassive(key: string): boolean {
    return this.passives.some(passive => passive.key === key)
  }

  public getPassiveDescription(key: string): string | undefined {
    const passive = this.passives.find(p => p.key === key)
    return passive?.description
  }

  // 重写伤害计算，降魔形态下攻击力大幅提升
  public attackLight() {
    const baseDamage = super.attackLight()
    if (this.isYakshaForm) {
      return Math.floor(baseDamage * 2.0) // 降魔形态下攻击力提升100%
    }
    return baseDamage
  }

  public attackHeavy() {
    const baseDamage = super.attackHeavy()
    if (this.isYakshaForm) {
      return Math.floor(baseDamage * 2.0) // 降魔形态下攻击力提升100%
    }
    return baseDamage
  }

  public castSkill() {
    const baseDamage = super.castSkill()
    if (this.isYakshaForm) {
      return Math.floor(baseDamage * 2.0) // 降魔形态下攻击力提升100%
    }
    return baseDamage
  }

  // 获取连续冲刺次数
  public getConsecutiveDashes(): number {
    return this.consecutiveDashes
  }

  // 重置连续冲刺次数
  public resetConsecutiveDashes() {
    this.consecutiveDashes = 0
  }

  // 检查是否可以连续冲刺
  public canDash(): boolean {
    return this.consecutiveDashes < this.maxConsecutiveDashes
  }

  // 获取降魔形态剩余时间
  public getYakshaFormRemainingTime(): number {
    if (!this.isYakshaForm || !this.yakshaFormTimer) {
      return 0
    }
    // 这里需要更精确的时间计算，暂时返回0
    return 0
  }

  // 清理资源
  public destroy() {
    if (this.yakshaFormTimer) {
      clearTimeout(this.yakshaFormTimer)
      this.yakshaFormTimer = null
    }
  }
}
