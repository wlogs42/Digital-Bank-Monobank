import { useEffect, useState } from 'react'
import Modal from '../common/Modal'
import TextField from '../common/TextField'
import Button from '../common/Button'
import { lookupCard, transferFunds } from '../../Servises/transferService'

export default function TransferModal({ onClose, cards, onSuccess }) {
  const [fromCardId, setFromCardId] = useState(cards[0]?.id ?? '')
  const [toCardNumber, setToCardNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [lookup, setLookup] = useState(null)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (toCardNumber.length !== 16) return

    let cancelled = false
    lookupCard(toCardNumber)
      .then((data) => {
        if (!cancelled) setLookup({ cardNumber: toCardNumber, data, error: '' })
      })
      .catch(() => {
        if (!cancelled) setLookup({ cardNumber: toCardNumber, data: null, error: 'Картку не знайдено' })
      })

    return () => {
      cancelled = true
    }
  }, [toCardNumber])

  const recipient = lookup?.cardNumber === toCardNumber ? lookup.data : null
  const lookupError = lookup?.cardNumber === toCardNumber ? lookup.error : ''

  const onSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const numericAmount = Number(amount)

    if (!fromCardId) {
      setFormError('Оберіть картку списання')
      return
    }
    if (toCardNumber.length !== 16 || !recipient) {
      setFormError('Вкажіть коректний номер картки отримувача')
      return
    }
    if (!numericAmount || numericAmount <= 0) {
      setFormError('Вкажіть суму переказу')
      return
    }

    setIsSubmitting(true)
    try {
      await transferFunds({
        fromCardId: Number(fromCardId),
        toCardNumber,
        amount: numericAmount,
      })
      onSuccess?.()
    } catch (err) {
      setFormError(err.response?.data?.error ?? 'Щось пішло не так, спробуйте ще раз')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal open onClose={onClose} title="Переказ на картку">
      {cards.length === 0 ? (
        <p className="text-sm text-muted">Спершу відкрийте картку, щоб можна було переказувати кошти.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-muted">Картка списання</span>
            <select
              value={fromCardId}
              onChange={(e) => setFromCardId(e.target.value)}
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
            label="Номер картки отримувача"
            value={toCardNumber}
            onChange={(e) => setToCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
            inputMode="numeric"
            placeholder="0000000000000000"
            hint={recipient ? `Отримувач: ${recipient.userFirstName} ${recipient.userLastName}` : undefined}
            error={lookupError || undefined}
          />

          <TextField
            label="Сума, ₴"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {formError && <p className="text-sm text-red-400">{formError}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Переказуємо...' : 'Переказати'}
          </Button>
        </form>
      )}
    </Modal>
  )
}
