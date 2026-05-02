import { useMemo, useState } from 'react'
import Section from '../components/ui/Section.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import MiniMetric from '../components/ui/MiniMetric.jsx'
import { T } from '../theme.js'
import { fmtMoney, fmtNum, fmtPct } from '../utils/format.js'
import { classifyStatus, STATUS } from '../utils/classify.js'
import { selectStyle, cardStyle } from '../components/ui/buttons.js'

export default function CreativesView({ data, isConnected }) {
  const { ads, adsets, campaigns } = data
  const [campFilter, setCampFilter] = useState('all')
  const [adsetFilter, setAdsetFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredAdsets = useMemo(() => {
    if (campFilter === 'all') return adsets
    return adsets.filter((a) => a.campaign_id === campFilter)
  }, [adsets, campFilter])

  const filtered = useMemo(() => {
    return ads.filter((ad) => {
      const realStatus = classifyStatus(ad)
      if (campFilter !== 'all' && ad.campaign_id !== campFilter) return false
      if (adsetFilter !== 'all' && ad.adset_id !== adsetFilter) return false
      if (statusFilter !== 'all' && realStatus !== statusFilter) return false
      return true
    })
  }, [ads, campFilter, adsetFilter, statusFilter])

  const bestCtr = useMemo(() => {
    const active = filtered.filter((a) => classifyStatus(a) === STATUS.ACTIVE && a.spend > 20)
    if (active.length === 0) return null
    return [...active].sort((a, b) => (b.ctr || 0) - (a.ctr || 0))[0]
  }, [filtered])

  const worstCtr = useMemo(() => {
    const active = filtered.filter((a) => classifyStatus(a) === STATUS.ACTIVE && a.spend > 50)
    if (active.length < 2) return null
    return [...active].sort((a, b) => (a.ctr || 0) - (b.ctr || 0))[0]
  }, [filtered])

  if (!isConnected) {
    return (
      <EmptyState
        title="Aguardando conexão com a API Meta Ads"
        message="Conecte uma conta de anúncios para analisar os criativos."
      />
    )
  }

  if (ads.length === 0) {
    return (
      <EmptyState
        title="Nenhum criativo carregado"
        message="Não há anúncios no período selecionado. Ajuste o período no menu superior."
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          background: T.surface,
          padding: 14,
          borderRadius: T.radiusLg,
          border: `1px solid ${T.border}`,
          boxShadow: T.shadow,
        }}
      >
        <select
          value={campFilter}
          onChange={(e) => {
            setCampFilter(e.target.value)
            setAdsetFilter('all')
          }}
          style={selectStyle}
        >
          <option value="all">Todas as campanhas</option>
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select value={adsetFilter} onChange={(e) => setAdsetFilter(e.target.value)} style={selectStyle}>
          <option value="all">Todos os conjuntos</option>
          {filteredAdsets.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="all">Todos os status</option>
          <option value={STATUS.ACTIVE}>Ativos com investimento</option>
          <option value={STATUS.PAUSED}>Pausados</option>
          <option value={STATUS.NO_SPEND}>Sem investimento</option>
        </select>
        <span
          style={{
            fontSize: 12,
            color: T.textMuted,
            marginLeft: 'auto',
            alignSelf: 'center',
            fontWeight: 600,
          }}
        >
          {filtered.length} criativos
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
        {bestCtr && (
          <div
            style={{
              background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryDark} 100%)`,
              color: '#fff',
              padding: 18,
              borderRadius: T.radiusLg,
              borderLeft: `4px solid ${T.accent}`,
            }}
          >
            <div style={{ fontSize: 11, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 700 }}>
              ★ Melhor CTR
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4, fontFamily: T.fontDisplay, lineHeight: 1.2 }}>
              {bestCtr.name}
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, fontFamily: T.fontMono, color: T.accent, marginTop: 8 }}>
              {fmtPct(bestCtr.ctr)}
            </div>
          </div>
        )}
        {worstCtr && worstCtr.id !== bestCtr?.id && (
          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.danger}40`,
              borderLeft: `4px solid ${T.danger}`,
              padding: 18,
              borderRadius: T.radiusLg,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: T.danger,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                fontWeight: 700,
              }}
            >
              ⚠ Atenção
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                marginTop: 4,
                fontFamily: T.fontDisplay,
                color: T.text,
                lineHeight: 1.2,
              }}
            >
              {worstCtr.name}
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, fontFamily: T.fontMono, color: T.danger, marginTop: 8 }}>
              {fmtPct(worstCtr.ctr)}
            </div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>
              Considere pausar ou renovar este criativo.
            </div>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Sem criativos com os filtros atuais"
          message="Ajuste os filtros acima para visualizar outros criativos."
          compact
        />
      ) : (
        <Section title={`Lista de criativos`} subtitle={`${filtered.length} no total`}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 14,
            }}
          >
            {filtered.map((ad) => (
              <div key={ad.id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ad.name}
                  </div>
                  <StatusBadge entity={ad} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 12 }}>
                  <MiniMetric label="Spend" value={fmtMoney(ad.spend)} />
                  <MiniMetric label="Cliques" value={fmtNum(ad.clicks)} />
                  <MiniMetric label="CTR" value={fmtPct(ad.ctr)} />
                  <MiniMetric label="CPC" value={fmtMoney(ad.cpc)} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}
