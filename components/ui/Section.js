import { T } from '../../theme.js'

export default function Section({ title, subtitle, action, children, padding = 20 }) {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: T.radiusLg,
        padding,
        boxShadow: T.shadow,
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 14,
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            {title && (
              <h3
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 700,
                  color: T.text,
                  fontFamily: T.fontDisplay,
                  letterSpacing: -0.2,
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{subtitle}</div>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
