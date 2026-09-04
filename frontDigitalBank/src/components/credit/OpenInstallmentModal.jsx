import { useState } from 'react'
import Modal from '../common/Modal'
import TextField from '../common/TextField'
import Button from '../common/Button'

const MONTHS_OPTIONS = [3, 6, 12]
const ANNUAL_RATE_PERCENT = 20

export default function OpenInstallmentModal({ cards, onClose, onSubmit, onSuccess }) {
  const [cardId, setCardId] = useState(cards[0]?.id ?? '')
  const [amount, setAmount] = useState('')
  const [monthsCount, setMonthsCount] = useState(6)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const numericAmount = Number(amount) || 0
  const totalRepayment = numericAmount * (1 + (ANNUAL_RATE_PERCENT / 100) * (monthsCount / 12))
  const monthlyPayment = numericAmount > 0 ? totalRepayment / monthsCount : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!cardId) {
      setFormError('Оберіть картку')
      return
    }
    if (!numericAmount || numericAmount <= 0) {
      setFormError('Вкажіть суму')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({ cardId: Number(cardId), amount: numericAmount, monthsCount })
      onSuccess?.()
    } catch (err) {
      setFormError(err.response?.data?.error ?? 'Щось пішло не так, спробуйте ще раз')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal open onClose={onClose} title="Розстрочка на картку">
      {cards.length === 0 ? (
        <p className="text-sm text-muted">Спершу відкрийте картку.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-muted">Гроші одразу зарахуються на картку. Повертаєте рівними частинами щомісяця.</p>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-muted">Картка зарахування</span>
            <select
              value={cardId}
              onChange={(e) => setCardId(e.target.value)}
              className="w-full rounded-2xl bg-surface-2 border border-stroke px-4 py-3.5 text-fg outline-none transition-colors focus:border-brand-500 focus:bg-surface-3"
            >
              {cards.map((card) => (
                <option key={card.id} value={card.id}>
                  •••• {card.cardNumber.slice(-4)} — {card.balanceAmount.toLocaleString('uk-UA')} ₴
                </option>
              ))}
            </select>
          </label>

          <TextField
            label="Сума, ₴"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-muted">Кількість платежів</span>
            <select
              value={monthsCount}
              onChange={(e) => setMonthsCount(Number(e.target.value))}
              className="w-full rounded-2xl bg-surface-2 border border-stroke px-4 py-3.5 text-fg outline-none transition-colors focus:border-brand-500 focus:bg-surface-3"
            >
              {MONTHS_OPTIONS.map((months) => (
                <option key={months} value={months}>
                  {months} місяців
                </option>
              ))}
            </select>
          </label>

          {numericAmount > 0 && (
            <div className="rounded-xl bg-surface-2 px-4 py-3 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-muted">Щомісячний платіж</span>
                <span className="font-medium text-fg">{monthlyPayment.toLocaleString('uk-UA', { maximumFractionDigits: 2 })} ₴</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted">Всього до повернення</span>
                <span className="font-medium text-fg">{totalRepayment.toLocaleString('uk-UA', { maximumFractionDigits: 2 })} ₴</span>
              </div>
            </div>
          )}

          {formError && <p className="text-sm text-red-400">{formError}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Оформлюємо...' : 'Оформити розстрочку'}
          </Button>
        </form>
      )}
    </Modal>
  )
}
