interface SigmaLogoProps {
  height?: number | string
  iconColor?: string
  textColor?: string
}

export default function SigmaLogo({ height = "clamp(32px, 3vw, 48px)", iconColor = "#aa3bff", textColor = "#aa3bff" }: SigmaLogoProps) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35em', height }}>
      <svg height="100%" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ aspectRatio: '1 / 1' }}>
        <path d="M18 5H6l6 7-6 7h12" />
      </svg>
      <span style={{ color: textColor, fontWeight: 'bold', letterSpacing: '-0.02em', fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif", fontSize: '0.75em', lineHeight: 1 }}>
        Sigma
      </span>
    </div>
  )
}
