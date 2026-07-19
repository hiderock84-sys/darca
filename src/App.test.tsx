import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'
import { org, cover, ch7, ch8, ch10, promise } from './data/manual'

describe('家族回復支援実践マニュアル', () => {
  it('表紙のタイトルと発行団体名を表示する', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { level: 1, name: cover.title }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(org.name).length).toBeGreaterThan(0)
  })

  it('導入ストーリーの見出しを表示する', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: 'あの日、玄関のチャイムが鳴りました' }),
    ).toBeInTheDocument()
  })

  it('全11章の章タイトルを表示する', () => {
    render(<App />)
    for (const title of [
      '依存症とは何か',
      '家族の病気とは',
      'イネーブリングとは',
      'なぜ家へ入れてはいけないのか',
      '本人が帰宅した時の対応',
      '電話・病院・警察から連絡があった時',
      '家族がやってはいけないこと',
      '家族が本当にやるべきこと',
      '実際によくあるケース',
      'よくある質問 Q&A',
      '家族会へ参加する意味',
    ]) {
      expect(
        screen.getByRole('heading', { level: 2, name: title }),
      ).toBeInTheDocument()
    }
  })

  it('やってはいけないこと・やるべきことの項目を表示する', () => {
    render(<App />)
    for (const item of ch7.dont.items) {
      expect(screen.getByText(item.title)).toBeInTheDocument()
    }
    for (const item of ch8.do.items) {
      expect(screen.getByText(item.title)).toBeInTheDocument()
    }
  })

  it('Q&Aを20問以上掲載している', () => {
    render(<App />)
    const total = ch10.groups.reduce((n, g) => n + g.items.length, 0)
    expect(total).toBeGreaterThanOrEqual(20)
    for (const g of ch10.groups) {
      for (const qa of g.items) {
        expect(screen.getByText(qa.q)).toBeInTheDocument()
      }
    }
  })

  it('最後のメッセージがスタッフ一同で締めくくられている', () => {
    render(<App />)
    expect(screen.getByText(promise.signoff)).toBeInTheDocument()
    expect(screen.getByText(promise.signoff)).toHaveTextContent('スタッフ一同')
  })

  it('電話番号への発信リンクを表示する', () => {
    render(<App />)
    const telLinks = screen
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href') === `tel:${org.phone}`)
    expect(telLinks.length).toBeGreaterThan(0)
  })
})
