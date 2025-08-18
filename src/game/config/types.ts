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

export interface CharacterConfig {
	game: GameId
	key: string
	id: string
	name: string
	avatar: string
	model: string
	stats: StatsConfig
	passives?: SkillConfig[]
	skills?: SkillConfig[]
}


