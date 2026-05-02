import { useMemo, useState } from 'react'
import CampaignCard from '../components/campaigns/CampaignCard.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { T } from '../theme.js'
import { ghostBtn, inputStyle, selectStyle } from '../components/ui/buttons.js'
import { objectiveLabel } from '../utils/format.js'
import { classifyStatus, STATUS } from '../utils/classify.js'

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos os status' },
  { value: STATUS.ACTIVE, label: 'Ativas (com investimento)' },
  { value: STATUS.PAUSED, label: 'Pausadas' },
  { value: STATUS.NO_SPEND, label: 'Sem investimento' },
  { value: STATUS.WAITING, label: 'Aguardando dados' },
]

export default function CampaignsView({ data, isConnected }) {
  const [statusFilter, setStatusFilter] = useState('all')
  const [objFilter, setObjFilter] = useState('all')
  const [search, setSearch] = useState('')

  const objectives = useMemo(() => {
    const set = new Set(data.campaigns.map((c) => c.objective).filter(Boolean))
    return ['all', ...Array.from(set)]
  }, [data.campaigns])

  const filtered = useMemo(() => {
    return data.campaigns.filter((c) => {
      const realStatus = classifyStatus(c)
      if (statusFilter !== 'all' && realStatus !== statusFilter) return false
      if (objFilter !== 'all' && c.objective !== objFilter) return false
      if (search && !c.name?.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [data.campaigns, statusFilter, objFilter, search])

  if (!isConnected) {
    return (
      <EmptyState
        title="Aguardando conexão com a API Meta Ads"
        message="Conecte uma conta de anúncios para visualizar as campanhas da HM Rio Embalagens."
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
          alignItems: 'center',
          background: T.surface,
          padding: 14,
          borderRadius: T.radiusLg,
          border: `1px solid ${T.border}`,
          boxShadow: T.shadow,
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar campanha por nome..."
          style={{ ...inputStyle, marginBottom: 0, flex: 1, minWidth: 220 }}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select value={objFilter} onChange={(e) => setObjFilter(e.target.value)} style={selectStyle}>
          {objectives.map((o) => (
            <option key={o} value={o}>
              {o === 'all' ? 'Todos os objetivos' : objectiveLabel(o)}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            setStatusFilter('all')
            setObjFilter('all')
            setSearch('')
          }}
          style={ghostBtn}
        >
          Limpar filtros
        </button>
        <span
          style={{
            fontSize: 12,
            color: T.textMuted,
            marginLeft: 'auto',
            fontWeight: 600,
          }}
        >
          {filtered.length} {filtered.length === 1 ? 'campanha' : 'campanhas'}
        </span>
      </div>

      {data.campaigns.length === 0 ? (
        <EmptyState
          title="Nenhuma campanha carregada ainda"
          message="A conta foi conectada mas não há campanhas no período selecionado."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhuma campanha encontrada"
          message="Ajuste os filtros ou limpe a busca para ver outras campanhas."
          compact
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 14,
          }}
        >
          {filtered.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      )}
    </div>
  )
}
