import { Character, CharacterOptions } from '../Character'
import type { CharacterStats, PassiveSkill } from '../../types'

export interface March7Stats extends CharacterStats {
  element: string
}

export interface March7Options extends CharacterOptions {
  stats: March7Stats
}

export class March7 extends Character {
  public readonly element: string
  public readonly passives: PassiveSkill[]
  private hasShield: boolean = false
  private shieldAbsorb: number = 0
  private shieldTimer: number | null = null
  private readonly shieldDuration: number = 5000 // 5秒

  constructor(options: March7Options) {
    super(options)
    this.element = options.stats.element
    this.passives = options.passives ?? []
  }

  // 三月七技能：可爱即是正义
  public castSkill() {
    if (this.stats.specialCharge < 25) return 0
    
    this.currentAction = 'skill'
    this.stats.specialCharge -= 25
    
    // 为自己生成吸收20%目标最大生命值的冰元素护盾，持续5秒
    this.activateShield()
    
    const baseDamage = Math.floor(this.stats.attack * 2.2)
    return baseDamage
  }

  public castUltimate() {
    if (this.stats.specialCharge < this.stats.specialChargeMax) return 0
    
    this.currentAction = 'ultimate'
    this.stats.specialCharge = 0
    
    // 三月七大招：冰刻箭雨之时
    // 对范围内所有敌人造成冰元素伤害，有30%概率使目标冻结1.5秒
    // 同时为全队生成吸收10%最大生命值的冰元素护盾
    const baseDamage = Math.floor(this.stats.attack * 4)
    
    // 为全队生成护盾（这里需要队友系统支持）
    
    return baseDamage
  }

  // 三月七重击：极寒的弓矢
  public attackHeavy() {
    const baseDamage = super.attackHeavy()
    
    // 蓄力发射霜晶箭，对单体造成冰元素伤害
    // 若命中时自身拥有护盾，则额外使目标减速20%，持续2秒
    
    return baseDamage
  }

  // 三月七被动：冰棱守护 - 跳跃落地后为自身生成护盾
  public hasPassive(key: string): boolean {
    return this.passives.some(passive => passive.key === key)
  }

  public getPassiveDescription(key: string): string | undefined {
    const passive = this.passives.find(p => p.key === key)
    return passive?.description
  }

  // 激活护盾
  private activateShield() {
    this.hasShield = true
    this.shieldAbsorb = Math.floor(this.stats.maxHp * 0.2) // 20%最大生命值
    
    // 设置护盾持续时间
    if (this.shieldTimer) {
      clearTimeout(this.shieldTimer)
    }
    
    this.shieldTimer = window.setTimeout(() => {
      this.deactivateShield()
    }, this.shieldDuration)
  }

  // 停用护盾
  private deactivateShield() {
    this.hasShield = false
    this.shieldAbsorb = 0
    this.shieldTimer = null
  }

  // 检查是否有护盾
  public hasActiveShield(): boolean {
    return this.hasShield
  }

  // 获取护盾吸收量
  public getShieldAbsorb(): number {
    return this.shieldAbsorb
  }

  // 重写受伤计算，护盾优先吸收伤害
  public takeDamage(rawDamage: number) {
    if (this.hasShield && this.shieldAbsorb > 0) {
      const absorbedDamage = Math.min(rawDamage, this.shieldAbsorb)
      this.shieldAbsorb -= absorbedDamage
      
      if (this.shieldAbsorb <= 0) {
        this.deactivateShield()
      }
      
      const remainingDamage = rawDamage - absorbedDamage
      if (remainingDamage > 0) {
        super.takeDamage(remainingDamage)
      }
    } else {
      super.takeDamage(rawDamage)
    }
  }

  // 重写跳跃，落地后生成护盾
  public jump() {
    super.jump()
    
    // 冰棱守护被动：跳跃落地后为自身生成护盾
    if (this.hasPassive('shield_on_jump')) {
      // 这里需要检测落地状态，暂时在跳跃时直接生成护盾
      this.activateShield()
    }
  }

  // 重写防御力，护盾存在时提升自身10%防御力
  public getDefense(): number {
    let defense = this.stats.defense
    if (this.hasActiveShield()) {
      defense = Math.floor(defense * 1.1) // 护盾存在时提升10%防御力
    }
    return defense
  }

  // 获取护盾剩余时间
  public getShieldRemainingTime(): number {
    if (!this.hasShield || !this.shieldTimer) {
      return 0
    }
    // 这里需要更精确的时间计算，暂时返回0
    return 0
  }

  // 清理资源
  public destroy() {
    if (this.shieldTimer) {
      clearTimeout(this.shieldTimer)
      this.shieldTimer = null
    }
  }
}
