import { useState } from 'react'
import Modal from '../../components/common/Modal'
import TextField from '../../components/common/TextField'
import Button from '../../components/common/Button'
import { createPiggyBank } from '../../Servises/piggyBankService' 
import { useAuthStore } from '../../store/useAuthStore'

export default function PiggyBankModal({ open, onClose, onSuccess }) {
  const user = useAuthStore((state) => state.user)
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('Введіть назву скарбнички')
      return
    }
    const amount = Number(targetAmount)
    if (isNaN(amount) || amount <= 0) {
      setError('Цільова сума має бути більшою за 0')
      return
    }

    try {
      setIsSubmitting(true)
      const payload = {
        userId: user.id,
        name: name.trim(),
        targetAmount: amount,
      }

      const newPiggyBank = await createPiggyBank(payload)
      
      setName('')
      setTargetAmount('')
      onSuccess(newPiggyBank)
      onClose()
    } catch (err) {
      setError(err.response?.data?.error ?? 'Не вдалося створити скарбничку')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Створити скарбничку">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Назва цілі"
          placeholder="Наприклад: На ноутбук"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Цільова сума (₴)"
          type="number"
          step="0.01"
          placeholder="10000"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Скасувати
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Створення...' : 'Створити'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}