/**
 * 裏表紙の公式サイトQRコード（SVG）を生成するスクリプト。
 *
 * 使い方:
 *   npm run qr
 *     → src/assets/manual/qr-family.svg を再生成します。
 *
 * URL を変更したい場合は下記 URL 定数を編集するか、引数で渡してください:
 *   node scripts/generate-qr.mjs "https://example.com/" src/assets/manual/qr-family.svg
 */
import QRCode from 'qrcode'

const url = process.argv[2] || 'https://new-s-darc.sakura.ne.jp/family/'
const out = process.argv[3] || 'src/assets/manual/qr-family.svg'

await QRCode.toFile(out, url, {
  type: 'svg',
  margin: 1,
  color: { dark: '#0d1b34', light: '#ffffff' },
  errorCorrectionLevel: 'M',
})

console.log(`QR generated: ${out} -> ${url}`)
