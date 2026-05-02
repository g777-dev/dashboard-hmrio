import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { T } from '../../theme.js'
import { fmtDate, fmtMoney } from '../../utils/format.js'

export default function HistoryTimeline({ data, height = 320 }) {
  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="grad-spend-history" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={T.primary} stopOpacity={0.4} />
              <stop offset="100%" stopColor={T.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={T.borderLight} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={fmtDate}
            stroke={T.textMuted}
            fontSize={11}
            tick={{ fill: T.textMuted }}
          />
          <YAxis stroke={T.textMuted} fontSize={11} tick={{ fill: T.textMuted }} />
          <Tooltip
            contentStyle={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: T.radius,
              fontSize: 12,
              boxShadow: T.shadowMd,
            }}
            formatter={(v) => fmtMoney(v)}
            labelFormatter={fmtDate}
          />
          <Area
            type="monotone"
            dataKey="spend"
            stroke={T.primary}
            strokeWidth={2}
            fill="url(#grad-spend-history)"
            name="Investimento"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
