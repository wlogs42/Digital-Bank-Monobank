import { NavLink } from 'react-router-dom'
import {
  Home, CreditCard, Repeat,
  PiggyBank, LogOut, MoreHorizontal,Percent,ArrowLeftRight,Wallet
} from 'lucide-react'
import Logo from '../common/Logo'
import { useAuthStore } from '../../store/useAuthStore'

const items= [
  { label: 'Головна', icon: Home, to: '/dashboard', enabled: true },
  { label: 'Картки', icon: CreditCard, to: '/cards', enabled: true },
  { label: 'Рахунки', icon: Wallet, to: '#', enabled: false },
  { label: 'Перекази', icon: Repeat, to: '#', enabled: false },
  { label: 'Платежі', icon: ArrowLeftRight, to: '#', enabled: false },
  { label: 'Накопичення', icon: PiggyBank, to: '#', enabled: false },
  { label: 'Кредити', icon: Percent, to: '/credit', enabled: true },
  { label: 'Ще', icon: MoreHorizontal, to: '#', enabled: false },
]



export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const displayName = user?.userFirstName || 'Користувач'
  const lastNameInitial = user?.userLastName ? `${user.userLastName[0].toUpperCase()}.` : ''
  const initialName = displayName[0]?.toUpperCase() ?? '?'

  return (
    <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-white/5 bg-surface p-6 lg:flex">
      <div>
        <Logo className="mb-10" />
        <nav className="space-y-1">
          {items.map(({ label, icon: Icon, to, enabled }) =>
            enabled ? (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-400'
                      : 'text-muted hover:bg-surface-2 hover:text-fg'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ) : (
              <div
                key={label}
                className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-faint/60"
              >
                <Icon size={18} />
                {label}
              </div>
            )
          )}
        </nav>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-surface-2 px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/20 font-display text-sm font-semibold text-brand-300">
            {initialName}
          </div>
          <div className="text-sm">
            <p className="font-medium text-fg">{displayName} {lastNameInitial}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-surface-2 hover:text-fg"
        >
          <LogOut size={18} />
          Вийти
        </button>
      </div>
    </aside>
  )
}
