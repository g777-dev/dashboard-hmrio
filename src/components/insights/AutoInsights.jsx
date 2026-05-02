import { T } from '../../theme.js'
import EmptyState from '../ui/EmptyState.jsx'

const SEVERITY_STYLES = {
  success: { bg: T.successBg, color: T.success, icon: '✓', border: T.success },
  warning: { bg: T.warningBg, color: '#92400E', icon: '!', border: T.warning },
  danger: { bg: T.dangerBg, color: T.danger, icon: '⚠', border: T.danger },
  info: { bg: T.infoBg, color: T.info, icon: 'i', border: T.info },
}

export default function AutoInsights({ insights }) {
  if (!insights || insights.length === 0) {
    return (
      <EmptyState
        title="Sem insights no momento"
        message="Quando houver dados suficientes, identificaremos padrões automaticamente: CTR caindo, custo por lead subindo, fadiga de criativos e oportunidades de escala."
        compact
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {insights.map((ins) => {
        const style = SEVERITY_STYLES[ins.severity] || SEVERITY_STYLES.info
        return (
          <div
            key={ins.id}
            style={{
              padding: '12px 14px',
              background: style.bg,
              borderLeft: `3px solid ${style.border}`,
              borderRadius: T.radius,
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: style.border,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {style.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: T.text,
                  marginBottom: 3,
                  fontFamily: T.fontDisplay,
                }}
              >
                {ins.title}
              </div>
              <div style={{ fontSize: 12, color: T.text, lineHeight: 1.5 }}>{ins.message}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
