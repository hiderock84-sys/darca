import { Icon, type IconName } from './components/Icons'
import { NightScene, SunriseRoad, CycleLoop } from './components/Illustrations'
import {
  org,
  cover,
  story,
  cards,
  cycle,
  familyRequest,
  ifReturns,
  familyMeeting,
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

function PanelHead({ num, title }: { num: string; title: string }) {
  return (
    <div className="p-head">
      <span className="p-num">{num}</span>
      <h2 className="p-title">
        {title}
        <span className="p-title__underline" />
      </h2>
    </div>
  )
}

function CoverPanel() {
  return (
    <div className="panel panel--cover panel--dark">
      <NightScene className="night-scene" />
      <span className="corner corner--tl" />
      <span className="corner corner--br" />
      <Brand />
      <p className="cover__eyebrow">{cover.eyebrow}</p>
      <h1 className="cover__title">{cover.title}</h1>
      <p className="cover__subtitle">{cover.subtitle}</p>
      <div className="cover__lead">
        {cover.lead.map((line) => (
          <p key={line}>{line}</p>
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
    </div>
  )
}

const cardMeta = [
  { data: cards.addiction, icon: 'brain' as IconName, cls: '' },
  { data: cards.enabling, icon: 'chain' as IconName, cls: '' },
  { data: cards.today, icon: 'sunrise' as IconName, cls: 'mini-card--accent' },
  { data: cards.familySuffer, icon: 'heart' as IconName, cls: 'mini-card--soft' },
]

function StoryPanel() {
  return (
    <div className="panel panel--light story">
      <PanelHead num="P.2" title={story.title} />
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

      <div className="cycle">
        <p className="cycle__title">{cycle.title}</p>
        <CycleLoop className="cycle__loop" />
        <div className="cycle__flow">
          {cycle.steps.map((s, i) => (
            <span key={s} style={{ display: 'contents' }}>
              <span className="step">{s}</span>
              {i < cycle.steps.length - 1 && <span className="arrow">›</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="mini-cards">
        {cardMeta.map(({ data, icon, cls }) => (
          <article key={data.title} className={`mini-card ${cls}`}>
            <span className="mini-card__icon">
              <Icon name={icon} />
            </span>
            <div>
              <h4>{data.title}</h4>
              <p>{data.body}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function RequestPanel() {
  return (
    <div className="panel panel--light">
      <PanelHead num="P.3" title={familyRequest.title} />
      <p className="p-lead">{familyRequest.lead}</p>

      <div className="dodont">
        <article className="dodont__col dodont__col--dont">
          <h4>
            <span className="badge badge--dont">×</span>
            {familyRequest.dont.title}
          </h4>
          <ul>
            {familyRequest.dont.items.map((item) => (
              <li key={item}>
                <span className="mark mark--dont" aria-hidden="true">
                  ×
                </span>
                {item}
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
            {familyRequest.do.items.map((item) => (
              <li key={item}>
                <span className="mark mark--do" aria-hidden="true">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="dodont__note dodont__note--do">
            {familyRequest.do.note}
          </p>
        </article>
      </div>

      <div className="flow">
        <h4>{ifReturns.title}</h4>
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

      <div className="meeting">
        <h4>{familyMeeting.title}</h4>
        <ul className="meeting__benefits">
          {familyMeeting.benefits.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <dl className="meeting__info">
          {familyMeeting.info.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        <a className="meeting__url" href={org.website} target="_blank" rel="noreferrer">
          {org.websiteLabel}：{org.website}
        </a>
      </div>
    </div>
  )
}

function BackPanel() {
  return (
    <div className="panel panel--back panel--dark">
      <SunriseRoad className="sunrise-road" />
      <span className="corner corner--tl" />
      <span className="corner corner--br" />
      <div className="back__message">
        {backCover.message.map((line) => (
          <p key={line}>{line}</p>
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
        <a className="contact__site" href={org.website} target="_blank" rel="noreferrer">
          <Icon name="globe" className="icon-inline" />
          {org.websiteLabel}
        </a>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="booklet">
      <div className="print-hint">
        <b>A4 二つ折り（仕上がり A5）4ページ冊子</b>
        <br />
        印刷方法：ブラウザの印刷で「用紙：A4／向き：横／余白：なし／背景のグラフィック：オン」を選び、
        <b>両面印刷（長辺とじ）</b>で2枚を1枚に印刷して中央で二つ折りにしてください。
        1枚目が表紙・裏表紙（外面）、2枚目が中面（P2・P3）です。
        <br />
        <button type="button" onClick={() => window.print()}>
          印刷 / PDF保存
        </button>
      </div>

      {/* 外面：左＝裏表紙(P4)／右＝表紙(P1) 折ると表紙が前面 */}
      <p className="sheet__label">シート1（外面）</p>
      <section className="sheet sheet--outside" aria-label="外面（表紙・裏表紙）">
        <BackPanel />
        <CoverPanel />
        <span className="fold-line" />
      </section>

      {/* 中面：左＝P2（夜11時の物語）／右＝P3（お願いしたいこと） */}
      <p className="sheet__label">シート2（中面）</p>
      <section className="sheet sheet--inside" aria-label="中面（本文）">
        <StoryPanel />
        <RequestPanel />
        <span className="fold-line" />
      </section>
    </div>
  )
}

export default App
