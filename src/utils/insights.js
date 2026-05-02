// ============================================
// MOTOR DE INSIGHTS AUTOMÁTICOS
// Detecta padrões nos dados e gera alertas + recomendações
// ============================================

import { classifyStatus, classifyCategory, STATUS } from './classify.js'

/**
 * Gera lista de insights automáticos baseados nos dados das campanhas
 * Cada insight: { id, type, severity, title, message, related }
 */
export function generateInsights(data) {
  const insights = []
  const { campaigns = [], adsets = [], ads = [] } = data

  if (campaigns.length === 0) return insights

  // Filtra apenas ativas com gasto
  const activeCampaigns = campaigns.filter((c) => classifyStatus(c) === STATUS.ACTIVE)

  // 1. CTR muito baixo (< 0.8%)
  activeCampaigns.forEach((c) => {
    if (c.ctr < 0.8 && c.impressions > 1000) {
      insights.push({
        id: `low-ctr-${c.id}`,
        type: 'performance',
        severity: 'warning',
        title: 'CTR abaixo do esperado',
        message: `A campanha "${c.name}" está com CTR de ${c.ctr.toFixed(2)}%, abaixo da média do mercado B2B (1.5–2%). Considere revisar os criativos ou a segmentação.`,
        related: c.name,
      })
    }
  })

  // 2. CPC muito alto (acima de R$ 3 para B2B)
  activeCampaigns.forEach((c) => {
    if (c.cpc > 3 && c.clicks > 30) {
      insights.push({
        id: `high-cpc-${c.id}`,
        type: 'cost',
        severity: 'warning',
        title: 'CPC elevado',
        message: `A campanha "${c.name}" está com CPC de R$ ${c.cpc.toFixed(2)}. Para o segmento de distribuição, o ideal fica entre R$ 0,80 e R$ 2,50.`,
        related: c.name,
      })
    }
  })

  // 3. Campanha com investimento alto mas poucos cliques
  activeCampaigns.forEach((c) => {
    if (c.spend > 200 && c.clicks < 50) {
      insights.push({
        id: `low-clicks-${c.id}`,
        type: 'performance',
        severity: 'danger',
        title: 'Investimento sem retorno',
        message: `A campanha "${c.name}" investiu R$ ${c.spend.toFixed(2)} mas gerou apenas ${c.clicks} cliques. Avalie pausar e testar nova abordagem.`,
        related: c.name,
      })
    }
  })

  // 4. Top performer destacado
  const topByCtr = [...activeCampaigns].sort((a, b) => b.ctr - a.ctr)[0]
  if (topByCtr && topByCtr.ctr > 2.5 && topByCtr.spend > 50) {
    insights.push({
      id: `top-${topByCtr.id}`,
      type: 'opportunity',
      severity: 'success',
      title: 'Campanha de alta performance',
      message: `"${topByCtr.name}" apresenta CTR de ${topByCtr.ctr.toFixed(2)}% e CPC de R$ ${topByCtr.cpc.toFixed(2)}. Considere aumentar o orçamento desta campanha.`,
      related: topByCtr.name,
    })
  }

  // 5. Criativos com fadiga (alto CPM, baixo CTR)
  const fatigueCreatives = ads.filter((ad) => {
    const status = classifyStatus(ad)
    return status === STATUS.ACTIVE && ad.cpm > 30 && ad.ctr < 1
  })
  if (fatigueCreatives.length >= 2) {
    insights.push({
      id: 'creative-fatigue',
      type: 'creative',
      severity: 'warning',
      title: 'Possível fadiga de criativos',
      message: `${fatigueCreatives.length} criativos ativos apresentam CPM alto e CTR baixo, indicação de fadiga. Recomenda-se rotação ou novos criativos.`,
      related: null,
    })
  }

  // 6. Campanhas pausadas com bom histórico
  const goodPaused = campaigns.filter(
    (c) => classifyStatus(c) === STATUS.PAUSED && c.ctr > 2 && c.spend > 100,
  )
  if (goodPaused.length > 0) {
    insights.push({
      id: 'good-paused',
      type: 'opportunity',
      severity: 'info',
      title: 'Campanhas pausadas com potencial',
      message: `${goodPaused.length} campanhas pausadas tinham bom desempenho. Avalie reativar ou usar como referência para novas campanhas.`,
      related: null,
    })
  }

  return insights
}

/**
 * Gera recomendações estratégicas (ações sugeridas)
 */
export function generateRecommendations(data) {
  const recs = []
  const { campaigns = [], adsets = [], ads = [] } = data

  if (campaigns.length === 0) return recs

  const activeCampaigns = campaigns.filter((c) => classifyStatus(c) === STATUS.ACTIVE)

  // 1. Escalar top performers
  const topPerformers = activeCampaigns
    .filter((c) => c.ctr > 2 && c.cpc < 2 && c.spend > 50)
    .sort((a, b) => b.ctr - a.ctr)
    .slice(0, 3)

  topPerformers.forEach((c) => {
    recs.push({
      id: `scale-${c.id}`,
      action: 'Escalar',
      priority: 'high',
      target: c.name,
      reason: `CTR ${c.ctr.toFixed(2)}% e CPC R$ ${c.cpc.toFixed(2)}.`,
      suggestion: 'Aumentar orçamento em 20–30% e monitorar a curva de aprendizado por 3 dias.',
    })
  })

  // 2. Pausar campanhas de baixo desempenho
  const lowPerformers = activeCampaigns
    .filter((c) => c.spend > 150 && (c.clicks < 30 || c.ctr < 0.5))
    .slice(0, 5)

  lowPerformers.forEach((c) => {
    recs.push({
      id: `pause-${c.id}`,
      action: 'Pausar',
      priority: 'high',
      target: c.name,
      reason: `R$ ${c.spend.toFixed(2)} investidos com retorno baixo.`,
      suggestion: 'Pausar e reformular criativo, copy ou segmentação antes de retomar.',
    })
  })

  // 3. Refazer criativos com fadiga
  const fatigueAds = ads.filter((ad) => {
    return classifyStatus(ad) === STATUS.ACTIVE && ad.cpm > 30 && ad.ctr < 1
  }).slice(0, 3)

  fatigueAds.forEach((ad) => {
    recs.push({
      id: `creative-${ad.id}`,
      action: 'Renovar criativo',
      priority: 'medium',
      target: ad.name,
      reason: `CPM R$ ${ad.cpm.toFixed(2)} e CTR ${ad.ctr.toFixed(2)}%.`,
      suggestion: 'Testar nova abordagem visual com foco em produtos por categoria (festa, food service, limpeza).',
    })
  })

  // 4. Diversificar objetivos (segmento B2B)
  const objectives = new Set(activeCampaigns.map((c) => classifyCategory(c.objective)))
  if (!objectives.has('whatsapp') && activeCampaigns.length > 0) {
    recs.push({
      id: 'add-whatsapp',
      action: 'Testar WhatsApp',
      priority: 'medium',
      target: 'Estratégia geral',
      reason: 'Conta sem campanhas de mensagens.',
      suggestion: 'Para B2B distribuidora, campanhas de WhatsApp costumam ter custo por lead 30–50% menor que conversão tradicional.',
    })
  }

  return recs
}
