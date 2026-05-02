import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import KPICard from '../components/ui/KPICard.jsx'
import Section from '../components/ui/Section.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { T } from '../theme.js'
import { fmtMoney, fmtNum, fmtPct } from '../utils/format.js'
import { classifyStatus, STATUS } from '../utils/classify.js'
import { tableStyle, thStyle, tdStyle, trHover } from '../components/ui/buttons.js'

export default function AdSetsView({ data, isConnected }) {
  const { adsets } = data

  const totals = useMemo(() => {
    const t = adsets.reduce(
      (acc, a) => ({
        spend: acc.spend + (a.spend || 0),
        clicks: acc.clicks + (a.clicks || 0),
        impressions: acc.impressions + (a.impressions || 0),
      }),
      { spend: 0, clicks: 0, impressions: 0 },
    )
    t.ctr = t.impressions ? (t.clicks / t.impressions) * 100 : 0
    t.cpc = t.clicks ? t.spend / t.clicks : 0
    return t
  }, [adsets])

  const sorted = useMemo(
    () =>
      [...adsets]
        .filter((a) => classifyStatus(a) === STATUS.ACTIVE)
        .sort((a, b) => (b.spend || 0) - (a.spend || 0))
        .slice(0, 10),
    [adsets],
  )

  const ctrColor = (v) => {
    if (v >= 2) return { bg: T.successBg, dot: T.success }
    if (v >= 1) return { bg: T.warningBg, dot: T.warning }
    return { bg: T.dangerBg, dot: T.danger }
  }

  if (!isConnected) {
    return (
      <EmptyState
        title="Aguardando conexão com a API Meta Ads"
        message="Conecte uma conta de anúncios para visualizar os conjuntos."
      />
    )
  }

  if (adsets.length === 0) {
    return (
      <EmptyState
        title="Nenhum conjunto de anúncios"
        message="Não há conjuntos no período selecionado. Ajuste o período ou crie conjuntos no Gerenciador."
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <KPICard label="Cliques" value={fmtNum(totals.clicks)} />
        <KPICard label="Investido" value={fmtMoney(totals.spend)} />
        <KPICard label="CTR Médio" value={fmtPct(totals.ctr)} />
        <KPICard label="CPC Médio" value={fmtMoney(totals.cpc)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 14 }}>
        <Section title="Top 10 conjuntos por investimento" subtitle="Apenas ativos com gasto">
          {sorted.length > 0 ? (
            <div style={{ height: 360 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sorted} layout="vertical" margin={{ left: 30, right: 10 }}>
                  <CartesianGrid stroke={T.borderLight} strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" stroke={T.textMuted} fontSize={11} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke={T.textMuted}
                    fontSize={10}
                    width={130}
                  />
                  <Tooltip
                    formatter={(v) => fmtMoney(v)}
                    contentStyle={{
                      background: T.surface,
                      border: `1px solid ${T.border}`,
                      borderRadius: T.radius,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="spend" fill={T.primary} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState title="Sem conjuntos ativos" message="Aguardando dados." compact />
          )}
        </Section>

        <Section title="Detalhe dos conjuntos" subtitle="CTR e investimento">
          {sorted.length > 0 ? (
            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
              <table style={tableStyle}>
                <thead style={{ position: 'sticky', top: 0, background: T.surface, zIndex: 1 }}>
                  <tr>
                    <th style={thStyle}>Nome</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Spend</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>CTR</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((a) => {
                    const c = ctrColor(a.ctr)
                    return (
                      <tr key={a.id} style={trHover}>
                        <td style={{ ...tdStyle, fontSize: 12 }}>{a.name}</td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontFamily: T.fontMono, fontSize: 12 }}>
                          {fmtMoney(a.spend)}
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              padding: '2px 8px',
                              background: c.bg,
                              borderRadius: 999,
                              fontSize: 11,
                              fontFamily: T.fontMono,
                              fontWeight: 600,
                            }}
                          >
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: c.dot,
                              }}
                            />
                            {fmtPct(a.ctr)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="Sem conjuntos ativos" message="Aguardando dados." compact />
          )}
        </Section>
      </div>
    </div>
  )
}
