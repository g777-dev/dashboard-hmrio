import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Section from '../components/ui/Section.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import { T, CHART_COLORS } from '../theme.js'
import { fmtMoney, fmtNum, fmtPct, objectiveLabel } from '../utils/format.js'
import { tableStyle, thStyle, tdStyle } from '../components/ui/buttons.js'

const MAX_COMPARE = 4

export default function CompareView({ data, isConnected }) {
  const [selected, setSelected] = useState([])

  const items = useMemo(
    () => data.campaigns.filter((c) => c.spend > 0),
    [data.campaigns],
  )

  const selectedCamps = useMemo(
    () => items.filter((c) => selected.includes(c.id)),
    [items, selected],
  )

  const chartData = useMemo(
    () => [
      {
        metric: 'CTR (%)',
        ...Object.fromEntries(selectedCamps.map((c) => [c.name.slice(0, 20), c.ctr || 0])),
      },
      {
        metric: 'CPC (R$)',
        ...Object.fromEntries(selectedCamps.map((c) => [c.name.slice(0, 20), c.cpc || 0])),
      },
      {
        metric: 'Cliques (k)',
        ...Object.fromEntries(selectedCamps.map((c) => [c.name.slice(0, 20), (c.clicks || 0) / 1000])),
      },
    ],
    [selectedCamps],
  )

  function toggle(id) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, id]
    })
  }

  if (!isConnected) {
    return (
      <EmptyState
        title="Aguardando conexão com a API Meta Ads"
        message="Conecte uma conta de anúncios para comparar campanhas."
      />
    )
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Sem campanhas com investimento para comparar"
        message="Apenas campanhas que investiram no período aparecem aqui. Aguarde dados ou troque o período."
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Section
        title="Comparativo de campanhas"
        subtitle={`Selecione até ${MAX_COMPARE} campanhas para comparar lado a lado`}
        action={
          selected.length > 0 ? (
            <button
              onClick={() => setSelected([])}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                border: `1px solid ${T.border}`,
                borderRadius: T.radius,
                fontSize: 12,
                cursor: 'pointer',
                color: T.text,
                fontWeight: 600,
              }}
            >
              Limpar seleção
            </button>
          ) : null
        }
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 10,
            maxHeight: 280,
            overflowY: 'auto',
            padding: 4,
          }}
        >
          {items.map((c) => {
            const isSel = selected.includes(c.id)
            const limit = !isSel && selected.length >= MAX_COMPARE
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                disabled={limit}
                style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  background: isSel ? T.primaryLight : T.surface,
                  border: `2px solid ${isSel ? T.primary : T.border}`,
                  borderRadius: T.radius,
                  cursor: limit ? 'not-allowed' : 'pointer',
                  opacity: limit ? 0.4 : 1,
                  fontFamily: T.fontBody,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  transition: 'all 0.15s',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 12,
                    color: T.text,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {c.name}
                </div>
                <div style={{ fontSize: 10, color: T.textMuted }}>
                  {fmtMoney(c.spend)} · CTR {fmtPct(c.ctr)}
                </div>
              </button>
            )
          })}
        </div>
      </Section>

      {selectedCamps.length === 0 ? (
        <EmptyState
          title="Nenhuma campanha selecionada"
          message="Clique nas campanhas acima para começar a comparação."
          compact
        />
      ) : (
        <>
          <Section title="Métricas comparadas" subtitle="Visão lado a lado">
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid stroke={T.borderLight} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="metric" stroke={T.textMuted} fontSize={11} />
                  <YAxis stroke={T.textMuted} fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: T.surface,
                      border: `1px solid ${T.border}`,
                      borderRadius: T.radius,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {selectedCamps.map((c, i) => (
                    <Bar
                      key={c.id}
                      dataKey={c.name.slice(0, 20)}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="Detalhamento" subtitle="Tabela completa">
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Campanha</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Objetivo</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Investido</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Cliques</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>CTR</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>CPC</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>CPM</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Alcance</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCamps.map((c) => (
                    <tr key={c.id}>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{c.name}</td>
                      <td style={tdStyle}>
                        <StatusBadge entity={c} />
                      </td>
                      <td style={{ ...tdStyle, fontSize: 12 }}>{objectiveLabel(c.objective)}</td>
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
                      <td style={{ ...tdStyle, textAlign: 'right', fontFamily: T.fontMono }}>
                        {fmtMoney(c.cpm)}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right', fontFamily: T.fontMono }}>
                        {fmtNum(c.reach)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </>
      )}
    </div>
  )
}
