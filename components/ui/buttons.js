import { T } from '../../theme.js'

export const primaryBtn = {
  padding: '10px 18px',
  background: T.primary,
  color: '#fff',
  border: 'none',
  borderRadius: T.radius,
  fontWeight: 700,
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: T.fontDisplay,
  letterSpacing: 0.3,
  transition: 'all 0.15s',
}

export const accentBtn = {
  padding: '10px 18px',
  background: T.accent,
  color: '#fff',
  border: 'none',
  borderRadius: T.radius,
  fontWeight: 700,
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: T.fontDisplay,
  letterSpacing: 0.3,
  boxShadow: `0 4px 12px ${T.accent}40`,
  transition: 'all 0.15s',
}

export const ghostBtn = {
  padding: '9px 16px',
  background: 'transparent',
  color: T.text,
  border: `1px solid ${T.border}`,
  borderRadius: T.radius,
  fontWeight: 600,
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: T.fontBody,
  transition: 'all 0.15s',
}

export const iaBtn = {
  padding: '9px 14px',
  background: T.text,
  color: '#fff',
  border: 'none',
  borderRadius: T.radius,
  fontWeight: 700,
  fontSize: 13,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontFamily: T.fontDisplay,
  letterSpacing: 0.3,
  transition: 'all 0.15s',
}

export const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: `1px solid ${T.border}`,
  borderRadius: T.radius,
  fontSize: 13,
  outline: 'none',
  fontFamily: T.fontBody,
  color: T.text,
  marginBottom: 12,
  boxSizing: 'border-box',
  background: T.surface,
}

export const inputLabel = {
  display: 'block',
  fontSize: 11,
  fontWeight: 700,
  color: T.textMuted,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: 6,
}

export const selectStyle = {
  padding: '8px 12px',
  border: `1px solid ${T.border}`,
  borderRadius: T.radius,
  fontSize: 13,
  background: T.surface,
  color: T.text,
  cursor: 'pointer',
  fontFamily: T.fontBody,
  fontWeight: 500,
  outline: 'none',
}

export const cardStyle = {
  background: T.surface,
  border: `1px solid ${T.border}`,
  borderRadius: T.radiusLg,
  padding: 16,
  transition: 'all 0.15s',
  boxShadow: T.shadow,
}

export const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
}

export const thStyle = {
  textAlign: 'left',
  padding: '10px 12px',
  fontSize: 11,
  fontWeight: 700,
  color: T.textMuted,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  borderBottom: `1px solid ${T.border}`,
  background: T.surfaceAlt,
}

export const tdStyle = {
  padding: '12px',
  borderBottom: `1px solid ${T.borderLight}`,
  fontSize: 13,
  color: T.text,
}

export const trHover = {
  transition: 'background 0.1s',
}
