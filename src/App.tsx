import type { ReactNode } from 'react'
import { Icon, type IconName } from './components/Icons'
import {
  NightScene,
  SunriseRoad,
  CircleOfPeople,
  Ornament,
} from './components/Illustrations'
import {
  org,
  cover,
  intro,
  toc,
  chapters,
  story,
  loveDilemma,
  whatIs,
  cycle,
  enabling,
  darcPhilosophy,
  darcDay,
  meeting,
  recovery,
  familyRequest,
  ifReturns,
  familyMeeting,
  voices,
  backCover,
} from './data/guide'

function Brand() {
  return (
    <div className="brand">
      <span className="brand__logo">{org.brand}</span>
      <span className="brand__name">{org.name}</span>
    </div>
  )
}

function Foot({ no }: { no: number }) {
  return (
    <div className="pg-foot">
      <span className="pg-foot__brand">{org.brand}</span>
      <span className="pg-foot__no">- {no} -</span>
    </div>
  )
}

function Head({
  kicker,
  title,
  lead,
}: {
  kicker: string
  title: string
  lead?: string
}) {
  return (
    <div className="head">
      <span className="head__kicker">{kicker}</span>
      <h2 className="head__title">{title}</h2>
      {lead && <p className="head__lead">{lead}</p>}
    </div>
  )
}

/* ---------- P1 表紙 ---------- */
function CoverPage() {
  return (
    <section className="page page--cover page--dark" aria-label="表紙">
      <NightScene className="night-scene" />
      <span className="corner corner--tl" />
      <span className="corner corner--br" />
      <Brand />
      <span className="cover__kicker">{cover.kicker}</span>
      <p className="cover__eyebrow">{cover.eyebrow}</p>
      <h1 className="cover__title">{cover.title}</h1>
      <p className="cover__subtitle">{cover.subtitle}</p>
      <div className="cover__lead">
        {cover.lead.map((l) => (
          <p key={l}>{l}</p>
        ))}
      </div>
      <ul className="pillars">
        {cover.pillars.map((p) => (
          <li key={p.title} className="pillar">
            <span className="pillar__icon">
              <Icon name={p.icon as IconName} />
            </span>
            <span className="pillar__title">{p.title}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------- P2 はじめに ---------- */
function IntroPage() {
  return (
    <section className="page" aria-label="はじめに">
      <Head kicker={intro.chapterLabel} title={intro.title} />
      <div className="intro__body">
        {intro.body.map((p, i) => (
          <p key={p} className={i === 0 ? 'intro__lead-first' : undefined}>
            {p}
          </p>
        ))}
      </div>
      <p className="intro__sign">
        <span>MESSAGE</span>
        {intro.sign}
      </p>
      <Foot no={2} />
    </section>
  )
}

/* ---------- P3 目次 ---------- */
function TocPage() {
  return (
    <section className="page" aria-label="目次">
      <p className="toc__sub">{toc.subtitle}</p>
      <Head kicker="CONTENTS" title={toc.title} />
      <ol className="toc__list">
        {toc.chapters.map((c) => (
          <li key={c.no} className="toc__row">
            <span className="toc__no">{c.no}</span>
            <div className="toc__body">
              <h3>{c.title}</h3>
              <p className="toc__note">{c.note}</p>
              <ul className="toc__items">
                {c.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
      <Foot no={3} />
    </section>
  )
}

/* ---------- 章扉 ---------- */
const chapterArt: Record<string, IconName> = {
  night: 'heart',
  brain: 'brain',
  home: 'home',
  hands: 'hands',
}
function ChapterPage({
  c,
}: {
  c: (typeof chapters)[keyof typeof chapters]
}) {
  return (
    <section
      className={`page page--chapter page--dark chapter--${c.theme}`}
      aria-label={`${c.label} ${c.title}`}
    >
      <div className="chapter__no">{c.no}</div>
      <span className="pillar__icon chapter__art-icon" style={artIconStyle}>
        <Icon name={chapterArt[c.theme]} />
      </span>
      <span className="chapter__label">{c.label}</span>
      <h2 className="chapter__title">{c.title}</h2>
      <Ornament className="ornament" />
      <p className="chapter__subtitle">{c.subtitle}</p>
      <p className="chapter__lead">{c.lead}</p>
    </section>
  )
}
const artIconStyle = {
  width: '16mm',
  height: '16mm',
  margin: '0 auto',
} as const

/* ---------- P5 物語 ---------- */
function StoryPage() {
  return (
    <section className="page story" aria-label={story.title}>
      <Head kicker="第一章 - 01" title={story.title} />
      {story.paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <ul className="quotes">
        {story.quotes.map((q) => (
          <li key={q}>「{q}」</li>
        ))}
      </ul>
      {story.afterQuotes.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <Foot no={5} />
    </section>
  )
}

/* ---------- P6 愛という迷い ---------- */
function LoveDilemmaPage() {
  return (
    <section className="page" aria-label={loveDilemma.title}>
      <Head kicker="第一章 - 02" title={loveDilemma.title} lead={loveDilemma.lead} />
      <div className="dilemma">
        {loveDilemma.columns.map((col) => (
          <div
            key={col.head}
            className={`dilemma__col dilemma__col--${col.tone}`}
          >
            <h4>{col.head}</h4>
            <ul>
              {col.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="pull">{loveDilemma.message}</p>
      <Foot no={6} />
    </section>
  )
}

/* ---------- P8 依存症とは ---------- */
function WhatIsPage() {
  return (
    <section className="page" aria-label={whatIs.title}>
      <Head kicker="第二章 - 01" title={whatIs.title} lead={whatIs.lead} />
      <div className="points">
        {whatIs.points.map((pt) => (
          <div key={pt.head} className="point">
            <span className="point__icon">
              <Icon name={pt.icon as IconName} />
            </span>
            <div>
              <h4>{pt.head}</h4>
              <p>{pt.body}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="fact">{whatIs.fact}</p>
      <Foot no={8} />
    </section>
  )
}

/* ---------- P9 悪循環 ---------- */
function CyclePage() {
  return (
    <section className="page" aria-label={cycle.title}>
      <Head kicker="第二章 - 02" title={cycle.title} lead={cycle.lead} />
      <ol className="cycle-big">
        {cycle.steps.map((s, i) => (
          <li key={s.label}>
            <span className="cycle-big__no">{i + 1}</span>
            <span>
              <b>{s.label}</b>
              <small>{s.note}</small>
            </span>
          </li>
        ))}
      </ol>
      <p className="note-box">{cycle.bottom}</p>
      <Foot no={9} />
    </section>
  )
}

/* ---------- P10 イネーブリング ---------- */
function EnablingPage() {
  return (
    <section className="page" aria-label={enabling.title}>
      <Head kicker="第二章 - 03" title={enabling.title} lead={enabling.lead} />
      <div className="blocks">
        {enabling.blocks.map((b) => (
          <div key={b.head} className="block">
            <h4>{b.head}</h4>
            <p>{b.body}</p>
          </div>
        ))}
      </div>
      <div className="checklist">
        <h4>{enabling.checklist.head}</h4>
        <ul>
          {enabling.checklist.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      </div>
      <Foot no={10} />
    </section>
  )
}

/* ---------- P12 理念 ---------- */
function PhilosophyPage() {
  return (
    <section className="page" aria-label={darcPhilosophy.title}>
      <Head
        kicker="第三章 - 01"
        title={darcPhilosophy.title}
        lead={darcPhilosophy.lead}
      />
      <p className="philo__history">{darcPhilosophy.history}</p>
      <div className="creed">
        {darcPhilosophy.creed.items.map((it) => (
          <div key={it.head} className="creed__item">
            <b>{it.head}</b>
            <p>{it.body}</p>
          </div>
        ))}
      </div>
      <p className="motto">{darcPhilosophy.motto}</p>
      <Foot no={12} />
    </section>
  )
}

/* ---------- P13 一日 ---------- */
function DayPage() {
  return (
    <section className="page" aria-label={darcDay.title}>
      <Head kicker="第三章 - 02" title={darcDay.title} lead={darcDay.lead} />
      <ul className="timeline">
        {darcDay.schedule.map((s) => (
          <li key={s.title}>
            <span className="timeline__time">{s.time}</span>
            <span>
              <b>{s.title}</b>
              <small>{s.note}</small>
            </span>
          </li>
        ))}
      </ul>
      <div className="three-pillars">
        <h4>{darcDay.pillars.head}</h4>
        <ul>
          {darcDay.pillars.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      </div>
      <Foot no={13} />
    </section>
  )
}

/* ---------- P14 ミーティング ---------- */
function MeetingPage() {
  return (
    <section className="page" aria-label={meeting.title}>
      <Head kicker="第三章 - 03" title={meeting.title} lead={meeting.lead} />
      <CircleOfPeople className="circle-art" />
      <div className="rule-card">
        <p className="rule-card__head">{meeting.ruleHead}</p>
        <ul>
          {meeting.rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
      <div className="meeting-body">
        {meeting.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <Foot no={14} />
    </section>
  )
}

/* ---------- P15 回復 ---------- */
function RecoveryPage() {
  return (
    <section className="page" aria-label={recovery.title}>
      <Head kicker="第三章 - 04" title={recovery.title} lead={recovery.lead} />
      <ol className="steps4">
        {recovery.steps.map((s, i) => (
          <li key={s.head}>
            <span className="steps4__no">{i + 1}</span>
            <span>
              <b>{s.head}</b>
              <p>{s.body}</p>
            </span>
          </li>
        ))}
      </ol>
      <p className="today-box">{recovery.today}</p>
      <Foot no={15} />
    </section>
  )
}

/* ---------- P17 やる・やらない ---------- */
function RequestPage() {
  return (
    <section className="page" aria-label={familyRequest.title}>
      <Head
        kicker="第四章 - 01"
        title={familyRequest.title}
        lead={familyRequest.lead}
      />
      <div className="dodont">
        <article className="dodont__col dodont__col--dont">
          <h4>
            <span className="badge badge--dont">×</span>
            {familyRequest.dont.title}
          </h4>
          <ul>
            {familyRequest.dont.items.map((it) => (
              <li key={it}>
                <span className="mark mark--dont" aria-hidden="true">
                  ×
                </span>
                {it}
              </li>
            ))}
          </ul>
          <p className="dodont__note dodont__note--dont">
            {familyRequest.dont.note}
          </p>
        </article>
        <article className="dodont__col dodont__col--do">
          <h4>
            <span className="badge badge--do">✓</span>
            {familyRequest.do.title}
          </h4>
          <ul>
            {familyRequest.do.items.map((it) => (
              <li key={it}>
                <span className="mark mark--do" aria-hidden="true">
                  ✓
                </span>
                {it}
              </li>
            ))}
          </ul>
          <p className="dodont__note dodont__note--do">
            {familyRequest.do.note}
          </p>
        </article>
      </div>
      <Foot no={17} />
    </section>
  )
}

/* ---------- P18 フロー＋家族会 ---------- */
function ReturnAndMeetingPage() {
  return (
    <section className="page" aria-label="もし本人が帰宅してきたら / 家族会">
      <Head kicker="第四章 - 02" title={ifReturns.title} />
      <div className="flow">
        <h4>対応の流れ</h4>
        <ol className="flow__steps">
          {ifReturns.steps.map((s, i) => (
            <li key={s.title} className="flow__step">
              <span className="flow__num">{i + 1}</span>
              <b>{s.title}</b>
              <small>{s.note}</small>
            </li>
          ))}
        </ol>
      </div>
      <div className="meeting-info">
        <h4>{familyMeeting.title}</h4>
        <p className="lead">{familyMeeting.lead}</p>
        <ul className="meeting-info__benefits">
          {familyMeeting.benefits.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <dl className="meeting-info__rows">
          {familyMeeting.info.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <Foot no={18} />
    </section>
  )
}

/* ---------- P19 声 ---------- */
function VoicesPage() {
  return (
    <section className="page" aria-label={voices.title}>
      <Head kicker="第四章 - 03" title={voices.title} lead={voices.lead} />
      <div className="voices">
        {voices.items.map((v) => (
          <blockquote key={v.by} className="voice">
            <p>{v.text}</p>
            <cite>― {v.by}</cite>
          </blockquote>
        ))}
      </div>
      <p className="voices__closing">{voices.closing}</p>
      <Foot no={19} />
    </section>
  )
}

/* ---------- P20 裏表紙 ---------- */
function BackPage() {
  return (
    <section className="page page--back page--dark" aria-label="裏表紙">
      <SunriseRoad className="sunrise-road" />
      <span className="corner corner--tl" />
      <span className="corner corner--br" />
      <div className="back__message">
        {backCover.message.map((l) => (
          <p key={l}>{l}</p>
        ))}
      </div>
      <ul className="pillars">
        {backCover.pillars.map((p) => (
          <li key={p.title} className="pillar">
            <span className="pillar__icon">
              <Icon name={p.icon as IconName} />
            </span>
            <span className="pillar__title">{p.title}</span>
            <span className="pillar__note">{p.note}</span>
          </li>
        ))}
      </ul>
      <div className="contact">
        <Brand />
        <a className="contact__phone" href={`tel:${org.phone}`}>
          <Icon name="phone" className="icon-inline" />
          {org.phone}
        </a>
        <p className="contact__note">{org.phoneNote}</p>
        <a
          className="contact__site"
          href={org.website}
          target="_blank"
          rel="noreferrer"
        >
          <Icon name="globe" className="icon-inline" />
          {org.websiteLabel}
        </a>
      </div>
    </section>
  )
}

function Book({ children }: { children: ReactNode }) {
  return <div className="book">{children}</div>
}

function App() {
  return (
    <Book>
      <div className="print-hint">
        <b>ご家族のための回復支援ガイド（全20ページ・A5冊子）</b>
        <br />
        印刷方法：ブラウザの印刷で「用紙：A5／余白：なし／背景のグラフィック：オン」を選ぶと、
        1ページ＝A5 で20枚出力できます。A4 用紙に印刷する場合は「1枚に2ページ」または冊子（ブックレット）印刷をご利用ください。
        <br />
        <button type="button" onClick={() => window.print()}>
          印刷 / PDF保存
        </button>
      </div>

      <CoverPage />
      <IntroPage />
      <TocPage />

      <ChapterPage c={chapters.one} />
      <StoryPage />
      <LoveDilemmaPage />

      <ChapterPage c={chapters.two} />
      <WhatIsPage />
      <CyclePage />
      <EnablingPage />

      <ChapterPage c={chapters.three} />
      <PhilosophyPage />
      <DayPage />
      <MeetingPage />
      <RecoveryPage />

      <ChapterPage c={chapters.four} />
      <RequestPage />
      <ReturnAndMeetingPage />
      <VoicesPage />

      <BackPage />
    </Book>
  )
}

export default App
