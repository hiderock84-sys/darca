import sharp from 'sharp'
import { existsSync } from 'node:fs'

const jobs = [
  { in: 'tmp-imgs/fam_02.png', out: 'src/assets/manual/facility.webp', w: 1000 },
  { in: 'tmp-imgs/fam_alcohol.jpg', out: 'src/assets/manual/family-main.webp', w: 1280 },
]

for (const j of jobs) {
  if (!existsSync(j.in)) {
    console.log('MISSING INPUT', j.in)
    continue
  }
  await sharp(j.in).resize({ width: j.w }).webp({ quality: 82 }).toFile(j.out)
  console.log('WROTE', j.out, existsSync(j.out))
}
