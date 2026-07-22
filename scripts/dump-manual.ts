/**
 * src/data/manual.ts の全原稿を JSON に書き出す（Word生成スクリプトが読む）。
 *   npx tsx scripts/dump-manual.ts scripts/manual.json
 */
import { writeFileSync } from 'node:fs'
import * as M from '../src/data/manual'

const out = process.argv[2] || 'scripts/manual.json'

// 章→扉写真の対応（App.tsx の実装に合わせる）
const chapterImages: Record<string, string | null> = {
  ch1: 'calm-thread',
  ch2: 'seedling-dawn',
  ch3: 'path-fork',
  ch4: null,
  ch5: null,
  ch6: null,
  ch7: 'consult-hand',
  ch8: 'boundary',
  ch9: null,
  ch10: null,
  ch11: 'seminar',
}

const data = {
  org: M.org,
  cover: M.cover,
  openingStory: M.openingStory,
  preface: M.preface,
  chapters: [
    M.ch1,
    M.ch2,
    M.ch3,
    M.ch4,
    M.ch5,
    M.ch6,
    M.ch7,
    M.ch8,
    M.ch9,
    M.ch10,
    M.ch11,
  ],
  walkReason: M.walkReason,
  promise: M.promise,
  backCover: M.backCover,
  chapterImages,
  images: {
    cover: 'cover-hero',
    story: 'story-night',
    facility: 'facility',
    walking: 'walking-together',
  },
}

writeFileSync(out, JSON.stringify(data, null, 2))
console.log(`dumped: ${out}`)
