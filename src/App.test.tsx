import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'
import { org, cover, familyRequest, story } from './data/guide'

describe('回復支援ガイド 冊子', () => {
  it('表紙のタイトルと団体名を表示する', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { level: 1, name: cover.title }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(org.name).length).toBeGreaterThan(0)
  })

  it('4パネル分の見出し（夜11時の物語／お願いしたいこと）を表示する', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { level: 2, name: story.title }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: familyRequest.title }),
    ).toBeInTheDocument()
  })

  it('やってはいけないこと／やっていただきたいことの項目を表示する', () => {
    render(<App />)
    for (const item of familyRequest.dont.items) {
      expect(screen.getAllByText(item).length).toBeGreaterThan(0)
    }
    for (const item of familyRequest.do.items) {
      expect(screen.getAllByText(item).length).toBeGreaterThan(0)
    }
  })

  it('外面・中面の2シート構成である', () => {
    render(<App />)
    expect(
      screen.getByRole('region', { name: '外面（表紙・裏表紙）' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: '中面（本文）' }),
    ).toBeInTheDocument()
  })

  it('電話番号への発信リンクを表示する', () => {
    render(<App />)
    const telLinks = screen
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href') === `tel:${org.phone}`)
    expect(telLinks.length).toBeGreaterThan(0)
  })
})
