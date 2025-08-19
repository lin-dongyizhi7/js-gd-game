import { Character, CharacterOptions } from '../Character'
import type { CharacterStats, PassiveSkill } from '../../types'

export interface JingliuStats extends CharacterStats {
  element: string
}

export interface JingliuOptions extends CharacterOptions {
  stats: JingliuStats
}

export class Jingliu extends Character {
  public readonly element: string
  public readonly passives: PassiveSkill[]
  private isSwordOutState: boolean = false
  private swordOutTimer: number | null = null
  private readonly swordOutDuration: number = 8000 // 8秒
  private frozenTargets: Set<string> = new Set()

  constructor(options: JingliuOptions) {
    super(options)
    this.element = options.stats.element
    this.passives = options.passives ?? []
  }

  // 镜流技能：昙华生灭，天河泻梦
  public castSkill() {
    if (this.stats.specialCharge < 25) return 0
    
    this.currentAction = 'skill'
    this.stats.specialCharge -= 25
    
    // 对单个敌人造成冰元素伤害，有50%概率使目标「冻伤」
    const baseDamage = Math.floor(this.stats.attack * 2.2)
    
    // 冻伤效果每3秒受到30%冰元素伤害，持续5秒
    // 这里需要目标系统支持，暂时返回基础伤害
    
    return baseDamage
  }

  public castUltimate() {
    if (this.stats.specialCharge < this.stats.specialChargeMax) return 0
    
    this.currentAction = 'ultimate'
    this.stats.specialCharge = 0
    
    // 镜流大招：澹月转魄
    // 进入「剑出无尘」状态，持续8秒
    this.enterSwordOutState()
    
    // 期间普通攻击变为范围伤害，造成150%冰元素伤害，技能冷却时间缩短30%
    const baseDamage = Math.floor(this.stats.attack * 4)
    
    return baseDamage
  }

  // 镜流重击：寒川映月
  public attackHeavy() {
    const baseDamage = super.attackHeavy()
    
    // 蓄力斩击，对前方造成冰元素伤害
    // 若处于「剑出无尘」状态，本次伤害额外提高25%
    if (this.isSwordOutState) {
      return Math.floor(baseDamage * 1.25)
    }
    
    return baseDamage
  }

  // 进入剑出无尘状态
  private enterSwordOutState() {
    this.isSwordOutState = true
    
    // 设置定时器，8秒后自动退出
    if (this.swordOutTimer) {
      clearTimeout(this.swordOutTimer)
    }
    
    this.swordOutTimer = window.setTimeout(() => {
      this.exitSwordOutState()
    }, this.swordOutDuration)
  }

  // 退出剑出无尘状态
  private exitSwordOutState() {
    this.isSwordOutState = false
    this.swordOutTimer = null
  }

  // 手动触发剑出无尘状态
  public triggerSwordOutState() {
    if (!this.isSwordOutState) {
      this.enterSwordOutState()
    }
  }

  // 检查是否处于剑出无尘状态
  public isSwordOutStateActive(): boolean {
    return this.isSwordOutState
  }

  // 镜流被动：霜天剑心 - 处于「剑出无尘」状态时，暴击率提升15%，造成的冰元素伤害提升20%
  public hasPassive(key: string): boolean {
    return this.passives.some(passive => passive.key === key)
  }

  public getPassiveDescription(key: string): string | undefined {
    const passive = this.passives.find(p => p.key === key)
    return passive?.description
  }

  // 重写伤害计算，剑出无尘状态下冰元素伤害提升20%
  public attackLight() {
    const baseDamage = super.attackLight()
    if (this.isSwordOutState) {
      return Math.floor(baseDamage * 1.2) // 剑出无尘状态下伤害提升20%
    }
    return baseDamage
  }

  public castSkill() {
    const baseDamage = super.castSkill()
    if (this.isSwordOutState) {
      return Math.floor(baseDamage * 1.2) // 剑出无尘状态下伤害提升20%
    }
    return baseDamage
  }

  // 获取剑出无尘状态剩余时间
  public getSwordOutRemainingTime(): number {
    if (!this.isSwordOutState || !this.swordOutTimer) {
      return 0
    }
    // 这里需要更精确的时间计算，暂时返回0
    return 0
  }

  // 冻结目标
  public freezeTarget(targetId: string) {
    this.frozenTargets.add(targetId)
  }

  // 解冻目标
  public unfreezeTarget(targetId: string) {
    this.frozenTargets.delete(targetId)
  }

  // 检查目标是否被冻结
  public isTargetFrozen(targetId: string): boolean {
    return this.frozenTargets.has(targetId)
  }

  // 获取冻结目标数量
  public getFrozenTargetCount(): number {
    return this.frozenTargets.size
  }

  // 清理资源
  public destroy() {
    if (this.swordOutTimer) {
      clearTimeout(this.swordOutTimer)
      this.swordOutTimer = null
    }
  }
}
