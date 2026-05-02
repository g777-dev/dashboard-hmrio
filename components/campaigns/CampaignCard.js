import { T } from '../../theme.js'
import { fmtMoney, fmtNum, fmtPct, objectiveLabel } from '../../utils/format.js'
import { classifyStatus, STATUS } from '../../utils/classify.js'
import StatusBadge from '../ui/StatusBadge.jsx'
import MiniMetric from '../ui/MiniMetric.jsx'
import { cardStyle } from '../ui/buttons.js'

export default function CampaignCard({ campaign, onClick }) {
  const c = campaign
  const status = classifyStatus(c)
  const budget = Number(c.daily_budget || c.lifetime_budget || 0) / 100
  const usage = budget > 0 ? Math.min((c.spend / budget) * 100, 100) : 0
  const isLowPerf = status === STATUS.ACTIVE && c.spend > 100 && c.ctr < 1

  return (
    <div
      onClick={onClick}
      style={{
        ...cardStyle,
        cursor: onClick ? 'pointer' : 'default',
        borderLeft: isLowPerf ? `3px solid ${T.warning}` : cardStyle.border,
      }}
      onMouseEnter={(e) => onClick && (e.currentTarget.style.borderColor = T.primary)}
      onMouseLeave={(e) => onClick && (e.currentTarget.style.borderColor = T.border)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 4,
              color: T.text,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {c.name}
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 500 }}>
            {objectiveLabel(c.objective)}
          </div>
        </div>
        <StatusBadge realStatus={status} />
      </div>

      <div style={{ marginTop: 12 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11,
            color: T.textMuted,
            marginBottom: 4,
            fontWeight: 600,
          }}
        >
          <span>Investido</span>
          <span style={{ fontFamily: T.fontMono, color: T.text }}>
            {fmtMoney(c.spend)}
            {budget > 0 && (
              <span style={{ color: T.textSubtle }}> / {fmtMoney(budget)}</span>
            )}
          </span>
        </div>
        {budget > 0 && (
          <div
            style={{
              height: 6,
              background: T.bg,
              borderRadius: 999,
              overflow: 'hidden',
              border: `1px solid ${T.borderLight}`,
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${usage}%`,
                background: usage > 90 ? T.warning : T.primary,
                transition: 'width 0.3s',
              }}
            />
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14 }}>
        <MiniMetric label="Cliques" value={fmtNum(c.clicks)} />
        <MiniMetric label="CTR" value={fmtPct(c.ctr)} />
        <MiniMetric label="CPC" value={fmtMoney(c.cpc)} />
      </div>

      {c.leads > 0 || c.messages > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 8 }}>
          {c.leads > 0 && <MiniMetric label="Leads" value={fmtNum(c.leads)} />}
          {c.messages > 0 && <MiniMetric label="Conversas" value={fmtNum(c.messages)} />}
        </div>
      ) : null}
    </div>
  )
}
