import { Character, CharacterOptions } from '../Character'
import type { CharacterStats, PassiveSkill } from '../../types'

export interface HuangquanStats extends CharacterStats {
  element: string
}

export interface HuangquanOptions extends CharacterOptions {
  stats: HuangquanStats
}

export class Huangquan extends Character {
  public readonly element: string
  public readonly passives: PassiveSkill[]
  private isTransformed: boolean = false
  private transformTimer: number | null = null
  private readonly transformDuration: number = 5000 // 5秒
  private markedTargets: Set<string> = new Set()

  constructor(options: HuangquanOptions) {
    super(options)
    this.element = options.stats.element
    this.passives = options.passives ?? []
  }

  // 黄泉技能：八雷飞渡
  public castSkill() {
    if (this.stats.specialCharge < 25) return 0

    this.currentAction = 'skill'
    this.stats.specialCharge -= 25

    // 对单个敌人造成雷元素伤害，命中后附加「集真赤」标记
    const baseDamage = Math.floor(this.stats.attack * 2.2)

    // 集真赤标记持续4秒，标记期间目标受到的雷元素伤害提升15%
    // 这里需要目标系统支持，暂时返回基础伤害

    return baseDamage
  }

  public castUltimate() {
    if (this.stats.specialCharge < this.stats.specialChargeMax) return 0

    this.currentAction = 'ultimate'
    this.stats.specialCharge = 0

    // 黄泉大招：残梦尽染，一刀缭断
    const baseDamage = Math.floor(this.stats.attack * 4)

    // 进入雷神形态
    this.enterThunderForm()

    return baseDamage
  }

  // 黄泉重击：四相断我
  public attackHeavy() {
    const baseDamage = super.attackHeavy()

    // 蓄力斩击，对单体造成雷元素伤害
    // 若目标带有「集真赤」标记，本次伤害额外提高30%

    return baseDamage
  }

  // 进入雷神形态
  private enterThunderForm() {
    this.isTransformed = true

    // 设置定时器，5秒后自动恢复
    if (this.transformTimer) {
      clearTimeout(this.transformTimer)
    }

    this.transformTimer = window.setTimeout(() => {
      this.exitThunderForm()
    }, this.transformDuration)
  }

  // 退出雷神形态
  private exitThunderForm() {
    this.isTransformed = false
    this.transformTimer = null
  }

  // 手动触发形态转换
  public triggerTransform() {
    if (!this.isTransformed) {
      this.enterThunderForm()
    }
  }

  // 检查是否处于雷神形态
  public isThunderForm(): boolean {
    return this.isTransformed
  }

  // 获取形态剩余时间
  public getTransformRemainingTime(): number {
    if (!this.isTransformed || !this.transformTimer) {
      return 0
    }
    // 这里需要更精确的时间计算，暂时返回0
    return 0
  }

  // 黄泉被动：红叶时雨，万倾一空 - 对生命值低于50%的敌人，暴击伤害提升30%
  public hasPassive(key: string): boolean {
    return this.passives.some(passive => passive.key === key)
  }

  public getPassiveDescription(key: string): string | undefined {
    const passive = this.passives.find(p => p.key === key)
    return passive?.description
  }

  // 重写伤害计算，雷神形态下攻击力提升50%
  public attackLight() {
    const baseDamage = super.attackLight()
    if (this.isTransformed) {
      return Math.floor(baseDamage * 1.5) // 雷神形态下攻击力提升50%
    }
    return baseDamage
  }

  public attackHeavy() {
    const baseDamage = super.attackHeavy()
    if (this.isTransformed) {
      return Math.floor(baseDamage * 1.5) // 雷神形态下攻击力提升50%
    }
    return baseDamage
  }

  public castSkill() {
    const baseDamage = super.castSkill()
    if (this.isTransformed) {
      return Math.floor(baseDamage * 1.5) // 雷神形态下攻击力提升50%
    }
    return baseDamage
  }

  public castUltimate() {
    const baseDamage = super.castUltimate()
    if (this.isTransformed) {
      return Math.floor(baseDamage * 1.5) // 雷神形态下攻击力提升50%
    }
    return baseDamage
  }

  // 标记目标
  public markTarget(targetId: string) {
    this.markedTargets.add(targetId)
  }

  // 移除标记
  public removeMark(targetId: string) {
    this.markedTargets.delete(targetId)
  }

  // 检查目标是否被标记
  public isTargetMarked(targetId: string): boolean {
    return this.markedTargets.has(targetId)
  }

  // 清理资源
  public destroy() {
    if (this.transformTimer) {
      clearTimeout(this.transformTimer)
      this.transformTimer = null
    }
  }
}
