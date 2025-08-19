import { Character, CharacterOptions } from '../Character'
import type { CharacterStats, PassiveSkill } from '../../types'

export interface KafkaStats extends CharacterStats {
  element: string
}

export interface KafkaOptions extends CharacterOptions {
  stats: KafkaStats
}

export class Kafka extends Character {
  public readonly element: string
  public readonly passives: PassiveSkill[]
  private shockedTargets: Set<string> = new Set()
  private shockDuration: Map<string, number> = new Map() // 目标ID -> 剩余时间

  constructor(options: KafkaOptions) {
    super(options)
    this.element = options.stats.element
    this.passives = options.passives ?? []
  }

  // 卡芙卡技能：月光摩挲连绵
  public castSkill() {
    if (this.stats.specialCharge < 25) return 0
    
    this.currentAction = 'skill'
    this.stats.specialCharge -= 25
    
    // 对单个敌人造成雷元素伤害，附加「触电」效果
    const baseDamage = Math.floor(this.stats.attack * 2.2)
    
    // 触电效果每2秒造成50%雷元素伤害，持续6秒
    // 这里需要目标系统支持，暂时返回基础伤害
    
    return baseDamage
  }

  public castUltimate() {
    if (this.stats.specialCharge < this.stats.specialChargeMax) return 0
    
    this.currentAction = 'ultimate'
    this.stats.specialCharge = 0
    
    // 卡芙卡大招：悲剧尽头的颤音
    // 对所有带有「触电」效果的敌人造成雷元素伤害，并引爆触电效果
    const baseDamage = Math.floor(this.stats.attack * 4)
    
    // 引爆触电效果，额外造成一次相当于剩余持续伤害总量50%的雷元素伤害
    const shockDamage = this.getTotalShockDamage()
    const totalDamage = baseDamage + Math.floor(shockDamage * 0.5)
    
    // 引爆后清除所有触电效果
    this.clearAllShockEffects()
    
    return totalDamage
  }

  // 卡芙卡重击：温柔亦同残酷
  public attackHeavy() {
    const baseDamage = super.attackHeavy()
    
    // 蓄力释放雷场，对小范围内敌人造成雷元素伤害
    // 若目标带有「触电」，引爆造成额外100%雷元素伤害
    
    return baseDamage
  }

  // 卡芙卡被动：触电共鸣 - 由自身施加的「触电」效果造成的伤害提升25%
  public hasPassive(key: string): boolean {
    return this.passives.some(passive => passive.key === key)
  }

  public getPassiveDescription(key: string): string | undefined {
    const passive = this.passives.find(p => p.key === key)
    return passive?.description
  }

  // 添加触电效果
  public addShockEffect(targetId: string, duration: number = 6000) {
    this.shockedTargets.add(targetId)
    this.shockDuration.set(targetId, duration)
  }

  // 移除触电效果
  public removeShockEffect(targetId: string) {
    this.shockedTargets.delete(targetId)
    this.shockDuration.delete(targetId)
  }

  // 检查目标是否处于触电状态
  public isTargetShocked(targetId: string): boolean {
    return this.shockedTargets.has(targetId)
  }

  // 获取触电目标数量
  public getShockedTargetCount(): number {
    return this.shockedTargets.size
  }

  // 获取触电效果总伤害
  public getTotalShockDamage(): number {
    let totalDamage = 0
    this.shockedTargets.forEach(targetId => {
      const remainingTime = this.shockDuration.get(targetId) || 0
      const shockTicks = Math.ceil(remainingTime / 2000) // 每2秒一次
      const shockDamage = Math.floor(this.stats.attack * 0.5) // 50%攻击力
      totalDamage += shockDamage * shockTicks
    })
    
    // 触电共鸣被动：伤害提升25%
    if (this.hasPassive('electro_dot_enhance')) {
      totalDamage = Math.floor(totalDamage * 1.25)
    }
    
    return totalDamage
  }

  // 清除所有触电效果
  private clearAllShockEffects() {
    this.shockedTargets.clear()
    this.shockDuration.clear()
  }

  // 更新触电效果时间
  public updateShockEffects(deltaTime: number) {
    this.shockDuration.forEach((duration, targetId) => {
      const newDuration = duration - deltaTime
      if (newDuration <= 0) {
        this.removeShockEffect(targetId)
      } else {
        this.shockDuration.set(targetId, newDuration)
      }
    })
  }

  // 获取触电效果剩余时间
  public getShockRemainingTime(targetId: string): number {
    return this.shockDuration.get(targetId) || 0
  }
}
