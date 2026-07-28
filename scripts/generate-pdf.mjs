/**
 * 完成版マニュアルの A4 PDF を生成するスクリプト（配布・ダウンロード用）。
 *
 * ブラウザの「印刷」機能は、余白やヘッダー/フッターの設定に依存してA4に
 * 収まらないことがあるため、Puppeteer で余白ゼロ・A4 固定の PDF を生成します。
 *
 * 使い方:
 *   npm run pdf
 *     → build 済みの dist/ を Vite preview で自動起動し、
 *       dist/manual.pdf と public/manual.pdf を生成します。
 *
 * 既存プロセスのサーバに対して生成したい場合:
 *   node scripts/generate-pdf.mjs http://localhost:4173/ dist/manual.pdf
 */
import { copyFileSync } from 'node:fs'
import { preview } from 'vite'
import puppeteer from 'puppeteer'

const argUrl = process.argv[2]
const out = process.argv[3] || 'dist/manual.pdf'
const alsoCopyTo = 'public/manual.pdf'

// 引数でURLが渡された場合はそのサーバを使う。無ければ Vite preview を自動起動。
let server = null
let url = argUrl
if (!url) {
  server = await preview({ preview: { port: 4173, strictPort: false } })
  url = server.resolvedUrls?.local?.[0] ?? 'http://localhost:4173/'
}

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 180000,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

try {
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
  console.log(`PDF generated: ${out}`)

  // 配布サイトから直接ダウンロードできるよう public/ にも配置
  if (out !== alsoCopyTo) {
    copyFileSync(out, alsoCopyTo)
    console.log(`Copied to: ${alsoCopyTo}`)
  }
} finally {
  await browser.close()
  if (server) await server.close()
}
