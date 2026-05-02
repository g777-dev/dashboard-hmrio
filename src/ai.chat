import { useState, useRef, useEffect } from 'react'
import { T } from './theme.js'

const SUGGESTIONS = [
  'Qual campanha está com melhor performance?',
  'Onde estou perdendo dinheiro?',
  'Sugestões de escala para esta semana',
  'Análise das campanhas de WhatsApp',
  'Resumo geral da conta',
]

function formatBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? (
      <strong key={i}>{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  )
}

export default function AiChat({ open, onClose, contextBuilder }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Olá. Sou o assistente de tráfego pago da **HM Rio Embalagens Descartáveis**. Posso analisar campanhas, identificar fadiga de criativos, sugerir escala e diagnosticar gargalos do funil B2B. O que você quer ver?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  async function send(question) {
    if (!question.trim() || loading) return
    setMessages((m) => [...m, { role: 'user', content: question }])
    setInput('')
    setLoading(true)

    try {
      const context = contextBuilder ? contextBuilder() : ''
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao consultar IA')
      setMessages((m) => [...m, { role: 'assistant', content: data.answer }])
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: `Erro: ${err.message}. Verifique se a chave GEMINI_API_KEY está configurada na Vercel.` },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 420,
        maxWidth: 'calc(100vw - 32px)',
        height: 600,
        maxHeight: 'calc(100vh - 48px)',
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: T.radiusLg,
        boxShadow: T.shadowLg,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        overflow: 'hidden',
        fontFamily: T.fontBody,
      }}
    >
      <div
        style={{
          padding: '14px 18px',
          background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryDark} 100%)`,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `3px solid ${T.accent}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: T.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: T.fontDisplay,
              fontWeight: 800,
              color: '#fff',
              fontSize: 14,
            }}
          >
            IA
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, fontFamily: T.fontDisplay }}>
              Assistente HM Rio
            </div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Análise de tráfego em tempo real</div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: 22,
            cursor: 'pointer',
            padding: 4,
            lineHeight: 1,
          }}
          aria-label="Fechar"
        >
          ×
        </button>
      </div>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          background: T.bg,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              padding: '10px 14px',
              borderRadius: T.radius,
              background: m.role === 'user' ? T.primary : T.surface,
              color: m.role === 'user' ? '#fff' : T.text,
              fontSize: 13,
              lineHeight: 1.5,
              border: m.role === 'user' ? 'none' : `1px solid ${T.border}`,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {formatBold(m.content)}
          </div>
        ))}

        {loading && (
          <div
            style={{
              alignSelf: 'flex-start',
              padding: '10px 14px',
              borderRadius: T.radius,
              background: T.surface,
              border: `1px solid ${T.border}`,
              display: 'flex',
              gap: 4,
            }}
          >
            <span style={dotStyle(0)} />
            <span style={dotStyle(0.15)} />
            <span style={dotStyle(0.3)} />
          </div>
        )}

        {messages.length === 1 && (
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                style={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: T.radius,
                  fontSize: 12,
                  color: T.text,
                  cursor: 'pointer',
                  fontFamily: T.fontBody,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = T.primary
                  e.currentTarget.style.background = T.primaryLight
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.border
                  e.currentTarget.style.background = T.surface
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          padding: 12,
          borderTop: `1px solid ${T.border}`,
          background: T.surface,
          display: 'flex',
          gap: 8,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send(input)
            }
          }}
          placeholder="Pergunte sobre suas campanhas..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '10px 12px',
            border: `1px solid ${T.border}`,
            borderRadius: T.radius,
            fontSize: 13,
            outline: 'none',
            fontFamily: T.fontBody,
            color: T.text,
            background: T.bg,
          }}
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          style={{
            padding: '0 16px',
            background: T.accent,
            color: '#fff',
            border: 'none',
            borderRadius: T.radius,
            fontWeight: 700,
            fontSize: 13,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !input.trim() ? 0.5 : 1,
            fontFamily: T.fontDisplay,
            letterSpacing: 0.3,
          }}
        >
          ENVIAR
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

function dotStyle(delay) {
  return {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: T.primary,
    animation: `pulse 1.2s ease-in-out ${delay}s infinite`,
    display: 'inline-block',
  }
}
