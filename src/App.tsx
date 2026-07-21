import type { ReactNode } from 'react'
import { Icon, type IconName } from './components/Icons'
import {
  org,
  cover,
  openingStory,
  preface,
  toc,
  ch1,
  ch2,
  ch3,
  ch4,
  ch5,
  ch6,
  ch7,
  ch8,
  ch9,
  ch10,
  ch11,
  promise,
  backCover,
  spec,
  type Point,
  type Column,
} from './data/manual'
import { img } from './assets/manual/images'

/* =============================================================
   Page numbering is handled entirely in CSS (counter on .sheet),
   so no render-time side effects are needed here.
   ============================================================= */
function Sheet({
  className = '',
  runhead,
  pageLabel,
  hideNo = false,
  children,
}: {
  className?: string
  runhead?: string
  pageLabel?: string
  hideNo?: boolean
  children: ReactNode
}) {
  return (
    <section className={`sheet ${className}`}>
      {runhead && (
        <div className="runhead">
          <span className="runhead__brand">相模原ダルク｜家族回復支援実践マニュアル</span>
          <span>{runhead}</span>
        </div>
      )}
      <div className="sheet__body">{children}</div>
      {!hideNo && (
        <div className="pagenum">
          <span>{pageLabel}</span>
          <span className="pagenum__no" />
        </div>
      )}
    </section>
  )
}

// 章ごとのアクセントカラー（特集扉のような差別化・落ち着いた上質トーン）
const CHAPTER_ACCENTS = [
  '#d69a5c', // 1 依存症とは
  '#2f9e6b', // 2 家族の病気
  '#3a86c4', // 3 イネーブリング
  '#c9683e', // 4 家へ入れない
  '#2a9d8f', // 5 帰宅時対応
  '#6a7fd0', // 6 電話・病院・警察
  '#c05c7e', // 7 やってはいけない
  '#4a8fd0', // 8 やるべきこと
  '#e0a13f', // 9 ケース
  '#8a6fc0', // 10 Q&A
  '#2f9e6b', // 11 家族会
] as const

function chapterAccent(no: string): string | undefined {
  const n = parseInt(no.replace(/[^0-9]/g, ''), 10)
  return Number.isFinite(n) && n >= 1
    ? CHAPTER_ACCENTS[(n - 1) % CHAPTER_ACCENTS.length]
    : undefined
}

function ChapterHead({
  no,
  title,
  catch: catchCopy,
}: {
  no: string
  title: string
  catch: string
}) {
  const accent = chapterAccent(no)
  return (
    <header className="chapter-head">
      <span className="chapter-head__no">
        <Icon name="compass" className="icon-inline" />
        {no}
      </span>
      <h2 className="chapter-head__title">{title}</h2>
      <p className="chapter-head__catch">{catchCopy}</p>
      <div
        className="chapter-head__rule"
        style={accent ? { background: accent } : undefined}
      />
    </header>
  )
}

function Lead({ lines }: { lines: readonly string[] }) {
  return (
    <>
      {lines.map((l) => (
        <p key={l} className="lead lead--muted">
          {l}
        </p>
      ))}
    </>
  )
}

function TextSection({
  heading,
  body,
}: {
  heading: string
  body: readonly string[]
}) {
  return (
    <div className="section-block">
      <h3 className="h3">{heading}</h3>
      {body.map((p) => (
        <p key={p} className="body-p">
          {p}
        </p>
      ))}
    </div>
  )
}

function Points({ items }: { items: readonly Point[] }) {
  return (
    <div className={`points points--${items.length}`}>
      {items.map((p) => (
        <div key={p.title} className="point">
          <span className="point__tag">POINT</span>
          <p className="point__title">{p.title}</p>
          <p className="point__body">{p.body}</p>
        </div>
      ))}
    </div>
  )
}

function ColumnBox({ data, green = false }: { data: Column; green?: boolean }) {
  return (
    <aside className={`column ${green ? 'column--green' : ''}`}>
      <span className="column__label">{data.label}</span>
      <p className="column__title">{data.title}</p>
      <div className="column__body">
        {data.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </aside>
  )
}

function ChapterOpener({
  no,
  title,
  catch: catchCopy,
  src,
  alt,
}: {
  no: string
  title: string
  catch: string
  src: string
  alt: string
}) {
  const accent = chapterAccent(no)
  return (
    <header className="opener">
      <img className="opener__bg" src={src} alt={alt} />
      <div className="opener__scrim" />
      {accent && <span className="opener__bar" style={{ background: accent }} />}
      <div className="opener__content">
        <span className="opener__no">
          <Icon name="compass" className="icon-inline" />
          {no}
        </span>
        <h2 className="opener__title">{title}</h2>
        <p className="opener__catch">{catchCopy}</p>
      </div>
    </header>
  )
}

function ChapterHero({
  src,
  alt,
  caption,
  size,
}: {
  src: string
  alt: string
  caption?: string
  size?: 'tall' | 'xtall'
}) {
  const cls = size === 'tall' ? 'hero hero--tall' : size === 'xtall' ? 'hero hero--xtall' : 'hero'
  return (
    <figure className={cls}>
      <img src={src} alt={alt} />
      {caption && <figcaption className="hero__cap">{caption}</figcaption>}
    </figure>
  )
}

/* =============================================================
   Front matter
   ============================================================= */

function CoverPage() {
  return (
    <Sheet className="sheet--cover" hideNo>
      <img className="cover__bg" src={img.facility} alt="" aria-hidden="true" />
      <div className="cover__scrim" />
      <div className="cover">
        <div className="cover__top">
          <div>
            <div className="cover__brand-logo">{org.brand}</div>
            <div className="cover__brand-sub">{org.subtitle}</div>
          </div>
          <span className="cover__edition">{cover.editionLabel}</span>
        </div>

        <div className="cover__center">
          <span className="cover__category">{cover.category}</span>
          <h1 className="cover__title">{cover.title}</h1>
          <div className="cover__accent" />
          <p className="cover__subtitle">{cover.subtitle}</p>
        </div>

        <div className="cover__bottom">
          <p className="cover__supply">{cover.supply}</p>
          <p className="cover__issuer">{cover.issuer}</p>
        </div>
      </div>
    </Sheet>
  )
}

function StoryPages() {
  const paras = openingStory.paragraphs
  const first = paras.slice(0, 4)
  const rest = paras.slice(4)
  const renderPara = (p: string) =>
    p.startsWith('「') ? (
      <p key={p} className="story__quote">
        {p}
      </p>
    ) : (
      <p key={p}>{p}</p>
    )
  return (
    <>
      <Sheet className="sheet--story" runhead="PROLOGUE" pageLabel="導入ストーリー">
        <p className="story__kicker">{openingStory.chapterLabel}</p>
        <h2 className="story__title">{openingStory.title}</h2>
        <figure className="hero hero--story">
          <img
            src={img.storyNight}
            alt="夜、玄関にともる暖かな灯りを外から静かに見たイメージ"
          />
        </figure>
        <p className="story__lead">{openingStory.lead}</p>
        <div className="story__body">{first.map(renderPara)}</div>
      </Sheet>

      <Sheet className="sheet--story" runhead="PROLOGUE" pageLabel="導入ストーリー">
        <div className="story__body">{rest.map(renderPara)}</div>
        <div className="story__closing">
          {openingStory.closing.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <ChapterHero
          src={img.entranceBack}
          alt="相模原ダルクの入口に立つご家族の後ろ姿。ここから回復の一歩が始まる"
          caption="相模原ダルクの玄関で ── どんな夜にも、次の朝はやってきます。ここから、一緒に。"
        />
      </Sheet>
    </>
  )
}

function PrefacePages() {
  return (
    <Sheet runhead={preface.chapterLabel} pageLabel="はじめに">
      <ChapterHead
        no={preface.chapterLabel}
        title={preface.title}
        catch="あなたは、悪くありません。"
      />
      {preface.paragraphs.map((p) => (
        <p key={p} className="body-p">
          {p}
        </p>
      ))}
      <div className="preface__pledge">{preface.pledge}</div>
    </Sheet>
  )
}

function TocPage() {
  return (
    <Sheet runhead="目次" pageLabel="目次">
      <div className="toc__head">
        <p className="toc__sub">{toc.subtitle}</p>
        <h2 className="toc__title">{toc.title}</h2>
      </div>

      <div className="toc__intro">
        {toc.intro.map((r) => (
          <div key={r.title} className="toc__intro-row">
            <span className="toc__intro-label">{r.label}</span>
            <span className="toc__intro-title">{r.title}</span>
          </div>
        ))}
      </div>

      <ul className="toc__list">
        {toc.chapters.map((c) => (
          <li key={c.no} className="toc__row">
            <span className="toc__no">{c.no}</span>
            <div>
              <p className="toc__ctitle">{c.title}</p>
              <p className="toc__desc">{c.desc}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="toc__intro" style={{ marginTop: '0.7rem', marginBottom: 0 }}>
        {toc.closing.map((r) => (
          <div key={r.title} className="toc__intro-row">
            <span className="toc__intro-label">{r.label}</span>
            <span className="toc__intro-title">{r.title}</span>
          </div>
        ))}
      </div>
    </Sheet>
  )
}

/* =============================================================
   Chapters (split across A4 sheets so nothing is clipped)
   ============================================================= */

function Ch1Pages() {
  const rh = `${ch1.no}\u3000${ch1.title}`
  return (
    <>
      <Sheet runhead={rh} pageLabel={ch1.no}>
        <ChapterOpener
          no={ch1.no}
          title={ch1.title}
          catch={ch1.catch}
          src={img.calmThread}
          alt="からまった糸がやがて一本の線へとほどけていく、混乱から理解へ向かうイメージ"
        />
        <Lead lines={ch1.lead} />
        {ch1.sections.map((s) => (
          <TextSection key={s.heading} heading={s.heading} body={s.body} />
        ))}
      </Sheet>

      <Sheet runhead={rh} pageLabel={ch1.no}>
        <Points items={ch1.points} />
        <div className="cycle">
          <p className="cycle__title">{ch1.cycle.title}</p>
          <ol className="cycle__steps">
            {ch1.cycle.steps.map((s, i) => (
              <li key={s.title} className="cycle__step">
                <span className="cycle__num">STEP {i + 1}</span>
                <span className="cycle__step-title">{s.title}</span>
                <span className="cycle__step-note">{s.note}</span>
              </li>
            ))}
          </ol>
          <p className="cycle__loop">↻ {ch1.cycle.caption}</p>
        </div>
        <ColumnBox data={ch1.column} green />
      </Sheet>
    </>
  )
}

function Ch2Pages() {
  const rh = `${ch2.no}\u3000${ch2.title}`
  return (
    <>
      <Sheet runhead={rh} pageLabel={ch2.no}>
        <ChapterOpener
          no={ch2.no}
          title={ch2.title}
          catch={ch2.catch}
          src={img.seedlingDawn}
          alt="朝の光の中で芽吹く小さな双葉。家族もまた回復できるという希望のイメージ"
        />
        <Lead lines={ch2.lead} />
        {ch2.sections.map((s) => (
          <TextSection key={s.heading} heading={s.heading} body={s.body} />
        ))}
      </Sheet>

      <Sheet runhead={rh} pageLabel={ch2.no}>
        <div className="checklist">
          <p className="checklist__title">{ch2.checklist.title}</p>
          <ul className="checklist__items">
            {ch2.checklist.items.map((it) => (
              <li key={it}>
                <span className="checklist__box" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
          <p className="checklist__caption">{ch2.checklist.caption}</p>
        </div>
        <Points items={ch2.points} />
        <ColumnBox data={ch2.column} green />
      </Sheet>
    </>
  )
}

function Ch3Pages() {
  const rh = `${ch3.no}\u3000${ch3.title}`
  return (
    <>
      <Sheet runhead={rh} pageLabel={ch3.no}>
        <ChapterHead no={ch3.no} title={ch3.title} catch={ch3.catch} />
        <Lead lines={ch3.lead} />
        {ch3.sections.map((s) => (
          <TextSection key={s.heading} heading={s.heading} body={s.body} />
        ))}
        <div className="cycle">
          <p className="cycle__title">イネーブリングの悪循環</p>
          <ol className="cycle__steps">
            {[
              { t: '問題が起きる', n: '借金・トラブル・約束違反' },
              { t: '家族が尻ぬぐい', n: '肩代わり・後始末・かばう' },
              { t: 'その場は収まる', n: '一時的な安心が生まれる' },
              { t: '本人は困らない', n: '痛みを感じず、行動が変わらない' },
            ].map((s, i) => (
              <li key={s.t} className="cycle__step">
                <span className="cycle__num">STEP {i + 1}</span>
                <span className="cycle__step-title">{s.t}</span>
                <span className="cycle__step-note">{s.n}</span>
              </li>
            ))}
          </ol>
          <p className="cycle__loop">
            ↻ この輪が回り続ける限り、本人は「困らない」ため、回復に向き合えません。
          </p>
        </div>
      </Sheet>

      <Sheet runhead={rh} pageLabel={ch3.no}>
        <div className="examples">
          <p className="examples__title">{ch3.examples.title}</p>
          <p className="examples__caption">{ch3.examples.caption}</p>
          {ch3.examples.items.map((e) => (
            <div key={e.do} className="example-row">
              <span className="example-row__from">{e.do}</span>
              <span className="example-row__arrow">→</span>
              <span className="example-row__to">{e.instead}</span>
            </div>
          ))}
        </div>
        <Points items={ch3.points} />
        <ColumnBox data={ch3.column} green />
      </Sheet>
    </>
  )
}

function Ch4Pages() {
  const rh = `${ch4.no}\u3000${ch4.title}`
  const toneClass: Record<string, string> = {
    do: 'compare__col--do',
    dont: 'compare__col--dont',
  }
  return (
    <>
      <Sheet runhead={rh} pageLabel={ch4.no}>
        <ChapterOpener
          no={ch4.no}
          title={ch4.title}
          catch={ch4.catch}
          src={img.pathFork}
          alt="夜明けの野原で一本の道が二手に分かれ、道標が立つイメージ"
        />
        <Lead lines={ch4.lead} />
        <TextSection
          heading={ch4.sections[0].heading}
          body={ch4.sections[0].body}
        />
      </Sheet>

      <Sheet runhead={rh} pageLabel={ch4.no}>
        <TextSection
          heading={ch4.sections[1].heading}
          body={ch4.sections[1].body}
        />
        <div className="examples">
          <p className="examples__title">{ch4.patterns.title}</p>
          <p className="examples__caption">{ch4.patterns.caption}</p>
          <div className="points points--3">
            {ch4.patterns.items.map((p) => (
              <div
                key={p.title}
                className="point"
                style={{
                  borderTop: `3px solid ${
                    p.tone === 'do'
                      ? 'var(--green)'
                      : p.tone === 'warn'
                        ? '#c99a2e'
                        : 'var(--red)'
                  }`,
                }}
              >
                <p className="point__title">{p.title}</p>
                <p className="point__body">{p.note}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="compare">
          <div className={`compare__col ${toneClass[ch4.compare.left.tone]}`}>
            <p className="compare__title">{ch4.compare.left.title}</p>
            <ul className="compare__list">
              {ch4.compare.left.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <div className={`compare__col ${toneClass[ch4.compare.right.tone]}`}>
            <p className="compare__title">{ch4.compare.right.title}</p>
            <ul className="compare__list">
              {ch4.compare.right.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </div>
      </Sheet>

      <Sheet runhead={rh} pageLabel={ch4.no}>
        <TextSection
          heading={ch4.sections[2].heading}
          body={ch4.sections[2].body}
        />
        <Points items={ch4.points} />
        <ColumnBox data={ch4.column} green />
      </Sheet>
    </>
  )
}

function Ch5Pages() {
  const rh = `${ch5.no}\u3000${ch5.title}`
  return (
    <>
      <Sheet runhead={rh} pageLabel={ch5.no}>
        <ChapterHead no={ch5.no} title={ch5.title} catch={ch5.catch} />
        <Lead lines={ch5.lead} />
        {ch5.sections.map((s) => (
          <TextSection key={s.heading} heading={s.heading} body={s.body} />
        ))}
        <div className="dodont">
          <div className="dd-col dd-col--do">
            <p className="dd-col__head">
              <Icon name="check" />
              {ch5.saylist.good.title}
            </p>
            <ul className="dd-list">
              {ch5.saylist.good.items.map((i) => (
                <li key={i}>
                  <Icon name="check" />
                  <span className="dd-item__title">{i}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="dd-col dd-col--dont">
            <p className="dd-col__head">
              <Icon name="cross" />
              {ch5.saylist.bad.title}
            </p>
            <ul className="dd-list">
              {ch5.saylist.bad.items.map((i) => (
                <li key={i}>
                  <Icon name="cross" />
                  <span className="dd-item__title">{i}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Sheet>

      <Sheet runhead={rh} pageLabel={ch5.no}>
        <div className="flow">
          <p className="flow__title">{ch5.flow.title}</p>
          <ol className="flow__steps">
            {ch5.flow.steps.map((s, i) => (
              <li key={s.title} className="flow__step">
                <span className="flow__num">{i + 1}</span>
                <span>
                  <span className="flow__step-title">{s.title}</span>
                  <span className="flow__step-note">{s.note}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="flow__caption">{ch5.flow.caption}</p>
        </div>
        <div className="callout callout--alert">
          <Icon name="alert" />
          <span>
            <span className="callout__label">{ch5.safety.label}</span>
            {ch5.safety.body}
          </span>
        </div>
      </Sheet>
    </>
  )
}

function Ch6Pages() {
  const rh = `${ch6.no}\u3000${ch6.title}`
  return (
    <>
      <Sheet runhead={rh} pageLabel={ch6.no}>
        <ChapterHead no={ch6.no} title={ch6.title} catch={ch6.catch} />
        <Lead lines={ch6.lead} />
        {ch6.cases.slice(0, 2).map((c) => (
          <div key={c.label} className="section-block">
            <h3 className="h3">
              {c.label}
              {'\u3000'}
              {c.from}
            </h3>
            {c.body.map((p) => (
              <p key={p} className="body-p">
                {p}
              </p>
            ))}
          </div>
        ))}
      </Sheet>

      <Sheet runhead={rh} pageLabel={ch6.no}>
        {ch6.cases.slice(2).map((c) => (
          <div key={c.label} className="section-block">
            <h3 className="h3">
              {c.label}
              {'\u3000'}
              {c.from}
            </h3>
            {c.body.map((p) => (
              <p key={p} className="body-p">
                {p}
              </p>
            ))}
          </div>
        ))}
        <Points items={ch6.points} />
        <div className="callout callout--alert">
          <Icon name="alert" />
          <span>
            <span className="callout__label">{ch6.impersonation.label}</span>
            {ch6.impersonation.body}
          </span>
        </div>
        <div className="callout">
          <Icon name="shield" />
          <span>{ch6.note}</span>
        </div>
      </Sheet>
    </>
  )
}

function Ch7Pages() {
  const rh = `${ch7.no}\u3000${ch7.title}`
  return (
    <>
      <Sheet runhead={rh} pageLabel={ch7.no}>
        <ChapterHead no={ch7.no} title={ch7.title} catch={ch7.catch} />
        <Lead lines={ch7.lead} />

        <div className="dd-col dd-col--dont" style={{ margin: '0.6rem 0 0' }}>
          <p className="dd-col__head">
            <Icon name="cross" />
            {ch7.dont.title}
          </p>
          <ul className="dd-list">
            {ch7.dont.items.map((i) => (
              <li key={i.title}>
                <Icon name="cross" />
                <span>
                  <span className="dd-item__title">{i.title}</span>
                  <span className="dd-item__note">{i.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Sheet>

      <Sheet runhead={rh} pageLabel={ch7.no}>
        <div className="callout">
          <Icon name="heart" />
          <span>{ch7.reasonNote}</span>
        </div>
        <ColumnBox data={ch7.column} />
        <ChapterHero
          src={img.consultHand}
          alt="相談室で穏やかに話を聴く様子。判断に迷ったら一人で抱え込まないで"
          caption="迷ったときは、どうか一人で決めないでください。相模原ダルクがご一緒します。"
          size="xtall"
        />
      </Sheet>
    </>
  )
}

function Ch8Pages() {
  const rh = `${ch8.no}\u3000${ch8.title}`
  return (
    <>
      <Sheet runhead={rh} pageLabel={ch8.no}>
        <ChapterOpener
          no={ch8.no}
          title={ch8.title}
          catch={ch8.catch}
          src={img.boundary}
          alt="夜明けの二つの岸のあいだを流れる穏やかな川。しなやかな境界線のイメージ"
        />
        <Lead lines={ch8.lead} />
        <div className="dd-col dd-col--do" style={{ margin: '0.9rem 0' }}>
          <p className="dd-col__head">
            <Icon name="check" />
            {ch8.do.title}
          </p>
          <ul className="dd-list">
            {ch8.do.items.map((i) => (
              <li key={i.title}>
                <Icon name="check" />
                <span>
                  <span className="dd-item__title">{i.title}</span>
                  <span className="dd-item__note">{i.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Sheet>

      <Sheet runhead={rh} pageLabel={ch8.no}>
        <div className="section-block">
          <p className="h3">境界線 ── 「相手の課題」と「自分の課題」を分ける</p>
          <div className="compare">
            <div className="compare__col compare__col--dont">
              <p className="compare__title">本人の課題（変えられないこと）</p>
              <ul className="compare__list">
                <li>薬物・お酒をやめること</li>
                <li>回復に取り組むこと</li>
                <li>約束を守ること</li>
                <li>自分の人生に責任を持つこと</li>
              </ul>
            </div>
            <div className="compare__col compare__col--do">
              <p className="compare__title">家族の課題（あなたにできること）</p>
              <ul className="compare__list">
                <li>自分の心と体を守ること</li>
                <li>正しい知識を持ち、相談すること</li>
                <li>つながりの中に身を置くこと</li>
                <li>回復を信じて、見守ること</li>
              </ul>
            </div>
          </div>
        </div>
        <ColumnBox data={ch8.boundary} />
        <ColumnBox data={ch8.craft} green />
        <Points items={ch8.points} />
      </Sheet>
    </>
  )
}

function Ch9Pages() {
  const rh = `${ch9.no}\u3000${ch9.title}`
  return (
    <>
      <Sheet runhead={rh} pageLabel={ch9.no}>
        <ChapterHead no={ch9.no} title={ch9.title} catch={ch9.catch} />
        <Lead lines={ch9.lead} />
        <p className="examples__caption">{ch9.note}</p>
        <div className="case case--do">
          <div className="case__head">
            <span className="case__label">{ch9.recovered.label}</span>
            <span className="case__person">{ch9.recovered.person}</span>
          </div>
          <div className="case__body">
            {ch9.recovered.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="case__result">
              <strong>結果：</strong>
              {ch9.recovered.result}
            </p>
          </div>
        </div>
      </Sheet>

      <Sheet runhead={rh} pageLabel={ch9.no}>
        <div className="case case--dont">
          <div className="case__head">
            <span className="case__label">{ch9.relapsed.label}</span>
            <span className="case__person">{ch9.relapsed.person}</span>
          </div>
          <div className="case__body">
            {ch9.relapsed.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="case__result">
              <strong>結果：</strong>
              {ch9.relapsed.result}
            </p>
          </div>
        </div>
        <ColumnBox
          data={{ label: 'MESSAGE', title: ch9.lesson.title, body: [ch9.lesson.body] }}
          green
        />
      </Sheet>
    </>
  )
}

type QaItem = { q: string; a: string; cat: string; catStart: boolean }

function QaBlock({ qa, showLabel, spaced }: { qa: QaItem; showLabel: boolean; spaced: boolean }) {
  return (
    <>
      {showLabel && (
        <span
          className="qa-group__label"
          style={spaced ? { marginTop: '0.9rem' } : undefined}
        >
          {qa.cat}
          {!qa.catStart ? '（つづき）' : ''}
        </span>
      )}
      <div className="qa">
        <p className="qa__q">
          <span className="qa__mark qa__mark--q">Q</span>
          {qa.q}
        </p>
        <p className="qa__a">
          <span className="qa__mark qa__mark--a">A</span>
          {qa.a}
        </p>
      </div>
    </>
  )
}

function Ch10Pages() {
  const rh = `${ch10.no}\u3000${ch10.title}`
  const flat: QaItem[] = ch10.groups.flatMap((g) =>
    g.items.map((it, i) => ({ q: it.q, a: it.a, cat: g.label, catStart: i === 0 })),
  )
  const firstCount = 4
  const perPage = 5
  const chunks: QaItem[][] = [flat.slice(0, firstCount)]
  for (let i = firstCount; i < flat.length; i += perPage)
    chunks.push(flat.slice(i, i + perPage))

  return (
    <>
      {chunks.map((chunk, ci) => (
        <Sheet
          key={chunk[0].q}
          className={ci === 0 ? 'sheet--open' : undefined}
          runhead={rh}
          pageLabel={ch10.no}
        >
          {ci === 0 && (
            <>
              <ChapterHead no={ch10.no} title={ch10.title} catch={ch10.catch} />
              <Lead lines={ch10.lead} />
            </>
          )}
          {chunk.map((qa, qi) => (
            <QaBlock
              key={qa.q}
              qa={qa}
              showLabel={qa.catStart || qi === 0}
              spaced={qi > 0 || ci === 0}
            />
          ))}
          {ci === chunks.length - 1 && (
            <div className="callout">
              <Icon name="heart" />
              <span>
                ここに載せきれない疑問も、たくさんあると思います。迷ったときは、どうか一人で決めず、相模原ダルクへご相談ください。
              </span>
            </div>
          )}
        </Sheet>
      ))}
    </>
  )
}

function Ch11Pages() {
  const rh = `${ch11.no}\u3000${ch11.title}`
  return (
    <>
      <Sheet runhead={rh} pageLabel={ch11.no}>
        <ChapterOpener
          no={ch11.no}
          title={ch11.title}
          catch={ch11.catch}
          src={img.seminar}
          alt="相模原ダルクの家族会・家族セミナーの様子（プライバシー保護のため顔は加工済み）"
        />
        <Lead lines={ch11.lead} />
        <div className="benefits">
          {ch11.benefits.map((b) => (
            <div key={b.title} className="benefit">
              <span className="benefit__icon">
                <Icon name={b.icon as IconName} />
              </span>
              <p className="benefit__title">{b.title}</p>
              <p className="benefit__body">{b.body}</p>
            </div>
          ))}
        </div>

        <div className="section-block">
          <p className="h3">{ch11.program.title}</p>
          <div className="points points--3">
            {ch11.program.items.map((p, i) => (
              <div key={p.title} className="point">
                <span className="point__tag">PROGRAM {i + 1}</span>
                <p className="point__title">{p.title}</p>
                <p className="point__body">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Sheet>

      <Sheet runhead={rh} pageLabel={ch11.no}>
        <div className="voices">
          <p className="voices__title">{ch11.voices.title}</p>
          <ul className="voices__list">
            {ch11.voices.items.map((v) => (
              <li key={v}>{v.replace(/^「|」$/g, '')}</li>
            ))}
          </ul>
          <p className="voices__caption">{ch11.voices.caption}</p>
        </div>
        <div className="kv">
          {ch11.info.rows.map((r) => (
            <div key={r.label} className="kv__row">
              <div className="kv__k">{r.label}</div>
              <div className="kv__v">{r.value}</div>
            </div>
          ))}
        </div>
        <div className="flow">
          <p className="flow__title">家族会 当日の流れ</p>
          <ol className="flow__steps">
            {[
              { t: '受付・送迎', n: 'JR相模原駅 北口より専用送迎車（12:45発・13:00発）' },
              { t: '開会（13:30）', n: 'はじめての方も、どうぞ安心してお越しください' },
              { t: 'エキスパート講演会', n: '医師・専門家から、依存症と回復を学ぶ' },
              { t: '家族ミーティング', n: '「言いっぱなし・聞きっぱなし」で分かち合う' },
              { t: '当事者スタッフ面談', n: 'ご家庭の悩みに、回復者スタッフが一緒に向き合う' },
              { t: '閉会（17:00）', n: 'お帰りも送迎いたします' },
            ].map((s, i) => (
              <li key={s.t} className="flow__step">
                <span className="flow__num">{i + 1}</span>
                <span>
                  <span className="flow__step-title">{s.t}</span>
                  <span className="flow__step-note">{s.n}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="flow__caption">
            ※ 内容は回により変わることがあります。見学だけの参加も歓迎です。
          </p>
        </div>
        <ChapterHero
          src={img.facility}
          alt="家族会の会場となる相模原ダルク デイケアセンターの外観"
          caption="家族会の会場 ── 相模原ダルク デイケアセンター（相模原市）。送迎車もご用意しています。"
        />
        <div className="callout">
          <Icon name="chat" />
          <span>{ch11.info.note}</span>
        </div>
        <ColumnBox
          data={{
            label: ch11.consult.label,
            title: ch11.consult.title,
            body: ch11.consult.body,
          }}
          green
        />
        <ChapterHero
          src={img.staffSmile}
          alt="相談を担当する、回復を経験した当事者スタッフの穏やかな笑顔"
          caption="相談を担当するのは、依存症で苦しみ、回復を果たした当事者スタッフです。"
        />
      </Sheet>
    </>
  )
}

/* =============================================================
   Closing
   ============================================================= */

function PromisePage() {
  return (
    <Sheet className="sheet--promise" runhead={promise.chapterLabel} pageLabel="約束">
      <p className="promise__label">
        {promise.chapterLabel}
        {'\u3000'}PROMISE
      </p>
      <h2 className="promise__title">{promise.title}</h2>
      <figure className="hero hero--promise">
        <img
          src={img.walkingTogether}
          alt="夜明けに向かって並んで歩いていく二人の後ろ姿。ともに歩むイメージ"
        />
      </figure>
      <div className="promise__body">
        {promise.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div className="pledges">
        {promise.pledges.map((p) => (
          <div key={p.title} className="pledge">
            <span className="pledge__icon">
              <Icon name={p.icon as IconName} />
            </span>
            <p className="pledge__title">{p.title}</p>
            <p className="pledge__note">{p.note}</p>
          </div>
        ))}
      </div>
      <div className="promise__accent" />
      <p className="promise__final">{promise.finalMessage}</p>
      <p className="promise__signoff">{promise.signoff}</p>
    </Sheet>
  )
}

function BackPage() {
  return (
    <Sheet className="sheet--back" hideNo>
      <div className="back">
        <div className="back__hotline">
          <div className="back__hotline-head">
            <span className="back__hotline-icon">
              <Icon name="phone" />
            </span>
            <div>
              <p className="back__hotline-lead">{backCover.lead}</p>
              <p className="back__hotline-headline">{backCover.headline}</p>
            </div>
          </div>

          <div className="back__numbers">
            <div className="back__num">
              <span className="back__num-label">{backCover.hotline.label}</span>
              <a
                className="back__num-value back__num-value--accent"
                href={`tel:${backCover.hotline.value.replace(/-/g, '')}`}
              >
                {backCover.hotline.value}
              </a>
            </div>
            <div className="back__num">
              <span className="back__num-label">{backCover.rep.label}</span>
              <a className="back__num-value" href={`tel:${org.phone}`}>
                {backCover.rep.value}
              </a>
            </div>
          </div>

          <p className="back__support">{backCover.support}</p>
        </div>

        <div className="back__eligibility">
          <p className="back__eligibility-title">{backCover.eligibility.title}</p>
          <p className="back__eligibility-lead">{backCover.eligibility.lead}</p>
          <ul className="back__eligibility-list">
            {backCover.eligibility.items.map((i) => (
              <li key={i}>
                <Icon name="check" />
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="back__site-row">
          <span className="back__site-label">{backCover.siteLabel}</span>
          <a
            className="back__site"
            href={backCover.site}
            target="_blank"
            rel="noreferrer"
          >
            {backCover.site}
          </a>
        </div>

        <div className="back__issuer">
          <div className="back__issuer-logo">{backCover.brand}</div>
          <p className="back__issuer-name">{backCover.issuer}</p>
          <p className="back__disclaimer">{backCover.disclaimer}</p>
        </div>
      </div>
    </Sheet>
  )
}

/* =============================================================
   Appendix: design specification (producer-facing)
   ============================================================= */

function SpecHead() {
  return (
    <div className="spec-head">
      <span className="spec-head__tag">{spec.label}｜APPENDIX</span>
      <h2 className="spec-head__title">{spec.title}</h2>
      <p className="spec-head__note">{spec.note}</p>
    </div>
  )
}

function SpecTable({
  title,
  caption,
  rows,
}: {
  title: string
  caption?: string
  rows: readonly { k: string; v: string }[]
}) {
  return (
    <div className="spec-block">
      <h3 className="h3">{title}</h3>
      {caption && <p className="examples__caption">{caption}</p>}
      <div className="kv">
        {rows.map((r) => (
          <div key={r.k} className="kv__row">
            <div className="kv__k">{r.k}</div>
            <div className="kv__v">{r.v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SpecPages() {
  return (
    <>
      <Sheet runhead={spec.label} pageLabel="制作資料">
        <SpecHead />
        <SpecTable title={spec.format.title} rows={spec.format.rows} />
      </Sheet>

      <Sheet runhead={spec.label} pageLabel="制作資料">
        <div className="spec-block">
          <h3 className="h3">{spec.palette.title}</h3>
          <p className="examples__caption">{spec.palette.caption}</p>
          <div className="swatches">
            {spec.palette.items.map((c) => (
              <div key={c.name} className="swatch">
                <span
                  className="swatch__chip"
                  style={{
                    background: c.hex,
                    border:
                      c.hex.toUpperCase() === '#FFFFFF'
                        ? '1px solid var(--gray-line)'
                        : 'none',
                  }}
                />
                <div className="swatch__meta">
                  <span className="swatch__name">{c.name}</span>
                  <span className="swatch__role">{c.role}</span>
                  <span className="swatch__code">
                    {c.hex}
                    {'\u3000'}
                    {c.cmyk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Sheet>

      <Sheet runhead={spec.label} pageLabel="制作資料">
        <div className="spec-block">
          <h3 className="h3">{spec.typography.title}</h3>
          <p className="examples__caption">{spec.typography.caption}</p>
          <div className="spec-type">
            <div className="spec-type__row spec-type__row--head">
              <span>要素</span>
              <span>サイズ</span>
              <span>ウェイト</span>
              <span>行間</span>
              <span>備考</span>
            </div>
            {spec.typography.rows.map((r) => (
              <div key={r.el} className="spec-type__row">
                <span className="spec-type__el">{r.el}</span>
                <span>{r.size}</span>
                <span>{r.weight}</span>
                <span>{r.lh}</span>
                <span className="spec-type__note">{r.note}</span>
              </div>
            ))}
          </div>
        </div>
        <SpecTable title={spec.layout.title} rows={spec.layout.rows} />
        <div className="spec-block">
          <h3 className="h3">{spec.iconography.title}</h3>
          <ul className="spec-list">
            {spec.iconography.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      </Sheet>

      <Sheet runhead={spec.label} pageLabel="制作資料">
        <div className="spec-block">
          <h3 className="h3">{spec.artDirection.title}</h3>
          <p className="examples__caption">{spec.artDirection.caption}</p>
          <div className="spec-art">
            <div className="spec-art__row spec-art__row--head">
              <span>ページ</span>
              <span>図解</span>
              <span>写真</span>
              <span>イラスト</span>
              <span>配色</span>
            </div>
            {spec.artDirection.rows.map((r) => (
              <div key={r.page} className="spec-art__row">
                <span className="spec-art__page">{r.page}</span>
                <span>{r.figure}</span>
                <span>{r.photo}</span>
                <span>{r.illust}</span>
                <span>{r.color}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="spec-block">
          <h3 className="h3">{spec.accessibility.title}</h3>
          <ul className="spec-list">
            {spec.accessibility.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      </Sheet>
    </>
  )
}

/* =============================================================
   App
   ============================================================= */

function App() {
  const handlePrint = () => window.print()
  // 制作仕様書（デザインガイド）は制作者向けの内部資料。
  // 家族へ配布する冊子には含めない（true にすると巻末に付加できる）。
  const showSpecAppendix = false

  return (
    <div className="viewer">
      <div className="toolbar">
        <div className="toolbar__brand">
          <span className="toolbar__logo">{org.brand}</span>
          <span className="toolbar__label">家族回復支援実践マニュアル 完全版｜保存版</span>
        </div>
        <div className="toolbar__actions">
          <a
            className="toolbar__btn toolbar__btn--primary"
            href="manual.pdf"
            download="相模原ダルク_家族回復支援実践マニュアル.pdf"
          >
            <Icon name="book" className="icon-inline" />
            A4冊子PDFをダウンロード
          </a>
          <button className="toolbar__btn" onClick={handlePrint} type="button">
            印刷
          </button>
        </div>
      </div>

      <p className="print-hint">
        きれいに冊子として保存・印刷するには、上の「A4冊子PDFをダウンロード」がおすすめです。ブラウザから印刷する場合は、印刷画面で
        <strong>用紙サイズ「A4」・余白「なし」・「ヘッダーとフッター」をオフ</strong>
        に設定してください。
      </p>

      <div className="booklet">
        <CoverPage />
        <StoryPages />
        <PrefacePages />
        <TocPage />
        <Ch1Pages />
        <Ch2Pages />
        <Ch3Pages />
        <Ch4Pages />
        <Ch5Pages />
        <Ch6Pages />
        <Ch7Pages />
        <Ch8Pages />
        <Ch9Pages />
        <Ch10Pages />
        <Ch11Pages />
        <PromisePage />
        <BackPage />
        {showSpecAppendix && <SpecPages />}
      </div>
    </div>
  )
}

export default App
