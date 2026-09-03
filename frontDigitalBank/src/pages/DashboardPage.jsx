import { useEffect, useState } from 'react'
import { Eye, EyeOff, Search, Bell, Headphones } from 'lucide-react'
import CardsCarousel from '../components/dashboard/CardsCarousel'
import QuickActions from '../components/dashboard/QuickActions'
import TransferModal from '../components/dashboard/TransferModal'
import { useAuthStore } from '../store/useAuthStore'
import { getUserCards } from '../Servises/cardService'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const [hidden, setHidden] = useState(false)
  const user = useAuthStore((s) => s.user)
  const userId = user?.id
  const [cards, setCards] = useState(null)
  const [error, setError] = useState('')
  const [transferOpen, setTransferOpen] = useState(false)
  const navigate = useNavigate()

  async function refreshCards() {
    try {
      const data = await getUserCards(userId)
      setCards(data)
    } catch {
      setError('Не вдалося завантажити картки')
      setCards([])
    }
  }

  useEffect(() => {
    if (!userId) return
    let cancelled = false

    async function fetchCards() {
      try {
        const data = await getUserCards(userId)
        if (!cancelled) setCards(data)
      } catch {
        if (!cancelled) {
          setError('Не вдалося завантажити картки')
          setCards([])
        }
      }
    }

    fetchCards()
    return () => {
      cancelled = true
    }
  }, [userId])


  const totalBalance = (cards ?? []).reduce((sum, c) => sum + (c.balanceAmount || 0), 0)

  return (
  <div className="space-y-6 sm:space-y-8">

    {/* Desktop top bar */}
    <div className="hidden items-center justify-between lg:flex">
      <p className="text-sm text-muted">
        Привіт, {user?.firstName || 'друже'}
      </p>
      <div className="flex items-center gap-5 text-muted">
        <Search
          size={20}
          className="cursor-pointer hover:text-fg"
        />
        <div className="relative cursor-pointer hover:text-fg">
          <Bell size={20} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand-500" />
        </div>
        <button className="flex items-center gap-2 rounded-full border border-stroke px-4 py-2 text-sm hover:border-white/30 hover:text-fg">
          <Headphones size={16} />
          Підтримка
        </button>
      </div>
    </div>
    <div className="grid gap-6 lg:grid-cols-3">

      <div className="min-w-0 space-y-6 lg:col-span-2">

        <div>
          <button
            onClick={() => setHidden((h) => !h)}
            className="mb-2 flex items-center gap-2 text-sm text-muted"
          >
            Всього коштів
            {hidden ? (
              <EyeOff size={15} />
            ) : (
              <Eye size={15} />
            )}
          </button>

          <p className="font-display text-3xl font-extrabold sm:text-4xl md:text-5xl">
            {hidden
              ? '•••• ••'
              : `${totalBalance.toLocaleString('uk-UA')} ₴`}
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-400">
            {error}
          </p>
        )}

        {cards === null && (
          <p className="text-sm text-muted">
            Завантаження карток...
          </p>
        )}

        {cards?.length === 0  && (
          <div className="rounded-card border border-dashed border-stroke p-5 text-center sm:p-6">
            <p className="mb-4 text-sm text-muted">
              У вас ще немає картки
            </p>

            <button
              onClick={() => navigate('/cards/create')}
              className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-medium text-white hover:bg-brand-400 sm:w-auto"
            >
              Відкрити картку
            </button>
          </div>
        )}

        {cards && cards.length > 0 && (
          <CardsCarousel
            cards={cards}
            onAddCard={() =>navigate('/cards/create')
            
            }
          />
        )}

        <QuickActions onTransferClick={() => setTransferOpen(true)} />
      </div>

      <div className="hidden space-y-6 lg:block">
        {/* статистика витрат і накопичень */}
      </div>

    </div>

    {transferOpen && (
      <TransferModal
        onClose={() => setTransferOpen(false)}
        cards={cards ?? []}
        onSuccess={() => {
          setTransferOpen(false)
          refreshCards()
        }}
      />
    )}
  </div>
)}