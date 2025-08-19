import { Character, CharacterOptions } from '../Character'
import type { CharacterStats, PassiveSkill } from '../../types'

export interface HutaoStats extends CharacterStats {
  element: string
}

export interface HutaoOptions extends CharacterOptions {
  stats: HutaoStats
}

export class Hutao extends Character {
  public readonly element: string
  public readonly passives: PassiveSkill[]

  constructor(options: HutaoOptions) {
    super(options)
    this.element = options.stats.element
    this.passives = options.passives ?? []
  }

  // 胡桃特殊技能：生命值越低伤害越高
  public attackLight() {
    const baseDamage = super.attackLight()
    if (this.stats.hp <= this.stats.maxHp * 0.5) {
      return Math.floor(baseDamage * 1.33) // 生命值低于50%时，伤害提升33%
    }
    return baseDamage
  }

  public attackHeavy() {
    const baseDamage = super.attackHeavy()
    if (this.stats.hp <= this.stats.maxHp * 0.5) {
      return Math.floor(baseDamage * 1.33) // 生命值低于50%时，伤害提升33%
    }
    return baseDamage
  }

  public castSkill() {
    if (this.stats.specialCharge < 25) return 0
    
    // 胡桃技能：消耗生命值进入灵体状态
    const hpCost = Math.floor(this.stats.maxHp * 0.15) // 消耗15%生命值
    this.stats.hp = Math.max(1, this.stats.hp - hpCost)
    
    this.currentAction = 'skill'
    this.stats.specialCharge -= 25
    
    // 进入灵体状态，攻击力提升
    const baseDamage = Math.floor(this.stats.attack * 2.2)
    if (this.stats.hp <= this.stats.maxHp * 0.5) {
      return Math.floor(baseDamage * 1.33) // 生命值低于50%时，伤害提升33%
    }
    return baseDamage
  }

  public castUltimate() {
    if (this.stats.specialCharge < this.stats.specialChargeMax) return 0
    
    this.currentAction = 'ultimate'
    this.stats.specialCharge = 0
    
    // 胡桃大招：魂炎·座敷牢，大范围火元素伤害
    const baseDamage = Math.floor(this.stats.attack * 4)
    if (this.stats.hp <= this.stats.maxHp * 0.5) {
      return Math.floor(baseDamage * 1.33) // 生命值低于50%时，伤害提升33%
    }
    return baseDamage
  }

  // 胡桃被动：蝶引 - 攻击充能提升
  public hasPassive(key: string): boolean {
    return this.passives.some(passive => passive.key === key)
  }

  public getPassiveDescription(key: string): string | undefined {
    const passive = this.passives.find(p => p.key === key)
    return passive?.description
  }
}
