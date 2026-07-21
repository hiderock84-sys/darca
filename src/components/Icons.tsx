export type IconName =
  | 'heart'
  | 'people'
  | 'hands'
  | 'phone'
  | 'globe'
  | 'brain'
  | 'chain'
  | 'sunrise'
  | 'home'

type IconProps = {
  name: IconName
  className?: string
}

const paths: Record<IconName, React.ReactNode> = {
  heart: (
    <path d="M12 21s-6.7-4.35-9.33-8.02C.9 10.3 1.4 6.9 4.06 5.5 6.1 4.42 8.4 5.06 9.6 6.7L12 9.9l2.4-3.2c1.2-1.64 3.5-2.28 5.54-1.2 2.66 1.4 3.16 4.8 1.39 7.48C18.7 16.65 12 21 12 21z" />
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
  phone: (
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .5 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.5-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1L6.6 10.8z" />
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
      <path d="M12 5v14" />
    </>
  ),
  chain: (
    <>
      <path d="M9.5 14.5l5-5" />
      <path d="M8 13l-2 2a3 3 0 0 0 4.2 4.2l2-2" />
      <path d="M16 11l2-2a3 3 0 0 0-4.2-4.2l-2 2" />
    </>
  ),
  sunrise: (
    <>
      <path d="M12 4v3" />
      <path d="M5.5 9.5 7 11" />
      <path d="M18.5 9.5 17 11" />
      <path d="M3 18h18" />
      <path d="M7 18a5 5 0 0 1 10 0" />
    </>
  ),
  home: (
    <>
      <path d="M4 11l8-6 8 6" />
      <path d="M6 10v9h12v-9" />
    </>
  ),
}

const strokeIcons: IconName[] = [
  'people',
  'hands',
  'globe',
  'brain',
  'chain',
  'sunrise',
  'home',
]

export function Icon({ name, className }: IconProps) {
  const isStroke = strokeIcons.includes(name)
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={isStroke ? 'none' : 'currentColor'}
      stroke={isStroke ? 'currentColor' : 'none'}
      strokeWidth={isStroke ? 1.6 : 0}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
