import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import KPICard from '../components/ui/KPICard.jsx'
import Section from '../components/ui/Section.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import PerformanceChart from '../components/charts/PerformanceChart.jsx'
import AutoInsights from '../components/insights/AutoInsights.jsx'
import Recommendations from '../components/insights/Recommendations.jsx'
import { T, CHART_COLORS } from '../theme.js'
import { fmtMoney, fmtNum, fmtPct, objectiveLabel } from '../utils/format.js'
import { generateInsights, generateRecommendations } from '../utils/insights.js'
import { classifyStatus, STATUS } from '../utils/classify.js'
import { tableStyle, thStyle, tdStyle, trHover } from '../components/ui/buttons.js'

export default function Overview({ data, isConnected }) {
  const { campaigns, daily } = data

  const totals = useMemo(() => {
    const t = campaigns.reduce(
      (acc, c) => ({
        spend: acc.spend + (c.spend || 0),
        clicks: acc.clicks + (c.clicks || 0),
        impressions: acc.impressions + (c.impressions || 0),
        reach: acc.reach + (c.reach || 0),
        leads: acc.leads + (c.leads || 0),
        messages: acc.messages + (c.messages || 0),
      }),
      { spend: 0, clicks: 0, impressions: 0, reach: 0, leads: 0, messages: 0 },
    )
    t.ctr = t.impressions ? (t.clicks / t.impressions) * 100 : 0
    t.cpc = t.clicks ? t.spend / t.clicks : 0
    t.cpm = t.impressions ? (t.spend / t.impressions) * 1000 : 0
    return t
  }, [campaigns])

  const sparkSpend = daily.slice(-14).map((d) => ({ v: d.spend }))
  const sparkReach = daily.slice(-14).map((d) => ({ v: d.reach }))
  const sparkCpc = daily.slice(-14).map((d) => ({ v: d.cpc }))
  const sparkCtr = daily.slice(-14).map((d) => ({ v: d.ctr }))

  const objDist = useMemo(() => {
    const map = {}
    campaigns.forEach((c) => {
      const key = objectiveLabel(c.objective)
      map[key] = (map[key] || 0) + (c.spend || 0)
    })
    return Object.entries(map)
      .filter(([_, v]) => v > 0)
      .map(([name, value]) => ({ name, value }))
  }, [campaigns])

  const ranked = useMemo(
    () =>
      [...campaigns]
        .filter((c) => classifyStatus(c) === STATUS.ACTIVE)
        .sort((a, b) => (b.spend || 0) - (a.spend || 0))
        .slice(0, 8),
    [campaigns],
  )

  const insights = useMemo(() => generateInsights(data), [data])
  const recommendations = useMemo(() => generateRecommendations(data), [data])

  if (!isConnected) {
    return (
      <EmptyState
        title="Aguardando conexão com a API Meta Ads"
        message="Conecte uma conta de anúncios para visualizar campanhas, métricas e insights em tempo real."
      />
    )
  }

  if (campaigns.length === 0) {
    return (
      <EmptyState
        title="Nenhuma campanha carregada ainda"
        message="A conta foi conectada mas ainda não há campanhas no período selecionado. Tente outro período ou crie campanhas no Gerenciador de Anúncios."
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* KPIs principais */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <KPICard label="Investimento" value={fmtMoney(totals.spend)} sub="Total no período" trend={sparkSpend} accent />
        <KPICard label="Alcance" value={fmtNum(totals.reach)} sub="Pessoas únicas" trend={sparkReach} />
        <KPICard label="CPC Médio" value={fmtMoney(totals.cpc)} sub="Custo por clique" trend={sparkCpc} />
        <KPICard label="CTR Médio" value={fmtPct(totals.ctr)} sub="Taxa de clique" trend={sparkCtr} />
      </div>

      {/* KPIs B2B (leads + WhatsApp) */}
      {(totals.leads > 0 || totals.messages > 0) && (
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {totals.leads > 0 && (
            <KPICard
              label="Leads"
              value={fmtNum(totals.leads)}
              sub={`Custo médio: ${fmtMoney(totals.spend / totals.leads)}`}
            />
          )}
          {totals.messages > 0 && (
            <KPICard
              label="Conversas WhatsApp"
              value={fmtNum(totals.messages)}
              sub={`Custo médio: ${fmtMoney(totals.spend / totals.messages)}`}
            />
          )}
          <KPICard label="Cliques" value={fmtNum(totals.clicks)} />
          <KPICard label="Impressões" value={fmtNum(totals.impressions)} sub="CPM " />
        </div>
      )}

      {/* Insights e Recomendações */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 18 }}>
        <Section
          title="Insights automáticos"
          subtitle="Padrões detectados nos dados das suas campanhas"
        >
          <AutoInsights insights={insights} />
        </Section>

        <Section
          title="Recomendações estratégicas"
          subtitle="Ações sugeridas para escalar e otimizar"
        >
          <Recommendations recommendations={recommendations} />
        </Section>
      </div>

      {/* Performance diária */}
      <Section title="Performance no período" subtitle="Investimento e cliques diários">
        {daily.length > 0 ? (
          <PerformanceChart data={daily} />
        ) : (
          <EmptyState
            title="Sem dados diários no período"
            message="Selecione outro período no menu superior ou aguarde dados suficientes."
            compact
          />
        )}
      </Section>

      {/* Distribuição + Eficiência */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 18 }}>
        <Section title="Distribuição por objetivo" subtitle="Investimento por tipo de campanha">
          {objDist.length > 0 ? (
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={objDist} dataKey="value" nameKey="name" outerRadius={80} label>
                    {objDist.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmtMoney(v)} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState title="Sem dados de distribuição" message="Aguardando dados." compact />
          )}
        </Section>

        <Section title="Eficiência geral" subtitle="Métricas consolidadas no período">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { l: 'CPC Médio', v: fmtMoney(totals.cpc), bench: 'B2B: R$ 0,80 a R$ 2,50' },
              { l: 'CTR Médio', v: fmtPct(totals.ctr), bench: 'B2B: 1,5% a 2,5%' },
              { l: 'CPM Médio', v: fmtMoney(totals.cpm), bench: 'B2B: R$ 12 a R$ 25' },
            ].map((r, i, arr) => (
              <div
                key={r.l}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  paddingBottom: i < arr.length - 1 ? 12 : 0,
                  borderBottom: i < arr.length - 1 ? `1px solid ${T.borderLight}` : 'none',
                }}
              >
                <div>
                  <div style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{r.l}</div>
                  <div style={{ fontSize: 10, color: T.textSubtle, marginTop: 2 }}>{r.bench}</div>
                </div>
                <span style={{ fontFamily: T.fontMono, fontWeight: 700, fontSize: 18, color: T.text }}>
                  {r.v}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Top campanhas ativas */}
      <Section
        title="Top campanhas ativas"
        subtitle="Apenas campanhas com investimento real no período"
      >
        {ranked.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Campanha</th>
                  <th style={thStyle}>Status</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Invest.</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Cliques</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>CTR</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>CPC</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((c, i) => (
                  <tr key={c.id} style={trHover}>
                    <td style={tdStyle}>
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          background: i < 3 ? T.primary : T.bg,
                          color: i < 3 ? '#fff' : T.textMuted,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{c.name}</td>
                    <td style={tdStyle}>
                      <StatusBadge entity={c} />
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontFamily: T.fontMono }}>
                      {fmtMoney(c.spend)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontFamily: T.fontMono }}>
                      {fmtNum(c.clicks)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontFamily: T.fontMono }}>
                      {fmtPct(c.ctr)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontFamily: T.fontMono }}>
                      {fmtMoney(c.cpc)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="Nenhuma campanha ativa com investimento"
            message="Não há campanhas marcadas como ativas e com gasto no período. Confira a aba Campanhas para ver todos os status."
            compact
          />
        )}
      </Section>
    </div>
  )
}
