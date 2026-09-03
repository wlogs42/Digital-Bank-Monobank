import { Home, CreditCard, BarChart3, PiggyBank, MoreHorizontal } from 'lucide-react'

const items = [
  { label: 'Головна', icon: Home, active: true },
  { label: 'Картки', icon: CreditCard },
  { label: 'Аналітика', icon: BarChart3 },
  { label: 'Скарбнички', icon: PiggyBank },
  { label: 'Ще', icon: MoreHorizontal },
]

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 flex justify-around border-t border-white/5 bg-surface/95 px-2 py-2.5 backdrop-blur lg:hidden">
      {items.map(({ label, icon: Icon, active }) => (
        <button
          key={label}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-[11px] ${
            active ? 'text-brand-400' : 'text-faint'
          }`}
        >
          <Icon size={20} />
          {label}
        </button>
      ))}
    </nav>
  )
}
