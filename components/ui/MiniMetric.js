import { T } from '../../theme.js'

export default function MiniMetric({ label, value, hint }) {
  return (
    <div
      style={{
        background: T.bg,
        padding: '8px 10px',
        borderRadius: T.radius,
        border: `1px solid ${T.borderLight}`,
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: T.textMuted,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 0.4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 13,
          fontFamily: T.fontMono,
          fontWeight: 700,
          marginTop: 2,
          color: T.text,
        }}
      >
        {value}
      </div>
      {hint && <div style={{ fontSize: 9, color: T.textSubtle, marginTop: 2 }}>{hint}</div>}
    </div>
  )
}
