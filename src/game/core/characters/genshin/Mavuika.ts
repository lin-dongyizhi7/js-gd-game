import { Character, CharacterOptions } from '../Character'
import type { CharacterStats, PassiveSkill } from '../../types'

export interface MavuikaStats extends CharacterStats {
  element: string
}

export interface MavuikaOptions extends CharacterOptions {
  stats: MavuikaStats
}

export class Mavuika extends Character {
  public readonly element: string
  public readonly passives: PassiveSkill[]
  private attackBuffStacks: number = 0
  private readonly maxAttackBuffStacks: number = 5

  constructor(options: MavuikaOptions) {
    super(options)
    this.element = options.stats.element
    this.passives = options.passives ?? []
  }

  // 玛薇卡技能：焚曜之环
  public castSkill() {
    if (this.stats.specialCharge < 25) return 0
    
    this.currentAction = 'skill'
    this.stats.specialCharge -= 25
    
    // 召唤火环，对周围造成火元素伤害
    const baseDamage = Math.floor(this.stats.attack * 2.2)
    
    // 炽焰燃烧被动：增加攻击力层数
    this.addAttackBuffStack()
    
    return baseDamage
  }

  public castUltimate() {
    if (this.stats.specialCharge < this.stats.specialChargeMax) return 0
    
    this.currentAction = 'ultimate'
    this.stats.specialCharge = 0
    
    // 玛薇卡大招：聆听太阳的轰鸣
    const baseDamage = Math.floor(this.stats.attack * 4)
    
    // 大招后重置攻击力层数
    this.attackBuffStacks = 0
    
    return baseDamage
  }

  // 玛薇卡重击：火焰连斩
  public attackHeavy() {
    const baseDamage = super.attackHeavy()
    
    // 炽焰燃烧被动：攻击力提升
    const buffedDamage = Math.floor(baseDamage * (1 + this.attackBuffStacks * 0.1))
    
    return buffedDamage
  }

  // 玛薇卡被动：炽焰燃烧 - 每秒提升少量攻击力直至上限
  public hasPassive(key: string): boolean {
    return this.passives.some(passive => passive.key === key)
  }

  public getPassiveDescription(key: string): string | undefined {
    const passive = this.passives.find(p => p.key === key)
    return passive?.description
  }

  // 增加攻击力层数
  private addAttackBuffStack() {
    if (this.attackBuffStacks < this.maxAttackBuffStacks) {
      this.attackBuffStacks++
    }
  }

  // 获取当前攻击力层数
  public getAttackBuffStacks(): number {
    return this.attackBuffStacks
  }

  // 获取攻击力加成百分比
  public getAttackBuffPercentage(): number {
    return this.attackBuffStacks * 10 // 每层10%
  }

  // 重写普攻，应用攻击力加成
  public attackLight() {
    const baseDamage = super.attackLight()
    const buffedDamage = Math.floor(baseDamage * (1 + this.attackBuffStacks * 0.1))
    return buffedDamage
  }
}
