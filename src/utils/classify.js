// ============================================
// CLASSIFICAÇÃO DE STATUS — Status real baseado em dados
// Regra principal: campanha só aparece como "Ativa" se tiver
// status=ACTIVE E spend > 0. Caso contrário, status mais honesto.
// ============================================

export const STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  NO_SPEND: 'no_spend',
  WAITING: 'waiting',
  ARCHIVED: 'archived',
  DELETED: 'deleted',
}

export const STATUS_META = {
  [STATUS.ACTIVE]: {
    label: 'Ativa',
    color: '#0F7A3E',
    bg: '#DCFCE7',
    dot: '#0F7A3E',
  },
  [STATUS.PAUSED]: {
    label: 'Pausada',
    color: '#92400E',
    bg: '#FEF3C7',
    dot: '#F59E0B',
  },
  [STATUS.NO_SPEND]: {
    label: 'Sem investimento',
    color: '#5C7268',
    bg: '#F3F4F6',
    dot: '#9CA3AF',
  },
  [STATUS.WAITING]: {
    label: 'Aguardando dados',
    color: '#0284C7',
    bg: '#E0F2FE',
    dot: '#0284C7',
  },
  [STATUS.ARCHIVED]: {
    label: 'Arquivada',
    color: '#5C7268',
    bg: '#F3F4F6',
    dot: '#9CA3AF',
  },
  [STATUS.DELETED]: {
    label: 'Excluída',
    color: '#DC2626',
    bg: '#FEE2E2',
    dot: '#DC2626',
  },
}

/**
 * Classifica o status real da entidade (campanha, conjunto ou anúncio)
 * baseado no status do Meta + dados de investimento.
 *
 * Regra de ouro:
 * - ACTIVE só aparece se metaStatus=ACTIVE E spend > 0
 * - ACTIVE com spend=0 vira NO_SPEND (sem investimento)
 * - ACTIVE recente sem dados ainda vira WAITING (aguardando dados)
 */
export function classifyStatus(entity) {
  const metaStatus = entity?.status
  const spend = Number(entity?.spend || 0)
  const impressions = Number(entity?.impressions || 0)

  if (metaStatus === 'DELETED') return STATUS.DELETED
  if (metaStatus === 'ARCHIVED') return STATUS.ARCHIVED
  if (metaStatus === 'PAUSED') return STATUS.PAUSED

  if (metaStatus === 'ACTIVE') {
    if (spend > 0) return STATUS.ACTIVE
    if (impressions > 0) return STATUS.ACTIVE
    // Ativo no Meta mas sem dados ainda
    const created = entity?.created_time ? new Date(entity.created_time) : null
    const hoursSinceCreation = created ? (Date.now() - created.getTime()) / (1000 * 60 * 60) : null
    if (hoursSinceCreation !== null && hoursSinceCreation < 48) {
      return STATUS.WAITING
    }
    return STATUS.NO_SPEND
  }

  return STATUS.NO_SPEND
}

export function statusMeta(realStatus) {
  return STATUS_META[realStatus] || STATUS_META[STATUS.NO_SPEND]
}

/**
 * Classifica a categoria da campanha pra abas dedicadas
 * (WhatsApp, Awareness/Engagement, etc)
 */
export function classifyCategory(objective) {
  if (!objective) return 'other'
  const o = objective.toUpperCase()
  if (o.includes('MESSAG')) return 'whatsapp'
  if (o.includes('AWARENESS')) return 'awareness'
  if (o.includes('ENGAGEMENT')) return 'engagement'
  if (o.includes('LEAD')) return 'leads'
  if (o.includes('TRAFFIC') || o.includes('LINK_CLICKS')) return 'traffic'
  if (o.includes('SALES') || o.includes('CONVERSION')) return 'sales'
  return 'other'
}
