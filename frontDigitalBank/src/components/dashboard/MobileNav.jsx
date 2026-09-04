import { NavLink } from 'react-router-dom'
import { Home, CreditCard, PiggyBank, MoreHorizontal, Percent } from 'lucide-react'

const items = [
  { label: 'Головна', icon: Home, to: '/dashboard' },
  { label: 'Картки', icon: CreditCard, to: '/dashboard' },
  { label: 'Кредит', icon: Percent, to: '/credit' },
  { label: 'Скарбнички', icon: PiggyBank, to: '/savings' },
  { label: 'Ще', icon: MoreHorizontal, to: '/more' },
]

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 flex justify-around border-t border-white/5 bg-surface/95 px-2 py-2.5 backdrop-blur lg:hidden">
      {items.map(({ label, icon: Icon, to }) => (
        <NavLink
          key={label}
          to={to}
          end={to === '/dashboard'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-3 py-1 text-[11px] transition-colors ${
              isActive ? 'text-brand-400' : 'text-faint hover:text-muted'
            }`
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}