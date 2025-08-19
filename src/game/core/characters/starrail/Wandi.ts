import { Character, CharacterOptions } from '../Character'
import type { CharacterStats, PassiveSkill } from '../../types'

export interface WandiStats extends CharacterStats {
  element: string
}

export interface WandiOptions extends CharacterOptions {
  stats: WandiStats
}

export class Wandi extends Character {
  public readonly element: string
  public readonly passives: PassiveSkill[]
  private multiKillStacks: number = 0
  private readonly maxMultiKillStacks: number = 2
  private multiKillTimer: number | null = null
  private readonly multiKillDuration: number = 4000 // 4秒

  constructor(options: WandiOptions) {
    super(options)
    this.element = options.stats.element
    this.passives = options.passives ?? []
  }

  // 万敌技能：万死无悔
  public castSkill() {
    if (this.stats.specialCharge < 25) return 0
    
    this.currentAction = 'skill'
    this.stats.specialCharge -= 25
    
    // 对范围内所有敌人造成物理伤害，降低目标10%防御力，持续3秒
    const baseDamage = Math.floor(this.stats.attack * 2.2)
    
    return baseDamage
  }

  public castUltimate() {
    if (this.stats.specialCharge < this.stats.specialChargeMax) return 0
    
    this.currentAction = 'ultimate'
    this.stats.specialCharge = 0
    
    // 万敌大招：诛天焚骨的王座
    // 对单个目标造成物理伤害，若目标防御力被降低，额外造成150%物理伤害
    const baseDamage = Math.floor(this.stats.attack * 4)
    
    // 这里需要目标系统支持，检查目标是否被降低防御力
    // 暂时返回基础伤害
    
    return baseDamage
  }

  // 万敌重击：破阵横扫
  public attackHeavy() {
    const baseDamage = super.attackHeavy()
    
    // 蓄力后施展大范围横扫，对扇形区域造成物理伤害，并击退轻型敌人
    // 命中2名及以上敌人时，自身攻击再提升10%，持续3秒
    
    return baseDamage
  }

  // 万敌被动：破敌之势 - 单次攻击命中2名及以上敌人时，自身攻击提升10%，持续4秒，可叠加2层
  public hasPassive(key: string): boolean {
    return this.passives.some(passive => passive.key === key)
  }

  public getPassiveDescription(key: string): string | undefined {
    const passive = this.passives.find(p => p.key === key)
    return passive?.description
  }

  // 处理多杀效果
  public handleMultiKill(hitCount: number) {
    if (hitCount >= 2) {
      this.addMultiKillStack()
    }
  }

  // 增加多杀层数
  private addMultiKillStack() {
    if (this.multiKillStacks < this.maxMultiKillStacks) {
      this.multiKillStacks++
    }
    
    // 重置定时器
    if (this.multiKillTimer) {
      clearTimeout(this.multiKillTimer)
    }
    
    this.multiKillTimer = window.setTimeout(() => {
      this.clearMultiKillStacks()
    }, this.multiKillDuration)
  }

  // 清除多杀层数
  private clearMultiKillStacks() {
    this.multiKillStacks = 0
    this.multiKillTimer = null
  }

  // 获取当前多杀层数
  public getMultiKillStacks(): number {
    return this.multiKillStacks
  }

  // 获取攻击力加成百分比
  public getAttackBuffPercentage(): number {
    return this.multiKillStacks * 10 // 每层10%
  }

  // 重写伤害计算，应用多杀加成
  public attackLight() {
    const baseDamage = super.attackLight()
    const buffedDamage = Math.floor(baseDamage * (1 + this.multiKillStacks * 0.1))
    return buffedDamage
  }

  public attackHeavy() {
    const baseDamage = super.attackHeavy()
    const buffedDamage = Math.floor(baseDamage * (1 + this.multiKillStacks * 0.1))
    return buffedDamage
  }

  public castSkill() {
    const baseDamage = super.castSkill()
    const buffedDamage = Math.floor(baseDamage * (1 + this.multiKillStacks * 0.1))
    return buffedDamage
  }

  public castUltimate() {
    const baseDamage = super.castUltimate()
    const buffedDamage = Math.floor(baseDamage * (1 + this.multiKillStacks * 0.1))
    return buffedDamage
  }

  // 获取多杀状态剩余时间
  public getMultiKillRemainingTime(): number {
    if (this.multiKillStacks === 0 || !this.multiKillTimer) {
      return 0
    }
    // 这里需要更精确的时间计算，暂时返回0
    return 0
  }

  // 清理资源
  public destroy() {
    if (this.multiKillTimer) {
      clearTimeout(this.multiKillTimer)
      this.multiKillTimer = null
    }
  }
}
