import { T } from '../../theme.js'
import { PERIODS } from '../../services/metaApi.js'

export default function PeriodSelector({ period, onChange, disabled = false }) {
  return (
    <select
      value={period}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      style={{
        padding: '8px 12px',
        border: `1px solid ${T.border}`,
        borderRadius: T.radius,
        fontSize: 13,
        background: T.surface,
        color: T.text,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: T.fontBody,
        fontWeight: 600,
        outline: 'none',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {Object.entries(PERIODS).map(([key, p]) => (
        <option key={key} value={key}>
          {p.label}
        </option>
      ))}
    </select>
  )
}
