import { Send, FileText, Download, PiggyBank } from 'lucide-react'

const actions = [
  { label: 'Переказ на картку', icon: Send },
  { label: 'Платіж за IBAN', icon: FileText },
  { label: 'Поповнити картку', icon: Download },
  { label: 'Скарбничка', icon: PiggyBank },
]

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map(({ label, icon: Icon }) => (
        <button
          key={label}
          className="flex
            min-h-[110px]
            flex-col
            items-center
            justify-center
            gap-2
            rounded-tile
            border
            border-white/10
            bg-surface
            px-2
            py-4
            text-center
            transition
            hover:bg-surface-2
            active:scale-[0.98]
          "
        >
          <div className="flex h-10 w-10 items-center shrink-0 justify-center rounded-full bg-surface-3 text-fg">
            <Icon size={18} />
          </div>
          <span className="max-w-[110px] text-xs leading-tight text-muted">{label}</span>
        </button>
      ))}
    </div>
  )
}
