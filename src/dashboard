import { useState, useCallback } from 'react'
import { T } from './theme.js'
import { useMetaData } from './hooks/useMetaData.js'

import Header from './components/layout/Header.jsx'
import Tabs from './components/layout/Tabs.jsx'
import Footer from './components/layout/Footer.jsx'
import ConnectionBanner from './components/layout/ConnectionBanner.jsx'

import ConnectModal from './components/ConnectModal.jsx'
import ShareModal from './components/ShareModal.jsx'
import AiChat from './AiChat.jsx'
import PeriodSelector from './components/ui/PeriodSelector.jsx'

import Overview from './tabs/Overview.jsx'
import Campaigns from './tabs/Campaigns.jsx'
import AdSets from './tabs/AdSets.jsx'
import Creatives from './tabs/Creatives.jsx'
import WhatsApp from './tabs/WhatsApp.jsx'
import Awareness from './tabs/Awareness.jsx'
import Compare from './tabs/Compare.jsx'
import History from './tabs/History.jsx'

import { fmtMoney, fmtNum, fmtPct, objectiveLabel } from './utils/format.js'
import { classifyStatus, STATUS } from './utils/classify.js'

export default function Dashboard() {
  const {
    data,
    loading,
    error,
    period,
    isConnected,
    connect,
    refresh,
    changePeriod,
  } = useMetaData()

  const [tab, setTab] = useState('overview')
  const [connectOpen, setConnectOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)

  // Constrói contexto resumido das campanhas para enviar à IA
  const buildAiContext = useCallback(() => {
    if (!isConnected || !data.campaigns.length) {
      return 'Nenhuma campanha conectada no momento.'
    }
    const totals = data.campaigns.reduce(
      (acc, c) => ({
        spend: acc.spend + (c.spend || 0),
        clicks: acc.clicks + (c.clicks || 0),
        impressions: acc.impressions + (c.impressions || 0),
        leads: acc.leads + (c.leads || 0),
        messages: acc.messages + (c.messages || 0),
      }),
      { spend: 0, clicks: 0, impressions: 0, leads: 0, messages: 0 },
    )
    const ctr = totals.impressions ? (totals.clicks / totals.impressions) * 100 : 0
    const cpc = totals.clicks ? totals.spend / totals.clicks : 0

    const active = data.campaigns.filter((c) => classifyStatus(c) === STATUS.ACTIVE)
    const top = [...active].sort((a, b) => b.spend - a.spend).slice(0, 5)

    const topLines = top
      .map(
        (c, i) =>
          `${i + 1}. "${c.name}" (${objectiveLabel(c.objective)}) — Spend ${fmtMoney(c.spend)} | Cliques ${fmtNum(c.clicks)} | CTR ${fmtPct(c.ctr)} | CPC ${fmtMoney(c.cpc)}`,
      )
      .join('\n')

    return `PERÍODO: ${period}
TOTAL CAMPANHAS: ${data.campaigns.length} (${active.length} ativas com investimento)
INVESTIMENTO TOTAL: ${fmtMoney(totals.spend)}
CLIQUES: ${fmtNum(totals.clicks)} | IMPRESSÕES: ${fmtNum(totals.impressions)}
LEADS: ${fmtNum(totals.leads)} | CONVERSAS WHATSAPP: ${fmtNum(totals.messages)}
CTR MÉDIO: ${fmtPct(ctr)} | CPC MÉDIO: ${fmtMoney(cpc)}

TOP 5 CAMPANHAS ATIVAS:
${topLines || 'Nenhuma campanha ativa com gasto.'}`
  }, [data, isConnected, period])

  const renderTab = () => {
    const props = { data, isConnected }
    switch (tab) {
      case 'overview':
        return <Overview {...props} />
      case 'campaigns':
        return <Campaigns {...props} />
      case 'adsets':
        return <AdSets {...props} />
      case 'creatives':
        return <Creatives {...props} />
      case 'whatsapp':
        return <WhatsApp {...props} />
      case 'awareness':
        return <Awareness {...props} />
      case 'compare':
        return <Compare {...props} />
      case 'history':
        return <History {...props} />
      default:
        return <Overview {...props} />
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: T.fontBody, color: T.text }}>
      <Header
        isConnected={isConnected}
        syncedAt={data.syncedAt}
        onConnect={() => setConnectOpen(true)}
        onShare={() => setShareOpen(true)}
        onAi={() => setAiOpen(true)}
        onRefresh={refresh}
        loading={loading}
      />
      <Tabs active={tab} onChange={setTab} />

      <main
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '20px 24px',
        }}
      >
        {/* Barra de período (só aparece se conectado) */}
        {isConnected && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            <div style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>
              {loading ? 'Atualizando dados...' : `Dados sincronizados · ${data.campaigns.length} campanhas no período`}
            </div>
            <PeriodSelector period={period} onChange={changePeriod} disabled={loading} />
          </div>
        )}

        {/* Banner quando desconectado */}
        {!isConnected && <ConnectionBanner onConnect={() => setConnectOpen(true)} />}

        {/* Erro global */}
        {error && (
          <div
            style={{
              background: T.dangerBg,
              color: T.danger,
              padding: '12px 16px',
              borderRadius: T.radius,
              fontSize: 13,
              marginBottom: 16,
              border: `1px solid ${T.danger}30`,
            }}
          >
            <strong>Erro:</strong> {error}
          </div>
        )}

        {/* Conteúdo da aba */}
        {renderTab()}
      </main>

      <Footer />

      <ConnectModal
        open={connectOpen}
        onClose={() => setConnectOpen(false)}
        onConnect={connect}
        loading={loading}
        error={error}
      />
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
      <AiChat open={aiOpen} onClose={() => setAiOpen(false)} contextBuilder={buildAiContext} />
    </div>
  )
}
