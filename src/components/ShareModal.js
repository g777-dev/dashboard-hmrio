import { useState } from 'react'
import Modal from './ui/Modal.jsx'
import { T } from '../theme.js'
import { primaryBtn, inputStyle, inputLabel } from './ui/buttons.js'

export default function ShareModal({ open, onClose }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('viewer')
  const [copied, setCopied] = useState(false)
  const [members, setMembers] = useState([])

  const link = typeof window !== 'undefined' ? window.location.href : ''

  function copyLink() {
    navigator.clipboard?.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function inviteMember() {
    if (!email) return
    setMembers((m) => [...m, { email, role }])
    setEmail('')
  }

  return (
    <Modal open={open} onClose={onClose} title="Compartilhar dashboard">
      <label style={inputLabel}>Link da dashboard</label>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={link} readOnly style={{ ...inputStyle, marginBottom: 0 }} />
        <button onClick={copyLink} style={{ ...primaryBtn, whiteSpace: 'nowrap', minWidth: 90 }}>
          {copied ? '✓ Copiado' : 'Copiar'}
        </button>
      </div>

      <div style={{ height: 1, background: T.border, margin: '20px 0' }} />

      <label style={inputLabel}>Convidar membro por email</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email@hmrio.com.br"
        style={inputStyle}
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{ ...inputStyle, cursor: 'pointer' }}
      >
        <option value="viewer">Viewer — apenas visualização</option>
        <option value="editor">Editor — pode editar</option>
        <option value="admin">Admin — acesso total</option>
      </select>
      <button
        onClick={inviteMember}
        disabled={!email}
        style={{
          ...primaryBtn,
          width: '100%',
          opacity: email ? 1 : 0.5,
          cursor: email ? 'pointer' : 'not-allowed',
        }}
      >
        Convidar
      </button>

      {members.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <label style={inputLabel}>Membros convidados ({members.length})</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {members.map((m, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: T.bg,
                  borderRadius: T.radius,
                  fontSize: 12,
                }}
              >
                <span>{m.email}</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: T.primary,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  )
}
