import { useState } from 'react'
import Modal from '../../components/common/Modal'
import TextField from '../../components/common/TextField'
import Button from '../../components/common/Button'
import { CURRENCY_LABELS } from '../../utils/currency'
import { depositToPiggyBank } from '../../Servises/piggyBankService'
import { useAuthStore } from '../../store/useAuthStore'

export default function DepositPiggyBankModal({ open, piggyBank, cards = [], onClose, onSuccess }) {
  const user = useAuthStore((state) => state.user)
  const [cardId, setCardId] = useState(cards[0]?.id ?? '')
  const [amount, setAmount] = useState('')
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!open || !piggyBank) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const numericAmount = Number(amount)

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
      const payload = {
        userId: user.id,
        cardId: Number(cardId),
        amount: numericAmount,
      }

      const updatedPiggyBank = await depositToPiggyBank(piggyBank.id, payload)
      setAmount('')
      onSuccess?.(updatedPiggyBank)
      onClose()
    } catch (err) {
      setFormError(err.response?.data?.error ?? 'Щось пішло не так, спробуйте ще раз')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Поповнити "${piggyBank.name}"`}>
      {cards.length === 0 ? (
        <p className="text-sm text-muted">Спершу відкрийте картку.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-muted">Картка списання</span>
            <select
              value={cardId}
              onChange={(e) => setCardId(e.target.value)}
              className="w-full rounded-2xl border border-stroke bg-surface-2 px-4 py-3.5 text-fg outline-none transition-colors focus:border-brand-500 focus:bg-surface-3"
            >
              {cards.map((card) => (
                <option key={card.id} value={card.id}>
                  •••• {card.cardNumber.slice(-4)} — {card.balanceAmount.toLocaleString('uk-UA')} {CURRENCY_LABELS[card.balanceCurrency] ?? '₴'}
                </option>
              ))}
            </select>
          </label>

          <TextField
            label="Сума поповнення (₴)"
            type="number"
            min="1"
            step="0.01"
            placeholder="500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {formError && <p className="text-sm text-red-400">{formError}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Обробляємо...' : 'Поповнити скарбничку'}
          </Button>
        </form>
      )}
    </Modal>
  )
}