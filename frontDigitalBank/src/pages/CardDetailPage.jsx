import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Eye, EyeOff, Copy, Check, Lock, Shield, 
  Plus, RefreshCw
} from 'lucide-react'
import BankCard from '../components/common/BankCard'
import { getUserCards } from '../Servises/cardService'
import { useAuthStore } from '../store/useAuthStore'

export default function CardDetailPage() {
  const { cardId } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)

  // Налаштування безпеки
  const [contactless, setContactless] = useState(true)

  useEffect(() => {
    async function fetchCardData() {
      try {
        if (!user?.id) return
        const cards = await getUserCards(user.id)
        const found = cards.find((c) => String(c.id) === String(cardId)) || cards[0]
        setCard(found)
      } catch (err) {
        console.error('Помилка завантаження картки:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCardData()
  }, [cardId, user?.id])

  const copyCardNumber = () => {
    if (!card?.cardNumber) return
    navigator.clipboard.writeText(card.cardNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const formatCardNumber = (num) => {
    if (!num) return '•••• •••• •••• ••••'
    return num.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  if (loading) {
    return <div className="p-8 text-center text-muted">Завантаження картки...</div>
  }

  if (!card) {
    return (
      <div className="p-8 text-center text-muted">
        <p>Картку не знайдено</p>
        <button onClick={() => navigate('/cards')} className="mt-4 text-brand-400 underline">
          Повернутися до списку карток
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/cards')} 
          className="text-sm text-muted transition-colors hover:text-fg"
        >
          ← Назад до карток
        </button>
        <span className="text-xs text-muted">
          {card.cardType === 'Credit' ? 'Кредитна картка' : 'Дебетова картка'}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col justify-between space-y-4 rounded-card border border-white/10 bg-surface p-6">
          <BankCard card={card} />

          <div className="space-y-3 rounded-xl bg-surface-2 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Номер картки</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDetails((prev) => !prev)}
                  className="text-muted hover:text-fg"
                  title={showDetails ? "Приховати" : "Показати"}
                >
                  {showDetails ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button 
                  onClick={copyCardNumber}
                  className="flex items-center gap-1 text-xs text-brand-400 hover:underline"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  {copied ? 'Скопійовано' : 'Копіювати'}
                </button>
              </div>
            </div>

            <p className="font-mono text-sm font-semibold text-fg">
              {showDetails ? formatCardNumber(card.cardNumber) : `•••• •••• •••• ${card.cardNumber?.slice(-4)}`}
            </p>

            {showDetails && (
              <div className="flex items-center justify-between border-t border-white/5 pt-2 text-xs">
                <div>
                  <span className="text-muted">Термін: </span>
                  <span className="font-mono font-medium text-fg">
                    {card.expirationDate }
                  </span>
                </div>
                <div>
                  <span className="text-muted">Security Code: </span>
                  <span className="font-mono font-medium text-fg">
                    {card.securityCode }
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Дії з карткою */}
        <div className="flex flex-col justify-between space-y-4 rounded-card border border-white/10 bg-surface p-6">
          <h2 className="font-semibold text-fg">Управління карткою</h2>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setIsBlocked((b) => !b)}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl p-4 transition-colors ${
                isBlocked ? 'bg-red-500/20 text-red-400' : 'bg-surface-2 text-muted hover:bg-white/10 hover:text-fg'
              }`}
            >
              <Lock size={20} />
              <span className="text-xs font-medium">{isBlocked ? 'Розблокувати' : 'Заблокувати'}</span>
            </button>

            <button className="flex flex-col items-center justify-center gap-2 rounded-xl bg-surface-2 p-4 text-muted transition-colors hover:bg-white/10 hover:text-fg">
              <Shield size={20} />
              <span className="text-xs font-medium">Змінити PIN</span>
            </button>

            <button className="flex flex-col items-center justify-center gap-2 rounded-xl bg-surface-2 p-4 text-muted transition-colors hover:bg-white/10 hover:text-fg">
              <Plus size={20} />
              <span className="text-xs font-medium">Поповнити</span>
            </button>

            <button className="flex flex-col items-center justify-center gap-2 rounded-xl bg-surface-2 p-4 text-muted transition-colors hover:bg-white/10 hover:text-fg">
              <RefreshCw size={20} />
              <span className="text-xs font-medium">Перевипустити</span>
            </button>
          </div>

          {/* Інформація про власника згідно з Domain Model */}
          <div className="space-y-1.5 rounded-xl bg-surface-2 p-3 text-xs">
            <div className="flex justify-between">
              <span className="text-muted">Власник:</span>
              <span className="font-medium text-fg">{user.userFirstName} {user.userLastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Тип картки:</span>
              <span className="font-medium text-fg">{card.cardType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Опції та безпека */}
      <div className="space-y-4 rounded-card border border-white/10 bg-surface p-6">
        <h3 className="font-semibold text-fg">Налаштування та безпека</h3>

        <div className="divide-y divide-white/5">
          {/* NFC */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-fg">Безконтактна оплата (NFC)</p>
              <p className="text-xs text-muted">Оплата смартфоном або карткою</p>
            </div>
            <input 
              type="checkbox" 
              checked={contactless} 
              onChange={(e) => setContactless(e.target.checked)}
              className="h-5 w-5 rounded border-stroke bg-surface-2 text-brand-500 focus:ring-brand-500"
            />
          </div>

          {/* Запит PIN */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-fg">Запит PIN-коду при покупках</p>
              <p className="text-xs text-muted">Запитувати PIN для операцій понад 1 000 ₴</p>
            </div>
            <input 
              type="checkbox" 
              defaultChecked 
              className="h-5 w-5 rounded border-stroke bg-surface-2 text-brand-500 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}