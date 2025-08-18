export type GameMode = 'solo' | 'pvp'

export type SceneKey = 'dojo' | 'city' | 'forest'

export type CharacterKey = 'ninja' | 'knight' | 'mage' | 'cpu'

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


