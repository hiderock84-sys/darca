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

function ChapterHead({
  no,
  title,
  catch: catchCopy,
}: {
  no: string
  title: string
  catch: string
}) {
  return (
    <header className="chapter-head">
      <span className="chapter-head__no">
        <Icon name="compass" className="icon-inline" />
        {no}
      </span>
      <h2 className="chapter-head__title">{title}</h2>
      <p className="chapter-head__catch">{catchCopy}</p>
      <div className="chapter-head__rule" />
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

function ChapterHero({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="hero">
      <img src={src} alt={alt} loading="lazy" />
    </figure>
  )
}

/* =============================================================
   Front matter
   ============================================================= */

function CoverPage() {
  return (
    <Sheet className="sheet--cover" hideNo>
      <img className="cover__bg" src={img.coverHero} alt="" aria-hidden="true" />
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
            loading="lazy"
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
      </Sheet>
    </>
  )
}

function PrefacePage() {
  return (
    <Sheet runhead={preface.chapterLabel} pageLabel="はじめに">
      <ChapterHead no={preface.chapterLabel} title={preface.title} catch="あなたは、悪くありません。" />
      <ChapterHero
        src={img.handsSupport}
        alt="やわらかな光の中で、そっと近づく二つの手。あなたは一人ではないというメッセージ"
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
        <ChapterHead no={ch1.no} title={ch1.title} catch={ch1.catch} />
        <ChapterHero
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
        <ChapterHead no={ch2.no} title={ch2.title} catch={ch2.catch} />
        <ChapterHero
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
        <ChapterHead no={ch4.no} title={ch4.title} catch={ch4.catch} />
        <ChapterHero
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

function Ch7Page() {
  return (
    <Sheet runhead={`${ch7.no}\u3000${ch7.title}`} pageLabel={ch7.no}>
      <ChapterHead no={ch7.no} title={ch7.title} catch={ch7.catch} />
      <Lead lines={ch7.lead} />

      <div className="dd-col dd-col--dont" style={{ margin: '0.5rem 0 0.4rem' }}>
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

      <div className="callout">
        <Icon name="heart" />
        <span>{ch7.reasonNote}</span>
      </div>

      <ColumnBox data={ch7.column} />
    </Sheet>
  )
}

function Ch8Pages() {
  const rh = `${ch8.no}\u3000${ch8.title}`
  return (
    <>
      <Sheet runhead={rh} pageLabel={ch8.no}>
        <ChapterHead no={ch8.no} title={ch8.title} catch={ch8.catch} />
        <ChapterHero
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

function QaGroup({ group }: { group: (typeof ch10.groups)[number] }) {
  return (
    <div className="qa-group">
      <span className="qa-group__label">{group.label}</span>
      {group.items.map((qa) => (
        <div key={qa.q} className="qa">
          <p className="qa__q">
            <span className="qa__mark qa__mark--q">Q</span>
            {qa.q}
          </p>
          <p className="qa__a">
            <span className="qa__mark qa__mark--a">A</span>
            {qa.a}
          </p>
        </div>
      ))}
    </div>
  )
}

function Ch10Pages() {
  const rh = `${ch10.no}\u3000${ch10.title}`
  return (
    <>
      <Sheet className="sheet--open" runhead={rh} pageLabel={ch10.no}>
        <div className="chapter-open">
          <ChapterHead no={ch10.no} title={ch10.title} catch={ch10.catch} />
          <Lead lines={ch10.lead} />
          <div className="qa-index">
            <p className="qa-index__title">この章でお答えする質問</p>
            <ol className="qa-index__list">
              {ch10.groups.map((g, i) => (
                <li key={g.label}>
                  <span className="qa-index__no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="qa-index__label">{g.label}</span>
                  <span className="qa-index__count">全{g.items.length}問</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Sheet>

      <Sheet runhead={rh} pageLabel={ch10.no}>
        <QaGroup group={ch10.groups[0]} />
      </Sheet>

      <Sheet runhead={rh} pageLabel={ch10.no}>
        <QaGroup group={ch10.groups[1]} />
      </Sheet>

      <Sheet runhead={rh} pageLabel={ch10.no}>
        <QaGroup group={ch10.groups[2]} />
      </Sheet>

      <Sheet runhead={rh} pageLabel={ch10.no}>
        <QaGroup group={ch10.groups[3]} />
        <div className="callout">
          <Icon name="heart" />
          <span>
            ここに載せきれない疑問も、たくさんあると思います。迷ったときは、どうか一人で決めず、相模原ダルクへご相談ください。
          </span>
        </div>
      </Sheet>
    </>
  )
}

function Ch11Pages() {
  const rh = `${ch11.no}\u3000${ch11.title}`
  return (
    <>
      <Sheet runhead={rh} pageLabel={ch11.no}>
        <ChapterHead no={ch11.no} title={ch11.title} catch={ch11.catch} />
        <ChapterHero
          src={img.familyCircle}
          alt="明るい部屋に円く並べられた椅子。安心してつながれる家族会のイメージ"
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
          loading="lazy"
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
        <p className="back__lead">{backCover.lead}</p>

        <div className="back__card">
          <p className="back__phone-label">{backCover.phoneLabel}</p>
          <a className="back__phone" href={`tel:${org.phone}`}>
            <Icon name="phone" />
            {org.phone}
          </a>
          <p className="back__phone-note">{org.phoneNote}</p>
          <p className="back__phone-note">{org.consultFree}</p>
          <div className="back__divider" />
          <p className="back__site-label">{backCover.siteLabel}</p>
          <a
            className="back__site"
            href={backCover.site}
            target="_blank"
            rel="noreferrer"
          >
            {backCover.site}
          </a>
        </div>

        <p className="back__closing">{backCover.closing}</p>

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

  return (
    <div className="viewer">
      <div className="toolbar">
        <div className="toolbar__brand">
          <span className="toolbar__logo">{org.brand}</span>
          <span className="toolbar__label">家族回復支援実践マニュアル 完全版｜保存版</span>
        </div>
        <button className="toolbar__print" onClick={handlePrint} type="button">
          <Icon name="book" className="icon-inline" />
          印刷 / PDFで保存
        </button>
      </div>

      <div className="booklet">
        <CoverPage />
        <StoryPages />
        <PrefacePage />
        <TocPage />
        <Ch1Pages />
        <Ch2Pages />
        <Ch3Pages />
        <Ch4Pages />
        <Ch5Pages />
        <Ch6Pages />
        <Ch7Page />
        <Ch8Pages />
        <Ch9Pages />
        <Ch10Pages />
        <Ch11Pages />
        <PromisePage />
        <BackPage />
        <SpecPages />
      </div>
    </div>
  )
}

export default App
