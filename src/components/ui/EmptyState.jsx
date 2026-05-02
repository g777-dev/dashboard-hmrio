import { T } from '../../theme.js'

export default function EmptyState({ title, message, icon = '○', cta = null, compact = false }) {
  return (
    <div
      style={{
        padding: compact ? '24px 16px' : '48px 20px',
        textAlign: 'center',
        color: T.textMuted,
        background: T.bg,
        borderRadius: T.radiusLg,
        border: `1px dashed ${T.border}`,
      }}
    >
      <div
        style={{
          fontSize: compact ? 24 : 36,
          marginBottom: 10,
          color: T.primary,
          opacity: 0.5,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontWeight: 700,
          color: T.text,
          marginBottom: 6,
          fontSize: compact ? 14 : 16,
          fontFamily: T.fontDisplay,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.5, maxWidth: 420, margin: '0 auto' }}>{message}</div>
      {cta && <div style={{ marginTop: 16 }}>{cta}</div>}
    </div>
  )
}
