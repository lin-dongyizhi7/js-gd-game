import { Character, CharacterOptions } from '../Character'
import type { CharacterStats, PassiveSkill } from '../../types'

export interface XiadieStats extends CharacterStats {
  element: string
}

export interface XiadieOptions extends CharacterOptions {
  stats: XiadieStats
}

export class Xiadie extends Character {
  public readonly element: string
  public readonly passives: PassiveSkill[]
  private quantumAuraActive: boolean = false
  private auraRadius: number = 4 // 4米半径

  constructor(options: XiadieOptions) {
    super(options)
    this.element = options.stats.element
    this.passives = options.passives ?? []
  }

  // 遐蝶技能：缄默，幽蝶之轻抚
  public castSkill() {
    if (this.stats.specialCharge < 25) return 0
    
    this.currentAction = 'skill'
    this.stats.specialCharge -= 25
    
    // 消耗自身10%最大生命值并消耗2点能量
    const hpCost = Math.floor(this.stats.maxHp * 0.1)
    this.stats.hp = Math.max(1, this.stats.hp - hpCost)
    
    // 对范围内敌人造成量子元素伤害，施加「量缚」效果
    const baseDamage = Math.floor(this.stats.attack * 2.2)
    
    // 激活量子花雾被动
    this.activateQuantumAura()
    
    return baseDamage
  }

  public castUltimate() {
    if (this.stats.specialCharge < this.stats.specialChargeMax) return 0
    
    this.currentAction = 'ultimate'
    this.stats.specialCharge = 0
    
    // 遐蝶大招：遗世冥域
    // 消耗自身20%最大生命值并消耗110点能量
    const hpCost = Math.floor(this.stats.maxHp * 0.2)
    this.stats.hp = Math.max(1, this.stats.hp - hpCost)
    
    // 对范围内所有敌人造成量子元素伤害，同时为全队附加「量跃」效果
    const baseDamage = Math.floor(this.stats.attack * 4)
    
    return baseDamage
  }

  // 遐蝶重击：哀悼，死海之涟漪
  public attackHeavy() {
    const baseDamage = super.attackHeavy()
    
    // 消耗自身5%最大生命值，原地短暂蓄力后旋转起舞
    const hpCost = Math.floor(this.stats.maxHp * 0.05)
    this.stats.hp = Math.max(1, this.stats.hp - hpCost)
    
    // 对周围造成连续量子元素伤害，合计180%
    const totalDamage = Math.floor(baseDamage * 1.8)
    
    // 若命中2名及以上敌人，为自身提供8%移动速度，持续3秒
    // 这里需要目标系统支持，暂时返回总伤害
    
    return totalDamage
  }

  // 遐蝶被动：悲鸣，赐死之先声 - 量子花雾
  public hasPassive(key: string): boolean {
    return this.passives.some(passive => passive.key === key)
  }

  public getPassiveDescription(key: string): string | undefined {
    const passive = this.passives.find(p => p.key === key)
    return passive?.description
  }

  // 激活量子花雾
  private activateQuantumAura() {
    this.quantumAuraActive = true
    // 以自身为中心半径4米的范围内敌人每秒受到30%量子元素伤害的持续伤害
    // 这里需要目标系统支持
  }

  // 检查量子花雾是否激活
  public isQuantumAuraActive(): boolean {
    return this.quantumAuraActive
  }

  // 获取量子花雾半径
  public getQuantumAuraRadius(): number {
    return this.auraRadius
  }

  // 重写普攻，消耗生命值
  public attackLight() {
    const baseDamage = super.attackLight()
    
    // 消耗自身5%生命值
    const hpCost = Math.floor(this.stats.maxHp * 0.05)
    this.stats.hp = Math.max(1, this.stats.hp - hpCost)
    
    return baseDamage
  }

  // 获取当前生命值百分比
  public getHpPercentage(): number {
    return (this.stats.hp / this.stats.maxHp) * 100
  }

  // 检查是否处于低生命值状态
  public isLowHp(): boolean {
    return this.getHpPercentage() <= 30
  }

  // 获取量子花雾伤害
  public getQuantumAuraDamage(): number {
    if (!this.quantumAuraActive) return 0
    return Math.floor(this.stats.attack * 0.3) // 30%攻击力的持续伤害
  }
}
