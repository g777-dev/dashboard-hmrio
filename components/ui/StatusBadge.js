import { classifyStatus, statusMeta } from '../../utils/classify.js'

export default function StatusBadge({ entity, realStatus }) {
  const status = realStatus || classifyStatus(entity)
  const meta = statusMeta(status)

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 10px',
        background: meta.bg,
        color: meta.color,
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.3,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: meta.dot,
        }}
      />
      {meta.label}
    </span>
  )
}
