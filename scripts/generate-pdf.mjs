/**
 * 完成版マニュアルの A4 PDF を生成するスクリプト（配布・ダウンロード用）。
 *
 * ブラウザの「印刷」機能は、余白やヘッダー/フッターの設定に依存してA4に
 * 収まらないことがあるため、Puppeteer で余白ゼロ・A4 固定の PDF を生成し、
 * dist/ に出力します。生成した PDF はサイトと同じ階層に置かれ、
 * アプリの「PDFをダウンロード」ボタンからそのまま取得できます。
 *
 * 使い方:
 *   1) npm run build
 *   2) npm run preview -- --port 4173   （別プロセスで起動）
 *   3) npm i --no-save puppeteer && node scripts/generate-pdf.mjs
 */
import puppeteer from 'puppeteer'

const url = process.argv[2] || 'http://localhost:4173/'
const out = process.argv[3] || 'dist/manual.pdf'

const browser = await puppeteer.launch({
  headless: 'new',
  protocolTimeout: 180000,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})
const page = await browser.newPage()
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
// すべての画像が確実に読み込まれるまで待つ（連続フローで下方の画像も含む）
await page.evaluate(async () => {
  const imgs = Array.from(document.images)
  await Promise.all(
    imgs.map((img) =>
      img.complete && img.naturalHeight > 0
        ? Promise.resolve()
        : new Promise((res) => {
            img.loading = 'eager'
            img.addEventListener('load', res, { once: true })
            img.addEventListener('error', res, { once: true })
          }),
    ),
  )
})
await new Promise((r) => setTimeout(r, 800))

await page.pdf({
  path: out,
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: false,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
})

await browser.close()
console.log(`PDF generated: ${out}`)
