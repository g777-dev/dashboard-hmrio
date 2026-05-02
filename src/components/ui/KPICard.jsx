import { ResponsiveContainer, AreaChart, Area } from 'recharts'
import { T } from '../../theme.js'

export default function KPICard({ label, value, sub, trend, accent = false }) {
  const id = `g-${label.replace(/\s/g, '-')}`
  return (
    <div
      style={{
        background: accent
          ? `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryDark} 100%)`
          : T.surface,
        border: `1px solid ${accent ? T.primaryDark : T.border}`,
        borderRadius: T.radiusLg,
        padding: '18px 20px',
        flex: 1,
        minWidth: 180,
        boxShadow: T.shadow,
        color: accent ? '#fff' : T.text,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: accent ? 'rgba(255,255,255,0.85)' : T.textMuted,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          fontWeight: 700,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          marginTop: 6,
          fontFamily: T.fontMono,
          letterSpacing: -0.5,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontSize: 11,
            color: accent ? 'rgba(255,255,255,0.75)' : T.textMuted,
            marginTop: 4,
          }}
        >
          {sub}
        </div>
      )}
      {trend && trend.length > 0 && (
        <div style={{ marginTop: 10, height: 32 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={accent ? '#fff' : T.primary}
                    stopOpacity={accent ? 0.5 : 0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor={accent ? '#fff' : T.primary}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={accent ? '#fff' : T.primary}
                strokeWidth={1.5}
                fill={`url(#${id})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
