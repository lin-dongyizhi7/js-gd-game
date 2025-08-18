import { Vector3 } from 'three'
import type { CharacterKey, CharacterStats, PassiveSkill } from '../types'
import { findByKey } from '../config'
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
  const cfg = findByKey(key)
  if (cfg) {
    return {
      maxHp: cfg.stats.maxHp,
      hp: cfg.stats.maxHp,
      attack: cfg.stats.attack,
      defense: cfg.stats.defense,
      moveSpeed: cfg.stats.moveSpeed,
      jumpPower: cfg.stats.jumpPower,
      specialCharge: 0,
      specialChargeMax: cfg.stats.specialChargeMax ?? 100,
    }
  }
  return { ...base }
}

function passivesFor(key: CharacterKey): PassiveSkill[] {
  const cfg = findByKey(key)
  return cfg?.passives ?? []
}

export function createCharacter(key: CharacterKey, teamId: number, spawn: Vector3): Character {
  const stats = statsFor(key)
  const passives = passivesFor(key)
  const c = new Character({ name: key, stats, teamId, spawnPosition: spawn, passives })
  // 简单被动即时生效
  if (passives.some(p => p.key === 'move_speed_up')) {
    c.stats.moveSpeed *= 1.1
  }
  if (passives.some(p => p.key === 'defense_up')) {
    c.stats.defense += 1
  }
  return c
}


