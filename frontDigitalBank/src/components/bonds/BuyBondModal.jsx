import { useState } from 'react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { CURRENCY_LABELS } from '../../utils/currency'

export default function BuyBondModal({ offer, cards, onClose, onSubmit, onSuccess }) {
  const [cardId, setCardId] = useState(cards[0]?.id ?? '')
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!cardId) {
      setFormError('Оберіть картку')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({ cardId: Number(cardId) })
      onSuccess?.()
    } catch (err) {
      setFormError(err.response?.data?.error ?? 'Щось пішло не так, спробуйте ще раз')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal open onClose={onClose} title={offer.name}>
      {cards.length === 0 ? (
        <p className="text-sm text-muted">Спершу відкрийте картку.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-xl bg-surface-2 px-4 py-3 text-sm">
            <div className="flex justify-between py-1">
              <span className="text-muted">Сума</span>
              <span className="font-medium text-fg">{offer.requiredAmount.toLocaleString('uk-UA')} ₴</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted">Строк</span>
              <span className="font-medium text-fg">{offer.termDays} днів</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted">Дохідність</span>
              <span className="font-medium text-fg">{offer.annualRatePercent}% річних</span>
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-muted">Картка списання</span>
            <select
              value={cardId}
              onChange={(e) => setCardId(e.target.value)}
              className="w-full rounded-2xl bg-surface-2 border border-stroke px-4 py-3.5 text-fg outline-none transition-colors focus:border-brand-500 focus:bg-surface-3"
            >
              {cards.map((card) => (
                <option key={card.id} value={card.id}>
                  •••• {card.cardNumber.slice(-4)} — {card.balanceAmount.toLocaleString('uk-UA')} {CURRENCY_LABELS[card.balanceCurrency]}
                </option>
              ))}
            </select>
          </label>

          {formError && <p className="text-sm text-red-400">{formError}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Купуємо...' : 'Купити облігацію'}
          </Button>
        </form>
      )}
    </Modal>
  )
}
