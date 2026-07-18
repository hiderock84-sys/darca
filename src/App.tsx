import { Icon, type IconName } from './components/Icons'
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

function Brand({ light = false }: { light?: boolean }) {
  return (
    <div className={`brand ${light ? 'brand--light' : ''}`}>
      <span className="brand__logo">{org.brand}</span>
      <span className="brand__name">{org.name}</span>
    </div>
  )
}

function App() {
  return (
    <div className="page">
      <header className="topbar">
        <Brand />
        <nav className="topbar__nav" aria-label="ページ内ナビゲーション">
          <a href="#story">夜11時の物語</a>
          <a href="#request">お願いしたいこと</a>
          <a href="#meeting">家族会</a>
          <a className="topbar__cta" href={`tel:${org.phone}`}>
            <Icon name="phone" className="icon-inline" />
            {org.phone}
          </a>
        </nav>
      </header>

      <main>
        {/* P1 表紙 */}
        <section className="cover" id="top">
          <div className="cover__inner">
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
        </section>

        {/* P2 夜11時の物語 */}
        <section className="story" id="story">
          <div className="section__head">
            <h2>{story.title}</h2>
          </div>
          <div className="story__grid">
            <div className="story__text">
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
            </div>

            <aside className="cycle" aria-label={cycle.title}>
              <h3>{cycle.title}</h3>
              <ol className="cycle__list">
                {cycle.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <p className="cycle__loop">↻ この輪を断ち切ることが回復です</p>
            </aside>
          </div>

          <div className="cards">
            <article className="card">
              <h3>{cards.addiction.title}</h3>
              <p>{cards.addiction.body}</p>
            </article>
            <article className="card">
              <h3>{cards.enabling.title}</h3>
              <p>{cards.enabling.body}</p>
            </article>
            <article className="card card--accent">
              <h3>{cards.today.title}</h3>
              <p>{cards.today.body}</p>
            </article>
            <article className="card card--soft">
              <h3>{cards.familySuffer.title}</h3>
              <p>{cards.familySuffer.body}</p>
            </article>
          </div>
        </section>

        {/* P3 ご家族にお願いしたいこと */}
        <section className="request" id="request">
          <div className="section__head">
            <h2>{familyRequest.title}</h2>
            <p className="section__lead">{familyRequest.lead}</p>
          </div>

          <div className="dodont">
            <article className="dodont__col dodont__col--dont">
              <h3>
                <span className="badge badge--dont">×</span>
                {familyRequest.dont.title}
              </h3>
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
              <h3>
                <span className="badge badge--do">✓</span>
                {familyRequest.do.title}
              </h3>
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
            <h3>{ifReturns.title}</h3>
            <ol className="flow__steps">
              {ifReturns.steps.map((s, i) => (
                <li key={s.title} className="flow__step">
                  <span className="flow__num">{i + 1}</span>
                  <span className="flow__step-title">{s.title}</span>
                  <span className="flow__step-note">{s.note}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 家族会 */}
        <section className="meeting" id="meeting">
          <div className="meeting__inner">
            <h2>{familyMeeting.title}</h2>
            <p className="section__lead">{familyMeeting.lead}</p>
            <ul className="benefits">
              {familyMeeting.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <dl className="meeting__info">
              {familyMeeting.info.map((row) => (
                <div key={row.label} className="meeting__row">
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            <a className="btn" href={org.website} target="_blank" rel="noreferrer">
              家族会の詳細・お申込はこちら
            </a>
          </div>
        </section>

        {/* P4 裏表紙 */}
        <section className="closing" id="contact">
          <div className="closing__message">
            {backCover.message.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <ul className="pillars pillars--light">
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
            <Brand light />
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
      </main>

      <footer className="footer">
        <p>
          © {new Date().getFullYear()} {org.name}（{org.brand}）
        </p>
      </footer>
    </div>
  )
}

export default App
