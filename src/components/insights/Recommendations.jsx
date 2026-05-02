import { T } from '../../theme.js'
import EmptyState from '../ui/EmptyState.jsx'

const PRIORITY_COLOR = {
  high: { bg: T.dangerBg, color: T.danger, label: 'Alta' },
  medium: { bg: T.warningBg, color: '#92400E', label: 'Média' },
  low: { bg: T.infoBg, color: T.info, label: 'Baixa' },
}

const ACTION_COLOR = {
  Escalar: T.success,
  Pausar: T.danger,
  'Renovar criativo': T.warning,
  'Testar WhatsApp': T.info,
}

export default function Recommendations({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <EmptyState
        title="Sem recomendações estratégicas"
        message="As recomendações estratégicas surgirão à medida que houver dados suficientes para analisar oportunidades de escala, pausas e otimização de criativos."
        compact
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {recommendations.map((r) => {
        const priority = PRIORITY_COLOR[r.priority] || PRIORITY_COLOR.medium
        const actionColor = ACTION_COLOR[r.action] || T.primary
        return (
          <div
            key={r.id}
            style={{
              padding: '14px 16px',
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: T.radius,
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                padding: '4px 10px',
                background: actionColor,
                color: '#fff',
                borderRadius: 999,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.4,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                marginTop: 2,
              }}
            >
              {r.action}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: T.text,
                    fontFamily: T.fontDisplay,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {r.target}
                </div>
                <span
                  style={{
                    padding: '2px 8px',
                    background: priority.bg,
                    color: priority.color,
                    borderRadius: 999,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 0.4,
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {priority.label}
                </span>
              </div>
              <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 6, fontWeight: 500 }}>
                {r.reason}
              </div>
              <div style={{ fontSize: 12, color: T.text, lineHeight: 1.5 }}>{r.suggestion}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
