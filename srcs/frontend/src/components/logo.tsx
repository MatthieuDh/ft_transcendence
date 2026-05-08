interface SigmaLogoProps {
  height?: number | string;
  iconColor?: string;
  textColor?: string;
  className?: string;
}

export default function SigmaLogo({ 
  height = "clamp(32px, 3vw, 48px)", 
  iconColor = "purple.500",
  textColor = "purple.500", 
  className = "" 
}: SigmaLogoProps) {
  return (
    <div 
      className={className}
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.35em', 
        height: height
      }}
    >
      <svg
        height="100%" 
        viewBox="0 0 24 24"
        fill="none"
        stroke={iconColor}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ aspectRatio: '1 / 1' }}
      >
        <path d="M18 5H6l6 7-6 7h12" />
      </svg>

      <span 
        style={{
          color: textColor,
          fontWeight: 'bold',
          letterSpacing: '-0.02em', 
          fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
          fontSize: 'calc(var(--logo-height, 1em) * 0.75)', 
          lineHeight: 1
        }}

        ref={(el) => {
          if (el && typeof height === 'number') {
             el.style.setProperty('--logo-height', `${height}px`);
          } else if (el && typeof height === 'string') {
             el.style.setProperty('--logo-height', height);
          }
        }}
      >
        Sigma
      </span>
    </div>
  );
}