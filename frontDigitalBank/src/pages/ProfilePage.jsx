import { useEffect, useState } from 'react'
import {
Mail, AtSign, ShieldCheck,
  CreditCard, HelpCircle, FileText, ChevronRight, LogOut,
} from 'lucide-react'
import Container from '../components/common/Container'
import Info from '../components/profile/Info'
import { useAuthStore } from '../store/useAuthStore'
import { getUser } from '../Servises/userService'
import { getUserCards } from '../Servises/cardService'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const storedUser = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const userId = storedUser?.id

  const [profile, setProfile] = useState(storedUser)
  const [cardsCount, setCardsCount] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!userId) return
    let cancelled = false

    async function load() {
      try {
        const [userData, cards] = await Promise.all([
          getUser(userId),
          getUserCards(userId),
        ])
        if (!cancelled) {
          setProfile(userData)
          setCardsCount(cards.length)
        }
      } catch {
        if (!cancelled) setError('Не вдалося завантажити профіль')
      }
    }

    load()
    return () => { cancelled = true }
  }, [userId])

  const initial = profile?.userFirstName?.[0]?.toUpperCase() ?? '?'
  const fullName = [profile?.userFirstName, profile?.userLastName].filter(Boolean).join(' ')

  const settingsItems = [
    { icon: CreditCard, label: 'Мої картки', onClick: () => navigate('/dashboard') },
    { icon: FileText, label: 'Документи', onClick: () => {} },
    { icon: HelpCircle, label: 'Служба підтримки', onClick: () => {} },
  ]

  return (
    <Container className="max-w-2xl py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-fg">Профіль</h1>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="mb-6 flex flex-col items-center rounded-card border border-white/5 bg-surface px-6 py-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-500/20 font-display text-3xl font-bold text-brand-300">
          {initial}
        </div>
        <p className="mt-4 font-display text-xl font-semibold text-fg">{fullName || 'Користувач'}</p>
        <p className="text-sm text-muted">@{profile?.userName}</p>
      </div>

      <div className="mb-6 rounded-card border border-white/5 bg-surface p-5">
        <h2 className="mb-1 px-1 font-display text-sm font-semibold text-muted">Контактні дані</h2>
        <Info icon={<AtSign size={18} />} label="Username" value={profile?.userName} />
        <Info icon={<Mail size={18} />} label="Email" value={profile?.email} />
      </div>
      <div className="mb-6 rounded-card border border-white/5 bg-surface p-5">
        <h2 className="mb-1 px-1 font-display text-sm font-semibold text-muted">Про акаунт</h2>
        <Info icon={<CreditCard size={18} />} label="Кількість карток" value={cardsCount ?? '—'} />
        <div className="flex items-center gap-3 py-3.5">
          <ShieldCheck size={18} className="text-emerald-400" />
          <div className="flex-1">
            <p className="text-xs text-muted">Статус верифікації</p>
            <p className="text-sm font-medium text-emerald-400">Верифіковано</p>
          </div>
        </div>
      </div>

      <div className="mb-6 divide-y divide-white/5 rounded-card border border-white/5 bg-surface">
        {settingsItems.map(({ icon: Icon, label, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-surface-2"
          >
            <Icon size={18} className="text-muted" />
            <span className="flex-1 text-sm font-medium text-fg">{label}</span>
            <ChevronRight size={16} className="text-faint" />
          </button>
        ))}
      </div>

      <button
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-card border border-white/5 bg-surface px-4 py-3.5 text-sm font-medium text-red-400 hover:bg-surface-2"
      >
        <LogOut size={18} />
        Вийти з акаунту
      </button>
    </Container>
  )
}