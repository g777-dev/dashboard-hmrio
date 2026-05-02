import { useState } from 'react'
import Modal from './ui/Modal.jsx'
import { T } from '../theme.js'
import { primaryBtn, inputStyle, inputLabel } from './ui/buttons.js'

export default function ConnectModal({ open, onClose, onConnect, loading, error }) {
  const [token, setToken] = useState('')
  const [accountId, setAccountId] = useState('')

  async function handleSubmit() {
    if (!token || !accountId) return
    const success = await onConnect(token.trim(), accountId.trim())
    if (success) {
      setToken('')
      setAccountId('')
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Conectar Meta Ads">
      <p style={{ fontSize: 13, color: T.textMuted, margin: '0 0 16px', lineHeight: 1.5 }}>
        Insira o Access Token e o Ad Account ID da conta da HM Rio Embalagens para carregar
        os dados ao vivo.
      </p>

      <label style={inputLabel}>Access Token</label>
      <input
        type="password"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="EAAxxxxxxxxxxxxx..."
        style={inputStyle}
      />

      <label style={inputLabel}>Ad Account ID</label>
      <input
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        placeholder="act_XXXXXXXXXX"
        style={inputStyle}
      />

      {error && (
        <div
          style={{
            background: T.dangerBg,
            color: T.danger,
            padding: '10px 12px',
            borderRadius: T.radius,
            fontSize: 12,
            marginTop: 4,
            marginBottom: 12,
            lineHeight: 1.4,
          }}
        >
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !token || !accountId}
        style={{
          ...primaryBtn,
          width: '100%',
          marginTop: 4,
          opacity: loading || !token || !accountId ? 0.5 : 1,
          cursor: loading || !token || !accountId ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Conectando...' : 'Conectar e Carregar'}
      </button>

      <div
        style={{
          marginTop: 16,
          padding: 12,
          background: T.primaryLight,
          borderRadius: T.radius,
          fontSize: 11,
          color: T.primaryDark,
          lineHeight: 1.6,
        }}
      >
        <strong>Como obter:</strong>
        <br />
        <strong>Token:</strong> Business Settings → System Users → Generate Token (permissões:
        ads_read, ads_management, read_insights)
        <br />
        <strong>Ad Account ID:</strong> Business Manager → Ad Accounts (formato act_XXXXXXXXXX)
      </div>
    </Modal>
  )
}
