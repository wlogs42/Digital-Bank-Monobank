import { Send, FileText, Download, PiggyBank } from 'lucide-react'

const actions = [
  { label: 'Переказ на картку', icon: Send },
  { label: 'Платіж за IBAN', icon: FileText },
  { label: 'Поповнити картку', icon: Download },
  { label: 'Скарбничка', icon: PiggyBank },
]

export default function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map(({ label, icon: Icon }) => (
        <button
          key={label}
          className="flex flex-col items-center gap-2 rounded-tile border border-white/10 bg-surface px-2 py-4 text-center hover:bg-surface-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-3 text-fg">
            <Icon size={18} />
          </div>
          <span className="text-xs leading-tight text-muted">{label}</span>
        </button>
      ))}
    </div>
  )
}
