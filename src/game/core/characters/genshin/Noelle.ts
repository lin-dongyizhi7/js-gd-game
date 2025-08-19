import { Character, CharacterOptions } from '../Character'
import type { CharacterStats, PassiveSkill } from '../../types'

export interface NoelleStats extends CharacterStats {
  element: string
}

export interface NoelleOptions extends CharacterOptions {
  stats: NoelleStats
}

export class Noelle extends Character {
  public readonly element: string
  public readonly passives: PassiveSkill[]
  private hasShield: boolean = false
  private shieldAbsorb: number = 0

  constructor(options: NoelleOptions) {
    super(options)
    this.element = options.stats.element
    this.passives = options.passives ?? []
  }

  // 诺艾尔技能：坚定之心
  public castSkill() {
    if (this.stats.specialCharge < 25) return 0
    
    this.currentAction = 'skill'
    this.stats.specialCharge -= 25
    
    // 举起盾牌防御，成功格挡后反击造成岩元素伤害
    this.activateShield()
    
    const baseDamage = Math.floor(this.stats.attack * 2.2)
    return baseDamage
  }

  public castUltimate() {
    if (this.stats.specialCharge < this.stats.specialChargeMax) return 0
    
    this.currentAction = 'ultimate'
    this.stats.specialCharge = 0
    
    // 诺艾尔大招：西风骑士的荣耀
    // 挥舞巨斧旋转攻击，对范围内敌人造成多次岩元素伤害并恢复队友生命值
    const baseDamage = Math.floor(this.stats.attack * 4)
    
    return baseDamage
  }

  // 诺艾尔重击：岩盾重击
  public attackHeavy() {
    const baseDamage = super.attackHeavy()
    
    // 持续蓄力旋转挥击，对周围敌人造成连续岩元素伤害
    // 在结束时获得一层护体护盾（吸收等同10%最大生命值的伤害，持续3秒）
    this.activateShield()
    
    return baseDamage
  }

  // 诺艾尔被动：守护之力 - 防御提升
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
    this.shieldAbsorb = Math.floor(this.stats.maxHp * 0.1) // 10%最大生命值
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
        this.hasShield = false
        this.shieldAbsorb = 0
      }
      
      const remainingDamage = rawDamage - absorbedDamage
      if (remainingDamage > 0) {
        super.takeDamage(remainingDamage)
      }
    } else {
      super.takeDamage(rawDamage)
    }
  }

  // 重写防御力，守护之力被动提升
  public getDefense(): number {
    let defense = this.stats.defense
    if (this.hasPassive('defense_up')) {
      defense = Math.floor(defense * 1.2) // 防御提升20%
    }
    return defense
  }

  // 治疗队友（基于防御力）
  public healAlly(ally: Character): number {
    if (!this.hasPassive('defense_up')) return 0
    
    const healAmount = Math.floor(this.getDefense() * 0.5) // 基于防御力的50%
    ally.stats.hp = Math.min(ally.stats.maxHp, ally.stats.hp + healAmount)
    
    return healAmount
  }
}
