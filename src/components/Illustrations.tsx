// 印刷冊子向けのインライン SVG イラスト（外部画像に依存しない）

export function NightScene({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="ns-moon" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fdf3d0" />
          <stop offset="1" stopColor="#e4c877" />
        </radialGradient>
        <linearGradient id="ns-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0e1f40" />
          <stop offset="1" stopColor="#060d1f" />
        </linearGradient>
      </defs>

      {/* 月 */}
      <circle cx="320" cy="60" r="26" fill="url(#ns-moon)" opacity="0.9" />
      <circle cx="320" cy="60" r="40" fill="#e4c877" opacity="0.12" />

      {/* 星 */}
      {[
        [40, 40],
        [80, 70],
        [140, 35],
        [200, 55],
        [260, 30],
        [110, 100],
        [360, 110],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 2 ? 1.2 : 1.8} fill="#fff" opacity="0.7" />
      ))}

      {/* ビル群のシルエット */}
      <g fill="#0b1830" opacity="0.85">
        <rect x="0" y="150" width="46" height="110" />
        <rect x="50" y="120" width="34" height="140" />
        <rect x="90" y="160" width="40" height="100" />
        <rect x="300" y="130" width="38" height="130" />
        <rect x="342" y="155" width="30" height="105" />
        <rect x="374" y="140" width="26" height="120" />
      </g>
      {/* 窓明かり */}
      <g fill="#e4c877" opacity="0.5">
        <rect x="58" y="132" width="5" height="6" />
        <rect x="68" y="132" width="5" height="6" />
        <rect x="58" y="146" width="5" height="6" />
        <rect x="308" y="142" width="5" height="6" />
        <rect x="318" y="142" width="5" height="6" />
        <rect x="308" y="158" width="5" height="6" />
      </g>

      {/* 地面 */}
      <rect x="0" y="215" width="400" height="45" fill="url(#ns-ground)" />
      <path d="M120 260 L185 218 L215 218 L280 260 Z" fill="#12244a" opacity="0.6" />

      {/* 歩く親子のシルエット */}
      <g fill="#05101f">
        <ellipse cx="182" cy="236" rx="14" ry="3" opacity="0.5" />
        <ellipse cx="212" cy="236" rx="12" ry="3" opacity="0.5" />
        {/* 親 */}
        <circle cx="182" cy="196" r="6" />
        <path d="M176 202 q6 -3 12 0 l2 22 q-8 3 -16 0 Z" />
        <rect x="178" y="224" width="3.5" height="12" />
        <rect x="184" y="224" width="3.5" height="12" />
        {/* 子 */}
        <circle cx="211" cy="203" r="5" />
        <path d="M206 208 q5 -3 10 0 l1.5 17 q-6 2 -13 0 Z" />
        <rect x="208" y="225" width="3" height="10" />
        <rect x="213" y="225" width="3" height="10" />
      </g>
    </svg>
  )
}

export function SunriseRoad({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="sr-sun" cx="0.5" cy="1" r="0.9">
          <stop offset="0" stopColor="#fff6df" />
          <stop offset="0.4" stopColor="#f6c56b" />
          <stop offset="1" stopColor="#f6a94a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sr-field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2f52" />
          <stop offset="1" stopColor="#241a3a" />
        </linearGradient>
      </defs>

      {/* 太陽の光 */}
      <ellipse cx="200" cy="150" rx="150" ry="120" fill="url(#sr-sun)" />
      <circle cx="200" cy="150" r="30" fill="#fff2cf" opacity="0.9" />

      {/* 野原 */}
      <rect x="0" y="150" width="400" height="110" fill="url(#sr-field)" />

      {/* 道（中央へ収束） */}
      <path d="M182 260 L196 152 L204 152 L218 260 Z" fill="#4a3a63" />
      <path d="M182 260 L196 152 L204 152 L218 260 Z" fill="#000" opacity="0.15" />
      {/* センターライン */}
      <g fill="#f6d99a" opacity="0.85">
        <rect x="198.6" y="240" width="3" height="12" />
        <rect x="198.8" y="214" width="2.6" height="10" />
        <rect x="199" y="192" width="2.2" height="8" />
        <rect x="199.2" y="176" width="1.8" height="6" />
      </g>

      {/* 沿道の木立 */}
      <g fill="#1c1430">
        <path d="M40 152 q10 -30 20 0 Z" />
        <path d="M70 155 q8 -22 16 0 Z" />
        <path d="M330 152 q11 -30 22 0 Z" />
        <path d="M300 156 q8 -20 16 0 Z" />
      </g>
    </svg>
  )
}

export function CircleOfPeople({ className }: { className?: string }) {
  const n = 8
  const cx = 100
  const cy = 100
  const r = 62
  const people = Array.from({ length: n }, (_, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
  })
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#c8a24a"
        strokeWidth="1"
        strokeDasharray="3 4"
        opacity="0.5"
      />
      {people.map((p, i) => (
        <g key={i} fill="#1b3363">
          <circle cx={p.x} cy={p.y - 7} r="6.5" />
          <path
            d={`M${p.x - 8} ${p.y + 14} q8 -10 16 0 Z`}
            fill="#1b3363"
          />
          <circle cx={p.x} cy={p.y + 2} r="9" fill="#1b3363" />
        </g>
      ))}
      <circle cx={cx} cy={cy} r="9" fill="#c8a24a" opacity="0.9" />
      <circle cx={cx} cy={cy} r="16" fill="#c8a24a" opacity="0.15" />
    </svg>
  )
}

export function PathToDawn({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 180"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="pd-sun" cx="0.5" cy="0.2" r="0.7">
          <stop offset="0" stopColor="#fff3d4" />
          <stop offset="0.5" stopColor="#f6c56b" />
          <stop offset="1" stopColor="#f6a94a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="36" rx="120" ry="70" fill="url(#pd-sun)" />
      <circle cx="200" cy="34" r="20" fill="#fff2cf" />
      <path
        d="M0 180 C 120 150, 150 90, 200 60 C 250 90, 280 150, 400 180 Z"
        fill="#2a2140"
        opacity="0.9"
      />
      <path
        d="M188 180 C 190 130, 196 90, 200 66 C 204 90, 210 130, 212 180 Z"
        fill="#e4c877"
        opacity="0.55"
      />
    </svg>
  )
}

export function Ornament({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 12" aria-hidden="true">
      <line x1="0" y1="6" x2="46" y2="6" stroke="#c8a24a" strokeWidth="0.8" />
      <line x1="74" y1="6" x2="120" y2="6" stroke="#c8a24a" strokeWidth="0.8" />
      <path d="M60 1 L64 6 L60 11 L56 6 Z" fill="#c8a24a" />
      <circle cx="49" cy="6" r="1.4" fill="#c8a24a" />
      <circle cx="71" cy="6" r="1.4" fill="#c8a24a" />
    </svg>
  )
}

export function CycleLoop({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 300 60" aria-hidden="true">
      <defs>
        <marker
          id="cl-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="#e4c877" />
        </marker>
      </defs>
      <path
        d="M20 44 C 20 8, 280 8, 280 44"
        fill="none"
        stroke="#e4c877"
        strokeWidth="1.4"
        strokeDasharray="4 3"
        markerEnd="url(#cl-arrow)"
        opacity="0.8"
      />
    </svg>
  )
}
