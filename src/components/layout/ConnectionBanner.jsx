import { T } from '../../theme.js'
import { primaryBtn } from '../ui/buttons.js'

export default function ConnectionBanner({ onConnect }) {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${T.primaryLight} 0%, ${T.surfaceAlt} 100%)`,
        border: `1px solid ${T.primary}30`,
        borderLeft: `4px solid ${T.primary}`,
        borderRadius: T.radiusLg,
        padding: 24,
        marginBottom: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ minWidth: 280, flex: 1 }}>
        <div
          style={{
            fontFamily: T.fontDisplay,
            fontSize: 18,
            fontWeight: 700,
            color: T.primaryDark,
            marginBottom: 6,
          }}
        >
          Aguardando conexão com a API Meta Ads
        </div>
        <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.5 }}>
          Conecte a conta de anúncios da HM Rio Embalagens para visualizar campanhas, conjuntos,
          criativos e métricas reais em tempo real. Nenhum dado é simulado nesta dashboard.
        </div>
      </div>
      <button onClick={onConnect} style={primaryBtn}>
        Conectar agora
      </button>
    </div>
  )
}
