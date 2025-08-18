import starrail from './starrail.json'
import genshin from './genshin.json'
import type { CharacterConfig, GameId } from './types'

export const allCharacters: CharacterConfig[] = [...starrail, ...genshin]

export function listByGame(game: GameId): CharacterConfig[] {
	return allCharacters.filter(c => c.game === game)
}

export function findByKey(key: string): CharacterConfig | undefined {
	return allCharacters.find(c => c.key === key)
}


