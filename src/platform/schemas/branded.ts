/**
 * Type aliases for domain IDs.
 * Using simple string types for compatibility with data files.
 */

export type CardId = string
export type EnemyId = string
export type WikiId = string
export type CivilizationId = string
export type StorySlug = string

// ── Constructors (no-op for compatibility) ──

export function asCardId(s: string): CardId {
  return s
}

export function asEnemyId(s: string): EnemyId {
  return s
}

export function asWikiId(s: string): WikiId {
  return s
}

export function asCivilizationId(s: string): CivilizationId {
  return s
}

export function asStorySlug(s: string): StorySlug {
  return s
}

// ── Type Guards ──

export function isCardId(s: string): s is CardId {
  return s.startsWith("char-")
}

export function isEnemyId(s: string): s is EnemyId {
  return s.length > 0
}

export function isWikiId(s: string): s is WikiId {
  return s.length > 0
}

export function isCivilizationId(s: string): s is CivilizationId {
  return s.length > 0
}

export function isStorySlug(s: string): s is StorySlug {
  return /^[\da-z-]+$/.test(s)
}
