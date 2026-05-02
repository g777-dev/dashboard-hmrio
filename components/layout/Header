import { T } from '../../theme.js'
import { fmtTime } from '../../utils/format.js'
import { ghostBtn, accentBtn, iaBtn } from '../ui/buttons.js'

export default function Header({
  isConnected,
  syncedAt,
  onConnect,
  onShare,
  onAi,
  onRefresh,
  loading,
}) {
  return (
    <header style={{ background: T.surface, position: 'relative', boxShadow: T.shadow }}>
      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        {/* Logo HM Rio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: T.radius,
              background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryDark} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontFamily: T.fontDisplay,
              fontWeight: 800,
              fontSize: 17,
              letterSpacing: -0.5,
              boxShadow: `0 4px 14px ${T.primary}40`,
              position: 'relative',
            }}
          >
            HM
            <span
              style={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 12,
                height: 12,
                borderRadius: 4,
                background: T.accent,
                border: `2px solid ${T.surface}`,
              }}
            />
          </div>
          <div>
            <div
              style={{
                fontFamily: T.fontDisplay,
                fontWeight: 800,
                fontSize: 18,
                color: T.text,
                letterSpacing: -0.5,
                lineHeight: 1.1,
              }}
            >
              HM RIO
            </div>
            <div
              style={{
                fontSize: 10,
                color: T.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 1.4,
                fontWeight: 700,
                marginTop: 2,
              }}
            >
              Campaign Manager
            </div>
          </div>
        </div>

        {/* Status conexão */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 6,
            paddingBottom: 6,
            background: isConnected ? T.successBg : T.neutralBg,
            borderRadius: 999,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: isConnected ? T.success : T.textSubtle,
              boxShadow: isConnected ? `0 0 0 4px ${T.success}25` : 'none',
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: isConnected ? T.success : T.textMuted,
              fontWeight: 700,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
          {syncedAt && (
            <span style={{ fontSize: 11, color: T.textSubtle }}>
              · sync {fmtTime(syncedAt)}
            </span>
          )}
        </div>

        {/* Botões */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {isConnected && (
            <button onClick={onRefresh} disabled={loading} style={ghostBtn} title="Atualizar dados">
              {loading ? '↻' : '↻'} Atualizar
            </button>
          )}
          <button onClick={onAi} style={iaBtn}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.accent }} />
            IA
          </button>
          <button onClick={onConnect} style={ghostBtn}>
            {isConnected ? 'Reconectar' : 'Conectar'}
          </button>
          <button onClick={onShare} style={accentBtn}>
            Compartilhar
          </button>
        </div>
      </div>

      {/* Borda accent inferior */}
      <div
        style={{
          height: 3,
          background: `linear-gradient(90deg, ${T.primaryDark} 0%, ${T.primary} 50%, ${T.accent} 100%)`,
        }}
      />
    </header>
  )
}
