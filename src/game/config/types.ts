export type GameId = 'starrail' | 'genshin'

export interface SkillConfig {
	key: string
	name: string
	description: string
}

export interface StatsConfig {
	maxHp: number
	attack: number
	defense: number
	moveSpeed: number
	jumpPower: number
	specialChargeMax?: number
}

export interface Character {
  game: string
  key: string
  name: string
  element: string
  avatar: string
  model: string
  model2?: string // 第二形态模型（如黄泉开大后的形态）
  transform_duration?: number // 形态转换持续时间（秒）
  stats: {
    hp: number
    atk: number
    def: number
    speed?: number
    crit_rate?: number
    crit_dmg?: number
  }
  passives: Passive[]
  skills: Skill[]
}

export interface Passive {
  key: string
  name: string
  description: string
}

export interface Skill {
  key: string
  name: string
  description: string
}

export type CharacterKey = string
export type GameType = 'genshin' | 'starrail'


