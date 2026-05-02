// ============================================
// FORMATADORES — Padrão pt-BR
// ============================================

export const fmtMoney = (v) =>
  'R$ ' +
  Number(v || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

export const fmtMoneyShort = (v) => {
  const n = Number(v || 0)
  if (n >= 1_000_000) return 'R$ ' + (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return 'R$ ' + (n / 1_000).toFixed(1) + 'K'
  return fmtMoney(n)
}

export const fmtNum = (v) => {
  const n = Number(v || 0)
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toLocaleString('pt-BR')
}

export const fmtNumExact = (v) => Number(v || 0).toLocaleString('pt-BR')

export const fmtPct = (v) => Number(v || 0).toFixed(2) + '%'

export const fmtDate = (d) => {
  if (!d) return ''
  const dt = new Date(d)
  return dt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export const fmtDateTime = (d) => {
  if (!d) return ''
  const dt = new Date(d)
  return dt.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const fmtTime = (d) => {
  if (!d) return ''
  const dt = new Date(d)
  return dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export const objectiveLabel = (o) => {
  const map = {
    OUTCOME_TRAFFIC: 'Tráfego',
    OUTCOME_ENGAGEMENT: 'Engajamento',
    OUTCOME_LEADS: 'Leads',
    OUTCOME_SALES: 'Vendas',
    OUTCOME_AWARENESS: 'Reconhecimento',
    OUTCOME_APP_PROMOTION: 'App',
    LINK_CLICKS: 'Cliques',
    CONVERSIONS: 'Conversões',
    REACH: 'Alcance',
    MESSAGES: 'Mensagens',
    POST_ENGAGEMENT: 'Engajamento',
    PAGE_LIKES: 'Curtidas',
    LEAD_GENERATION: 'Captação de Leads',
  }
  return map[o] || o || '—'
}
