export type IconName =
  | 'heart'
  | 'people'
  | 'hands'
  | 'phone'
  | 'globe'
  | 'brain'
  | 'shield'
  | 'home'
  | 'door'
  | 'alert'
  | 'check'
  | 'cross'
  | 'chat'
  | 'book'
  | 'leaf'
  | 'compass'
  | 'link'
  | 'sun'

type IconProps = {
  name: IconName
  className?: string
}

// fill 系（塗り）と stroke 系（線）で描き分ける
const fillIcons: IconName[] = ['heart', 'phone']

const paths: Record<IconName, React.ReactNode> = {
  heart: (
    <path d="M12 21s-6.7-4.35-9.33-8.02C.9 10.3 1.4 6.9 4.06 5.5 6.1 4.42 8.4 5.06 9.6 6.7L12 9.9l2.4-3.2c1.2-1.64 3.5-2.28 5.54-1.2 2.66 1.4 3.16 4.8 1.39 7.48C18.7 16.65 12 21 12 21z" />
  ),
  phone: (
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .5 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.5-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1L6.6 10.8z" />
  ),
  people: (
    <>
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="8" r="3" />
      <path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M14 14c3 0 6 2.4 6 6" />
    </>
  ),
  hands: (
    <>
      <path d="M12 6c1-2 3-3 5-2s2 4 0 6l-5 5-5-5c-2-2-2-5 0-6s4 0 5 2z" />
      <path d="M4 14l3 3" />
      <path d="M20 14l-3 3" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.6 4 6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-6-4-9s1.5-6.4 4-9z" />
    </>
  ),
  brain: (
    <>
      <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V15a3 3 0 0 0 4 2.8" />
      <path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V15a3 3 0 0 1-4 2.8" />
      <path d="M9 4a2.5 2.5 0 0 1 3 0" />
      <path d="M12 6v13" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  home: (
    <>
      <path d="M4 11l8-6 8 6" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-5h4v5" />
    </>
  ),
  door: (
    <>
      <path d="M6 3h9v18H6z" />
      <path d="M6 21H4M15 21h5V3h-5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4l9 16H3z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17" r="0.6" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-5" />
    </>
  ),
  cross: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5h16v11H9l-4 3v-3H4z" />
      <path d="M8 9h8M8 12h5" />
    </>
  ),
  book: (
    <>
      <path d="M5 4h9a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H5z" />
      <path d="M17 7h2v13a2.5 2.5 0 0 0-2.5-2.5H14" />
    </>
  ),
  leaf: (
    <>
      <path d="M4 20c0-8 6-14 16-14 0 10-6 15-13 15a5 5 0 0 1-3-1z" />
      <path d="M9 16c2-3 5-5 8-6" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </>
  ),
  link: (
    <>
      <path d="M9 12a4 4 0 0 1 4-4h3a4 4 0 0 1 0 8h-1" />
      <path d="M15 12a4 4 0 0 1-4 4H8a4 4 0 0 1 0-8h1" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
    </>
  ),
}

export function Icon({ name, className }: IconProps) {
  const isFill = fillIcons.includes(name)
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={isFill ? 'currentColor' : 'none'}
      stroke={isFill ? 'none' : 'currentColor'}
      strokeWidth={isFill ? 0 : 1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
