import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { T } from '../../theme.js'
import { fmtDate } from '../../utils/format.js'

export default function PerformanceChart({ data, height = 280 }) {
  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={T.borderLight} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={fmtDate}
            stroke={T.textMuted}
            fontSize={11}
            tick={{ fill: T.textMuted }}
          />
          <YAxis
            yAxisId="left"
            stroke={T.textMuted}
            fontSize={11}
            tick={{ fill: T.textMuted }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={T.textMuted}
            fontSize={11}
            tick={{ fill: T.textMuted }}
          />
          <Tooltip
            contentStyle={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: T.radius,
              fontSize: 12,
              boxShadow: T.shadowMd,
            }}
            labelFormatter={fmtDate}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="spend"
            stroke={T.primary}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: T.primary }}
            name="Investimento (R$)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="clicks"
            stroke={T.accent}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: T.accent }}
            name="Cliques"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
