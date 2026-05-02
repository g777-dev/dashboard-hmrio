import { useMemo } from 'react'
import KPICard from '../components/ui/KPICard.jsx'
import Section from '../components/ui/Section.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import CampaignCard from '../components/campaigns/CampaignCard.jsx'
import { fmtMoney, fmtNum, fmtPct } from '../utils/format.js'
import { classifyCategory } from '../utils/classify.js'

export default function AwarenessView({ data, isConnected }) {
  const awarenessCamps = useMemo(
    () =>
      data.campaigns.filter((c) => {
        const cat = classifyCategory(c.objective)
        return cat === 'awareness' || cat === 'engagement'
      }),
    [data.campaigns],
  )

  const totals = useMemo(() => {
    const t = awarenessCamps.reduce(
      (acc, c) => ({
        spend: acc.spend + (c.spend || 0),
        reach: acc.reach + (c.reach || 0),
        impressions: acc.impressions + (c.impressions || 0),
        engagement: acc.engagement + (c.post_engagement || 0),
      }),
      { spend: 0, reach: 0, impressions: 0, engagement: 0 },
    )
    t.cpm = t.impressions ? (t.spend / t.impressions) * 1000 : 0
    t.frequency = t.reach > 0 ? t.impressions / t.reach : 0
    return t
  }, [awarenessCamps])

  if (!isConnected) {
    return (
      <EmptyState
        title="Aguardando conexão com a API Meta Ads"
        message="Conecte uma conta de anúncios para visualizar campanhas de reconhecimento e engajamento."
      />
    )
  }

  if (awarenessCamps.length === 0) {
    return (
      <EmptyState
        title="Nenhuma campanha de reconhecimento ou engajamento"
        message="Esta aba mostrará campanhas com objetivo de Reconhecimento da Marca, Alcance ou Engajamento. Estratégias de topo de funil ajudam a construir presença no segmento de distribuição."
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <KPICard label="Alcance" value={fmtNum(totals.reach)} sub="Pessoas únicas" accent />
        <KPICard label="Impressões" value={fmtNum(totals.impressions)} sub="Total de visualizações" />
        <KPICard label="CPM" value={fmtMoney(totals.cpm)} sub="Custo por mil impressões" />
        <KPICard
          label="Frequência"
          value={totals.frequency.toFixed(2)}
          sub="Impressões por pessoa"
        />
      </div>

      <Section
        title="Campanhas de reconhecimento e engajamento"
        subtitle={`${awarenessCamps.length} ${awarenessCamps.length === 1 ? 'campanha' : 'campanhas'} de topo de funil`}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 14,
          }}
        >
          {awarenessCamps.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      </Section>
    </div>
  )
}
