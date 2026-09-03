import { useState } from 'react'
import { Eye, EyeOff, Copy, Check } from 'lucide-react'

const currencyNames = ['UAH', 'USD', 'EUR']
const currencySymbols = { UAH: '₴', USD: '$', EUR: '€' }

const gradients = {
  Debit: 'from-pink-500 via-rose-500 to-pink-700',
  Credit: 'from-neutral-700 via-neutral-800 to-black',
}

const maskNumber = (number) => `•••• •••• •••• ${number.slice(-4)}`
const formatFullNumber = (number) => number.replace(/(\d{4})(?=\d)/g, '$1 ')

export default function BankCard({ card }) {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  const currency = currencyNames[card.balanceCurrency] ?? 'UAH'
  const gradient = gradients[card.cardType] ?? gradients.Debit

  const handleCopy = async (e) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(card.cardNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={`relative flex h-44 flex-col justify-between overflow-hidden rounded-card bg-gradient-to-br ${gradient} p-5 text-white shadow-card`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/80">
          {card.cardType === 'Credit' ? 'Кредитна картка' : 'Основна картка'}
        </span>
        <button
          onClick={() => setRevealed((r) => !r)}
          className="rounded-full p-1 hover:bg-white/10"
          aria-label="Показати номер картки"
        >
          {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <p className="font-display text-2xl font-bold tracking-tight">
        {(card.balanceAmount)} <span className="text-white/70">{currencySymbols[currency]}</span>
      </p>

      <div className="flex items-end justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm tracking-widest text-white/90">
            {revealed ? formatFullNumber(card.cardNumber) : maskNumber(card.cardNumber)}
          </span>
          {revealed && (
            <button onClick={handleCopy} className="rounded-full p-1 hover:bg-white/10" aria-label="Копіювати номер">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          )}
        </div>
        <span className="text-xs font-semibold uppercase text-white/70">
          {card.cardType === 'Credit' ? 'Mastercard' : 'Visa'}
        </span>
      </div>
    </div>
  )
}