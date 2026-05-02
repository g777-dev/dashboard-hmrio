import { T } from '../../theme.js'

const TABS = [
  { key: 'overview', label: 'Visão Geral' },
  { key: 'campaigns', label: 'Campanhas' },
  { key: 'adsets', label: 'Conjuntos' },
  { key: 'creatives', label: 'Criativos' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'awareness', label: 'Reconhecimento' },
  { key: 'compare', label: 'Comparar' },
  { key: 'history', label: 'Histórico' },
]

export default function Tabs({ active, onChange }) {
  return (
    <div
      style={{
        background: T.surface,
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '10px 24px',
          display: 'flex',
          gap: 4,
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {TABS.map((t) => {
          const isActive = active === t.key
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              style={{
                padding: '9px 16px',
                background: isActive ? T.primary : 'transparent',
                color: isActive ? '#fff' : T.textMuted,
                border: 'none',
                borderRadius: T.radius,
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: T.fontBody,
                transition: 'all 0.15s',
                letterSpacing: 0.2,
                whiteSpace: 'nowrap',
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
