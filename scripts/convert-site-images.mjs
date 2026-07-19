import sharp from 'sharp'
import { existsSync } from 'node:fs'

const jobs = [
  { in: 'tmp-imgs/fam_02.png', out: 'src/assets/manual/facility.webp', w: 1000 },
  { in: 'tmp-imgs/hero_alcohol.jpg', out: 'src/assets/manual/seminar.webp', w: 1280 },
  { in: 'tmp-imgs/t1.jpg', out: 'src/assets/manual/consult-hand.webp', w: 1100 },
  { in: 'tmp-imgs/t2.jpg', out: 'src/assets/manual/entrance-back.webp', w: 1100 },
  { in: 'tmp-imgs/t3.jpg', out: 'src/assets/manual/staff-smile.webp', w: 1100 },
]

for (const j of jobs) {
  if (!existsSync(j.in)) {
    console.log('MISSING INPUT', j.in)
    continue
  }
  await sharp(j.in).resize({ width: j.w }).webp({ quality: 82 }).toFile(j.out)
  console.log('WROTE', j.out, existsSync(j.out))
}
