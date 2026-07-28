import sharp from 'sharp'

// 公式ロゴ（ネイビー on 白背景）→ 白抜き（白い図柄・透過背景）。
// しきい値でロゴ形状を二値マスク化し、手動でRGBA(白+アルファ)を構築（寸法ズレ回避）。
for (const n of ['logo_en', 'logo_ja']) {
  const input = `tmp-imgs/logo/${n}.png`
  const { data, info } = await sharp(input)
    .grayscale()
    .threshold(244)
    .negate()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const rgba = Buffer.alloc(width * height * 4)
  for (let p = 0; p < width * height; p++) {
    rgba[p * 4] = 255
    rgba[p * 4 + 1] = 255
    rgba[p * 4 + 2] = 255
    rgba[p * 4 + 3] = data[p * channels]
  }
  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .resize({ width: 900 })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(`src/assets/manual/${n}_white.webp`)
  console.log('wrote', `${n}_white.webp`, `src=${width}x${height} ch=${channels}`)
}
