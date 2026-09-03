import { useEffect, useState } from 'react'
import { Eye, EyeOff, Search, Bell, Headphones } from 'lucide-react'
import CardsCarousel from '../components/dashboard/CardsCarousel'
import QuickActions from '../components/dashboard/QuickActions'
import CreateCardForm from '../components/card/CreateCardForm'
import { useAuthStore } from '../store/useAuthStore'
import { getUserCards, createCard } from '../Servises/cardService'


export default function DashboardPage() {
  const [hidden, setHidden] = useState(false)
  const user = useAuthStore((s) => s.user)
  const userId = user?.id

  const [cards, setCards] = useState(null) 
  const [error, setError] = useState('')
  const [showCreateCard, setShowCreateCard] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

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
    return () => { cancelled = true }
  }, [userId, reloadKey])

  const handleCreateCard = async (payload) => {
    try {
      await createCard({ ...payload, userId })
      setShowCreateCard(false)
      setReloadKey((k) => k + 1)
    } catch (err) {
      setError(err.response?.data?.error ?? 'Не вдалося створити картку')
    }
  }

  const totalBalance = (cards ?? []).reduce((sum, c) => sum + c.balanceAmount, 0)

  return (
    <div className="space-y-8">
      <div className="hidden items-center justify-between lg:flex">
        <p className="text-sm text-muted">Привіт, {user?.firstName || 'друже'}</p>
        <div className="flex items-center gap-5 text-muted">
          <Search size={20} className="cursor-pointer hover:text-fg" />
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
        <div className="space-y-6 lg:col-span-2">
          <div>
            <button onClick={() => setHidden((h) => !h)} className="mb-2 flex items-center gap-2 text-sm text-muted">
              Всього коштів
              {hidden ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
            <p className="font-display text-4xl font-extrabold md:text-5xl">
              {hidden ? '•••• ••' : `${(totalBalance)} ₴`}
            </p>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {cards === null && <p className="text-muted">Завантаження карток...</p>}

          {cards?.length === 0 && !showCreateCard && (
            <div className="rounded-card border border-dashed border-stroke p-6 text-center">
              <p className="mb-4 text-muted">У вас ще немає картки</p>
              <button
                onClick={() => setShowCreateCard(true)}
                className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-400"
              >
                Відкрити картку
              </button>
            </div>
          )}

          {showCreateCard && (
            <div className="rounded-card border border-white/10 bg-surface p-6">
              <CreateCardForm onCreated={handleCreateCard} />
            </div>
          )}

          {cards && cards.length > 0 && (
            <CardsCarousel cards={cards} onAddCard={() => setShowCreateCard(true)} />
          )}

          <QuickActions />
        </div>

        <div className="space-y-6">
          {/*статисктиа витрат і накописент */}
        </div>
      </div>
    </div>
  )
}