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
import facility from './facility.webp'
// 公式サイトの実写（加工なし。顔はモザイク／後ろ姿／職員のみでプライバシー配慮）
import seminar from './seminar.webp'
import consultHand from './consult-hand.webp'
import entranceBack from './entrance-back.webp'
import staffSmile from './staff-smile.webp'

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
  facility,
  seminar,
  consultHand,
  entranceBack,
  staffSmile,
} as const

export type ImageKey = keyof typeof img
