import { T } from '../../theme.js'

export default function Footer() {
  return (
    <footer
      style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '24px',
        textAlign: 'center',
        fontSize: 11,
        color: T.textSubtle,
        letterSpacing: 0.5,
      }}
    >
      Desenvolvido por <strong style={{ color: T.text }}>G7 Soluções Digitais</strong>
      {' · '}
      <span style={{ color: T.textSubtle }}>Dashboard de performance Meta Ads</span>
    </footer>
  )
}
