import puppeteer from 'puppeteer'
const browser = await puppeteer.launch({ headless: 'new', protocolTimeout: 180000, args: ['--no-sandbox','--disable-setuid-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1000, height: 1300, deviceScaleFactor: 1 })
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0', timeout: 60000 })
await new Promise(r => setTimeout(r, 1500))
// A4 height at 96dpi = 1122.5px. Measure each sheet's natural content height.
const rows = await page.$$eval('.sheet', els => els.map((el, i) => {
  const prevH = el.style.height
  el.style.height = 'auto'
  const content = Math.round(el.getBoundingClientRect().height)
  el.style.height = prevH
  const t = el.querySelector('.chapter-head__title, .cover__title, .story__title, .promise__title, .toc__title, .spec-head__title, .qa-index__title')
  const label = (t?.textContent || el.className).replace(/\s+/g,' ').slice(0,26)
  return { i, content, label }
}))
const A4 = 1122
let low = 0
for (const r of rows) {
  const pct = Math.round((r.content / A4) * 100)
  const flag = r.content > A4 ? ' OVER!' : (pct < 80 ? ' <-- LOW' : '')
  if (pct < 80) low++
  console.log(`P${String(r.i).padStart(2)} ${String(r.content).padStart(4)}px ${String(pct).padStart(3)}%${flag}  ${r.label}`)
}
console.log(`\nTotal sheets: ${rows.length} | under 80% full: ${low}`)
await browser.close()
