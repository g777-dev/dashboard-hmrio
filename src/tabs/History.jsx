import { useMemo } from 'react'
import KPICard from '../components/ui/KPICard.jsx'
import Section from '../components/ui/Section.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import HistoryTimeline from '../components/charts/HistoryTimeline.jsx'
import { T } from '../theme.js'
import { fmtMoney, fmtNum, fmtDate } from '../utils/format.js'
import { tableStyle, thStyle, tdStyle } from '../components/ui/buttons.js'

export default function HistoryView({ data, isConnected }) {
  const { daily } = data

  const totals = useMemo(() => {
    const t = daily.reduce(
      (acc, d) => ({
        spend: acc.spend + (d.spend || 0),
        clicks: acc.clicks + (d.clicks || 0),
        impressions: acc.impressions + (d.impressions || 0),
        leads: acc.leads + (d.leads || 0),
        messages: acc.messages + (d.messages || 0),
      }),
      { spend: 0, clicks: 0, impressions: 0, leads: 0, messages: 0 },
    )
    t.avgDaily = daily.length > 0 ? t.spend / daily.length : 0
    return t
  }, [daily])

  // Comparativo: primeira metade vs segunda metade
  const split = useMemo(() => {
    if (daily.length < 4) return null
    const mid = Math.floor(daily.length / 2)
    const first = daily.slice(0, mid)
    const second = daily.slice(mid)
    const sumFirst = first.reduce((a, d) => a + (d.spend || 0), 0)
    const sumSecond = second.reduce((a, d) => a + (d.spend || 0), 0)
    const change = sumFirst > 0 ? ((sumSecond - sumFirst) / sumFirst) * 100 : 0
    return { sumFirst, sumSecond, change }
  }, [daily])

  // Top dias por investimento
  const topDays = useMemo(
    () => [...daily].sort((a, b) => (b.spend || 0) - (a.spend || 0)).slice(0, 7),
    [daily],
  )

  if (!isConnected) {
    return (
      <EmptyState
        title="Aguardando conexão com a API Meta Ads"
        message="Conecte uma conta de anúncios para visualizar o histórico de performance."
      />
    )
  }

  if (daily.length === 0) {
    return (
      <EmptyState
        title="Sem histórico no período"
        message="Não há dados diários no período selecionado. Aumente o período no menu superior para ver o histórico."
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <KPICard label="Total no período" value={fmtMoney(totals.spend)} sub={`${daily.length} dias`} accent />
        <KPICard label="Média diária" value={fmtMoney(totals.avgDaily)} sub="Investimento médio" />
        <KPICard label="Total cliques" value={fmtNum(totals.clicks)} />
        {split && (
          <KPICard
            label="Tendência"
            value={`${split.change >= 0 ? '+' : ''}${split.change.toFixed(1)}%`}
            sub="2ª vs 1ª metade"
          />
        )}
      </div>

      <Section title="Linha do tempo de investimento" subtitle="Evolução diária no período">
        <HistoryTimeline data={daily} />
      </Section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 18 }}>
        <Section title="Top 7 dias por investimento" subtitle="Dias de maior gasto">
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Data</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Spend</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Cliques</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>CTR</th>
                </tr>
              </thead>
              <tbody>
                {topDays.map((d) => (
                  <tr key={d.date}>
                    <td style={tdStyle}>{fmtDate(d.date)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontFamily: T.fontMono, fontWeight: 600 }}>
                      {fmtMoney(d.spend)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontFamily: T.fontMono }}>
                      {fmtNum(d.clicks)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontFamily: T.fontMono }}>
                      {(d.ctr || 0).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Resumo de retornos" subtitle="Acumulado no período">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { l: 'Total investido', v: fmtMoney(totals.spend) },
              { l: 'Impressões', v: fmtNum(totals.impressions) },
              { l: 'Cliques', v: fmtNum(totals.clicks) },
              { l: 'Leads', v: fmtNum(totals.leads) },
              { l: 'Conversas WhatsApp', v: fmtNum(totals.messages) },
            ].map((r, i, arr) => (
              <div
                key={r.l}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: i < arr.length - 1 ? 12 : 0,
                  borderBottom: i < arr.length - 1 ? `1px solid ${T.borderLight}` : 'none',
                }}
              >
                <span style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{r.l}</span>
                <span style={{ fontFamily: T.fontMono, fontWeight: 700, fontSize: 16, color: T.text }}>
                  {r.v}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
