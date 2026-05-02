// ============================================
// CAMADA DE SERVIÇO — Meta Marketing API v19.0
// Expandida com:
// - Suporte a período customizável (last_7d, last_14d, last_30d, last_90d)
// - Busca de campanhas, conjuntos, criativos, insights e dados diários
// - Suporte a leads, ações e conversas (WhatsApp)
// ============================================

const API_VERSION = 'v19.0'
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`

// Períodos suportados (mapeamento amigável → date_preset Meta)
export const PERIODS = {
  today: { label: 'Hoje', preset: 'today' },
  yesterday: { label: 'Ontem', preset: 'yesterday' },
  last_7d: { label: 'Últimos 7 dias', preset: 'last_7d' },
  last_14d: { label: 'Últimos 14 dias', preset: 'last_14d' },
  last_30d: { label: 'Últimos 30 dias', preset: 'last_30d' },
  last_90d: { label: 'Últimos 90 dias', preset: 'last_90d' },
  this_month: { label: 'Mês atual', preset: 'this_month' },
  last_month: { label: 'Mês anterior', preset: 'last_month' },
}

async function fetchFromMeta(endpoint, accessToken, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`)
  url.searchParams.append('access_token', accessToken)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.append(k, v)
  })
  const res = await fetch(url.toString())
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Erro ${res.status} ao buscar ${endpoint}`)
  }
  return res.json()
}

export async function fetchCampaigns(accessToken, adAccountId) {
  const data = await fetchFromMeta(`/${adAccountId}/campaigns`, accessToken, {
    fields:
      'id,name,objective,status,daily_budget,lifetime_budget,start_time,stop_time,created_time,updated_time',
    limit: 100,
  })
  return data.data || []
}

export async function fetchAdSets(accessToken, adAccountId) {
  const data = await fetchFromMeta(`/${adAccountId}/adsets`, accessToken, {
    fields:
      'id,name,campaign_id,status,daily_budget,lifetime_budget,optimization_goal,billing_event,created_time',
    limit: 200,
  })
  return data.data || []
}

export async function fetchAds(accessToken, adAccountId) {
  const data = await fetchFromMeta(`/${adAccountId}/ads`, accessToken, {
    fields: 'id,name,adset_id,campaign_id,status,creative{id,name,thumbnail_url},created_time',
    limit: 500,
  })
  return data.data || []
}

export async function fetchInsights(accessToken, adAccountId, level = 'campaign', period = 'last_30d') {
  const preset = PERIODS[period]?.preset || 'last_30d'
  const data = await fetchFromMeta(`/${adAccountId}/insights`, accessToken, {
    level,
    fields:
      'campaign_id,adset_id,ad_id,impressions,clicks,spend,reach,ctr,cpc,cpm,actions,frequency,date_start,date_stop',
    date_preset: preset,
    limit: 500,
  })
  return data.data || []
}

export async function fetchDailyInsights(accessToken, adAccountId, period = 'last_30d') {
  const preset = PERIODS[period]?.preset || 'last_30d'
  const data = await fetchFromMeta(`/${adAccountId}/insights`, accessToken, {
    fields: 'spend,clicks,impressions,reach,ctr,cpc,cpm,actions',
    date_preset: preset,
    time_increment: 1,
    limit: 500,
  })
  return data.data || []
}

// Helpers
function indexBy(arr, key) {
  return arr.reduce((acc, item) => {
    acc[item[key]] = item
    return acc
  }, {})
}

// Extrai métricas de "actions" (leads, mensagens, conversas)
function extractActionMetrics(actions = []) {
  const metrics = { leads: 0, messages: 0, link_clicks: 0, post_engagement: 0 }
  actions.forEach((a) => {
    const t = a.action_type
    const v = Number(a.value || 0)
    if (t === 'lead' || t === 'onsite_conversion.lead_grouped') metrics.leads += v
    if (t === 'onsite_conversion.messaging_conversation_started_7d') metrics.messages += v
    if (t === 'link_click') metrics.link_clicks += v
    if (t === 'post_engagement') metrics.post_engagement += v
  })
  return metrics
}

function mergeInsights(items, insights, idKey) {
  const map = indexBy(insights, idKey)
  return items.map((item) => {
    const ins = map[item.id] || {}
    const actionMetrics = extractActionMetrics(ins.actions)
    return {
      ...item,
      impressions: Number(ins.impressions || 0),
      clicks: Number(ins.clicks || 0),
      spend: Number(ins.spend || 0),
      reach: Number(ins.reach || 0),
      ctr: Number(ins.ctr || 0),
      cpc: Number(ins.cpc || 0),
      cpm: Number(ins.cpm || 0),
      frequency: Number(ins.frequency || 0),
      leads: actionMetrics.leads,
      messages: actionMetrics.messages,
      link_clicks: actionMetrics.link_clicks,
      post_engagement: actionMetrics.post_engagement,
    }
  })
}

/**
 * Busca todos os dados em paralelo e faz merge dos insights nos objetos.
 * @param {string} accessToken
 * @param {string} adAccountId  Formato act_XXXXXXXXXX
 * @param {string} period       Chave em PERIODS
 */
export async function fetchAllData(accessToken, adAccountId, period = 'last_30d') {
  const [campaigns, adsets, ads, campaignInsights, adsetInsights, adInsights, daily] =
    await Promise.all([
      fetchCampaigns(accessToken, adAccountId),
      fetchAdSets(accessToken, adAccountId),
      fetchAds(accessToken, adAccountId),
      fetchInsights(accessToken, adAccountId, 'campaign', period),
      fetchInsights(accessToken, adAccountId, 'adset', period),
      fetchInsights(accessToken, adAccountId, 'ad', period),
      fetchDailyInsights(accessToken, adAccountId, period),
    ])

  return {
    campaigns: mergeInsights(campaigns, campaignInsights, 'campaign_id'),
    adsets: mergeInsights(adsets, adsetInsights, 'adset_id'),
    ads: mergeInsights(ads, adInsights, 'ad_id'),
    daily: daily.map((d) => {
      const actionMetrics = extractActionMetrics(d.actions)
      return {
        date: d.date_start,
        spend: Number(d.spend || 0),
        clicks: Number(d.clicks || 0),
        impressions: Number(d.impressions || 0),
        reach: Number(d.reach || 0),
        ctr: Number(d.ctr || 0),
        cpc: Number(d.cpc || 0),
        cpm: Number(d.cpm || 0),
        leads: actionMetrics.leads,
        messages: actionMetrics.messages,
      }
    }),
    period,
    syncedAt: new Date().toISOString(),
  }
}
