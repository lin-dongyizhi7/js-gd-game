import { Vector3 } from 'three'
import type { CharacterKey, CharacterStats } from '../types'
import { Character } from './Character'

const base: CharacterStats = {
  maxHp: 100,
  hp: 100,
  attack: 10,
  defense: 2,
  moveSpeed: 0.12,
  jumpPower: 4.5,
  specialCharge: 0,
  specialChargeMax: 100,
}

function statsFor(key: CharacterKey): CharacterStats {
  switch (key) {
    case 'ninja':
      return { ...base, hp: 90, maxHp: 90, attack: 9, moveSpeed: 0.16, jumpPower: 5.2 }
    case 'knight':
      return { ...base, hp: 130, maxHp: 130, attack: 12, defense: 4, moveSpeed: 0.10, jumpPower: 4.2 }
    case 'mage':
      return { ...base, hp: 100, maxHp: 100, attack: 11, defense: 1, moveSpeed: 0.12, jumpPower: 4.8, specialChargeMax: 120 }
    case 'cpu':
    default:
      return { ...base }
  }
}

export function createCharacter(key: CharacterKey, teamId: number, spawn: Vector3): Character {
  const stats = statsFor(key)
  const c = new Character({ name: key, stats, teamId, spawnPosition: spawn })
  return c
}


