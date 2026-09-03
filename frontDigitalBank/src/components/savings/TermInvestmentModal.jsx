import { useState } from 'react'
import Modal from '../common/Modal'
import TextField from '../common/TextField'
import Button from '../common/Button'
import { CURRENCY_LABELS } from '../../utils/currency'

export default function TermInvestmentModal({ title, description, ctaLabel, cards, rates, onClose, onSubmit, onSuccess }) {
  const [cardId, setCardId] = useState(cards[0]?.id ?? '')
  const [amount, setAmount] = useState('')
  const [termDays, setTermDays] = useState('30')
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedCard = cards.find((c) => String(c.id) === String(cardId))
  const selectedRate = rates?.find((r) => r.currency === selectedCard?.balanceCurrency)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const numericAmount = Number(amount)
    const numericTermDays = Number(termDays)

    if (!cardId) {
      setFormError('Оберіть картку')
      return
    }
    if (!numericAmount || numericAmount <= 0) {
      setFormError('Вкажіть суму')
      return
    }
    if (!numericTermDays || numericTermDays <= 0) {
      setFormError('Вкажіть строк у днях')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({ cardId: Number(cardId), amount: numericAmount, termDays: numericTermDays })
      onSuccess?.()
    } catch (err) {
      setFormError(err.response?.data?.error ?? 'Щось пішло не так, спробуйте ще раз')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal open onClose={onClose} title={title}>
      {cards.length === 0 ? (
        <p className="text-sm text-muted">Спершу відкрийте картку.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {description && <p className="text-sm text-muted">{description}</p>}

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

          {selectedRate && (
            <p className="rounded-xl bg-surface-2 px-4 py-3 text-xs leading-relaxed text-muted">
              Ставка для {CURRENCY_LABELS[selectedCard.balanceCurrency]}:{' '}
              <span className="font-medium text-fg">{selectedRate.maturityRatePercent}%</span> річних, якщо тримати до кінця строку, або{' '}
              <span className="font-medium text-fg">{selectedRate.earlyRatePercent}%</span> при достроковому знятті.
            </p>
          )}

          <TextField
            label="Сума"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <TextField
            label="Строк, днів"
            type="number"
            min="1"
            step="1"
            value={termDays}
            onChange={(e) => setTermDays(e.target.value)}
          />

          {formError && <p className="text-sm text-red-400">{formError}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Обробляємо...' : ctaLabel}
          </Button>
        </form>
      )}
    </Modal>
  )
}
