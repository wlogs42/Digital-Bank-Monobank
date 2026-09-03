import { useState } from 'react'
import Modal from '../common/Modal'
import TextField from '../common/TextField'
import Button from '../common/Button'

function tomorrowDate() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 10)
}

export default function TakeCreditModal({ cards, onClose, onSubmit, onSuccess }) {
  const [cardId, setCardId] = useState(cards[0]?.id ?? '')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState(tomorrowDate())
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    if (!dueDate) {
      setFormError('Оберіть дату повернення')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({ cardId: Number(cardId), amount: numericAmount, dueDate })
      onSuccess?.()
    } catch (err) {
      setFormError(err.response?.data?.error ?? 'Щось пішло не так, спробуйте ще раз')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal open onClose={onClose} title="Кредит «До завтра»">
      {cards.length === 0 ? (
        <p className="text-sm text-muted">Спершу відкрийте картку.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-muted">Гроші одразу зарахуються на картку. За кожен день до погашення — +3 ₴.</p>

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
            label="Сума кредиту, ₴"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <TextField
            label="Повернути до"
            type="date"
            min={tomorrowDate()}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          {formError && <p className="text-sm text-red-400">{formError}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Оформлюємо...' : 'Взяти кредит'}
          </Button>
        </form>
      )}
    </Modal>
  )
}
