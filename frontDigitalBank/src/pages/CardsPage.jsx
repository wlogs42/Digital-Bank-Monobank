import { useEffect, useState } from 'react'
import { Plus, CreditCard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import BankCard from '../components/common/BankCard'
import { useAuthStore } from '../store/useAuthStore'
import { getUserCards } from '../Servises/cardService'

export default function CardsPage() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const [cards, setCards] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.id) return

    getUserCards(user.id)
      .then(setCards)
      .catch(() => {
        setError('Не вдалося завантажити картки')
        setCards([])
      })
  }, [user?.id])

  if (cards === null) {
    return <p className="text-sm text-muted">Завантаження...</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-fg">
            Мої картки
          </h1>
          <p className="text-sm text-muted">
            Управління банківськими картками
          </p>
        </div>

        <button
          onClick={() => navigate('/cards/create')}
          className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-400"
        >
          <Plus size={18} />
          Нова картка
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {!cards.length ? (
        <div className="rounded-card border border-dashed border-stroke bg-surface p-10 text-center">
          <CreditCard
            size={40}
            className="mx-auto mb-4 text-muted"
          />

          <h2 className="font-semibold text-fg">
            У вас ще немає карток
          </h2>

          <p className="mt-1 text-sm text-muted">
            Створіть свою першу банківську картку
          </p>

          <button
            onClick={() => navigate('/cards/create')}
            className="mt-5 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-400"
          >
            Відкрити картку
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
  {cards.map((card) => (
    /* Замінено <button> на <div> з обробником клику */
    <div
      key={card.id}
      onClick={() => navigate(`/cards/${card.id}`)}
      className="group flex cursor-pointer flex-col justify-between rounded-card border border-white/10 bg-surface p-3 text-left transition hover:border-brand-500/40"
    >
      {/* Компактне обгортання банківської картки */}
      <div className="w-full">
        <BankCard card={card} />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs sm:text-sm">
        <span className="text-muted">
          {card.cardType === 'Credit' ? 'Кредитна' : 'Дебетова'}
        </span>

        <span className="text-brand-400 transition-transform group-hover:translate-x-0.5">
          Деталі →
        </span>
      </div>
    </div>
  ))}

  {cards.length < 3 && (
    <button
      onClick={() => navigate('/cards/create')}
      className="flex min-h-[170px] flex-col items-center justify-center rounded-card border border-dashed border-stroke bg-surface/50 p-4 text-xs font-medium text-muted transition hover:border-brand-500/50 hover:text-fg sm:text-sm"
    >
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-surface-2">
        <Plus size={18} />
      </div>
      Відкрити ще одну картку
    </button>
  )}
</div>
      )}
    </div>
  )
}