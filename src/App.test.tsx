import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'
import { org, cover, familyRequest } from './data/guide'

describe('回復支援ガイド App', () => {
  it('表紙のタイトルと団体名を表示する', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { level: 1, name: cover.title }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(org.name).length).toBeGreaterThan(0)
  })

  it('「やってはいけないこと」と「やっていただきたいこと」の項目を表示する', () => {
    render(<App />)
    expect(screen.getByText(familyRequest.dont.title)).toBeInTheDocument()
    expect(screen.getByText(familyRequest.do.title)).toBeInTheDocument()
    for (const item of familyRequest.dont.items) {
      expect(screen.getByText(item)).toBeInTheDocument()
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
