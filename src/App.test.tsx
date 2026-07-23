import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'
import {
  org,
  cover,
  story,
  familyRequest,
  chapters,
  toc,
  voices,
} from './data/guide'

describe('回復支援ガイド 全20ページ冊子', () => {
  it('表紙のタイトルと団体名を表示する', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { level: 1, name: cover.title }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(org.name).length).toBeGreaterThan(0)
  })

  it('ページ（section）が20枚ある', () => {
    const { container } = render(<App />)
    expect(container.querySelectorAll('.page').length).toBe(20)
  })

  it('全4章の章扉タイトルを表示する', () => {
    render(<App />)
    for (const c of Object.values(chapters)) {
      expect(screen.getAllByText(c.title).length).toBeGreaterThan(0)
    }
  })

  it('目次に全章が載っている', () => {
    render(<App />)
    for (const c of toc.chapters) {
      expect(screen.getAllByText(c.no).length).toBeGreaterThan(0)
    }
  })

  it('物語と、やること・やらないことの項目を表示する', () => {
    render(<App />)
    expect(
      screen.getAllByRole('heading', { level: 2, name: story.title }).length,
    ).toBeGreaterThan(0)
    for (const item of familyRequest.dont.items) {
      expect(screen.getAllByText(item).length).toBeGreaterThan(0)
    }
    for (const item of familyRequest.do.items) {
      expect(screen.getAllByText(item).length).toBeGreaterThan(0)
    }
  })

  it('回復した家族の声を表示する', () => {
    render(<App />)
    for (const v of voices.items) {
      expect(screen.getByText(v.text)).toBeInTheDocument()
    }
  })

  it('電話番号への発信リンクを表示する', () => {
    render(<App />)
    const telLinks = screen
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href') === `tel:${org.phone}`)
    expect(telLinks.length).toBeGreaterThan(0)
  })
})
