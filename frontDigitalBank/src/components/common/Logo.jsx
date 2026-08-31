export default function Logo({ className = '', dark = false }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="30" height="30" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="32" fill="#FF3E82" />
        <ellipse cx="32" cy="37" rx="20" ry="14" fill="white" />
        <ellipse cx="32" cy="30" rx="7" ry="5" fill="#FF3E82" />
        <circle cx="29" cy="24" r="1.6" fill="#0A0A0F" />
        <circle cx="35" cy="24" r="1.6" fill="#0A0A0F" />
      </svg>
      <span className={`font-display font-bold text-lg tracking-tight ${dark ? 'text-ink' : 'text-fg'}`}>
        Хрю Банк
      </span>
    </div>
  )
}
