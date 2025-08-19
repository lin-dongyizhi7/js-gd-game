import { Character, CharacterOptions } from '../Character'
import type { CharacterStats, PassiveSkill } from '../../types'

export interface DanhengStats extends CharacterStats {
  element: string
}

export interface DanhengOptions extends CharacterOptions {
  stats: DanhengStats
}

export class Danheng extends Character {
  public readonly element: string
  public readonly passives: PassiveSkill[]
  private windMarkedTargets: Set<string> = new Set()

  constructor(options: DanhengOptions) {
    super(options)
    this.element = options.stats.element
    this.passives = options.passives ?? []
  }

  // 丹恒技能：渡风一击
  public castSkill() {
    if (this.stats.specialCharge < 25) return 0

    this.currentAction = 'skill'
    this.stats.specialCharge -= 25

    // 快速突刺对路径上敌人造成风元素伤害
    const baseDamage = Math.floor(this.stats.attack * 2.2)

    // 命中后使目标移动速度降低20%，持续2秒
    // 这里需要目标系统支持，暂时返回基础伤害

    return baseDamage
  }

  public castUltimate() {
    if (this.stats.specialCharge < this.stats.specialChargeMax) return 0

    this.currentAction = 'ultimate'
    this.stats.specialCharge = 0

    // 丹恒大招：洞天幻化，长梦—觉
    const baseDamage = Math.floor(this.stats.attack * 4)

    // 若目标处于减速状态，伤害提升20%
    // 这里需要目标系统支持，暂时返回基础伤害

    return baseDamage
  }

  // 丹恒重击：朔风
  public attackHeavy() {
    const baseDamage = super.attackHeavy()

    // 短暂蓄力后突刺穿透直线上的敌人，造成风元素伤害
    // 若目标处于减速状态，本次伤害提高25%

    return baseDamage
  }

  // 丹恒被动：破敌锋芒 - 攻击命中敌人后额外获取能量
  public hasPassive(key: string): boolean {
    return this.passives.some(passive => passive.key === key)
  }

  public getPassiveDescription(key: string): string | undefined {
    const passive = this.passives.find(p => p.key === key)
    return passive?.description
  }

  // 重写能量获取，破敌锋芒被动提升
  public getEnergyGain(): number {
    let energyGain = 10
    if (this.hasPassive('charge_gain_up')) {
      energyGain += 3 // 攻击命中敌人后额外获取3点能量
    }
    return energyGain
  }

  // 标记风元素影响的敌人
  public markWindTarget(targetId: string) {
    this.windMarkedTargets.add(targetId)
  }

  // 移除风元素标记
  public removeWindMark(targetId: string) {
    this.windMarkedTargets.delete(targetId)
  }

  // 检查目标是否被风元素影响
  public isWindMarked(targetId: string): boolean {
    return this.windMarkedTargets.has(targetId)
  }

  // 获取风元素标记数量
  public getWindMarkCount(): number {
    return this.windMarkedTargets.size
  }
}
