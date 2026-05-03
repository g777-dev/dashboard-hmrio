import { useMemo } from 'react'
import KPICard from '../components/ui/KPICard.jsx'
import Section from '../components/ui/Section.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import CampaignCard from '../components/campaigns/CampaignCard.jsx'
import { fmtMoney, fmtNum } from '../utils/format.js'
import { classifyCategory } from '../utils/classify.js'

export default function WhatsAppView({ data, isConnected }) {
  const whatsappCamps = useMemo(
    () => data.campaigns.filter((c) => classifyCategory(c.objective) === 'whatsapp'),
    [data.campaigns],
  )

  const totals = useMemo(() => {
    const t = whatsappCamps.reduce(
      (acc, c) => ({
        spend: acc.spend + (c.spend || 0),
        messages: acc.messages + (c.messages || 0),
        clicks: acc.clicks + (c.clicks || 0),
        impressions: acc.impressions + (c.impressions || 0),
      }),
      { spend: 0, messages: 0, clicks: 0, impressions: 0 },
    )
    t.cpm_msg = t.messages > 0 ? t.spend / t.messages : 0
    return t
  }, [whatsappCamps])

  if (!isConnected) {
    return (
      <EmptyState
        title="Aguardando conexão com a API Meta Ads"
        message="Conecte uma conta de anúncios para visualizar campanhas de WhatsApp."
      />
    )
  }

  if (whatsappCamps.length === 0) {
    return (
      <EmptyState
        title="Nenhuma campanha de WhatsApp ativa"
        message="Para B2B distribuidora, campanhas com objetivo de Mensagens (WhatsApp) costumam apresentar custo por lead 30 a 50% menor que conversão tradicional. Considere testar."
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <KPICard
          label="Conversas iniciadas"
          value={fmtNum(totals.messages)}
          sub="Total de leads via WhatsApp"
          accent
        />
        <KPICard
          label="Custo por conversa"
          value={fmtMoney(totals.cpm_msg)}
          sub="CPL WhatsApp"
        />
        <KPICard label="Investimento" value={fmtMoney(totals.spend)} sub="Total no período" />
        <KPICard label="Cliques" value={fmtNum(totals.clicks)} sub="Cliques no botão" />
      </div>

      <Section
        title="Campanhas de WhatsApp"
        subtitle={`${whatsappCamps.length} ${whatsappCamps.length === 1 ? 'campanha' : 'campanhas'} com objetivo de mensagens`}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 14,
          }}
        >
          {whatsappCamps.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      </Section>
    </div>
  )
}
