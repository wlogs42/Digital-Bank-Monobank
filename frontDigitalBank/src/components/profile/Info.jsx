export default function Info({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/5 py-3.5 last:border-0">
      {icon && <span className="text-muted">{icon}</span>}
      <div className="flex-1">
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-medium text-fg">{value || '—'}</p>
      </div>
    </div>
  )
}