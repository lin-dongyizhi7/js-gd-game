export type GameMode = 'solo' | 'pvp'

export type SceneKey = 'dojo' | 'city' | 'forest'

export type CharacterKey = string

export interface CharacterStats {
  maxHp: number
  hp: number
  attack: number
  defense: number
  moveSpeed: number
  jumpPower: number
  specialCharge: number
  specialChargeMax: number
}

export interface PassiveSkill {
  key: string
  name: string
  description: string
}

export interface InputState {
  moveX: number
  jump: boolean
  light: boolean
  heavy: boolean
  skill: boolean
  ultimate: boolean
}

export interface UpdateContext {
  deltaSeconds: number
}


