// 冊子で使用するビジュアル（WebP・最適化済み）。
// Vite が各画像をハッシュ付き相対URLとしてバンドルします。
import coverHero from './cover-hero.webp'
import storyNight from './story-night.webp'
import handsSupport from './hands-support.webp'
import calmThread from './calm-thread.webp'
import seedlingDawn from './seedling-dawn.webp'
import pathFork from './path-fork.webp'
import boundary from './boundary.webp'
import familyCircle from './family-circle.webp'
import walkingTogether from './walking-together.webp'

export const img = {
  coverHero,
  storyNight,
  handsSupport,
  calmThread,
  seedlingDawn,
  pathFork,
  boundary,
  familyCircle,
  walkingTogether,
} as const

export type ImageKey = keyof typeof img
