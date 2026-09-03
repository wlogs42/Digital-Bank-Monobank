import { useState } from 'react'
import { Eye, EyeOff, Copy, Check } from 'lucide-react'

const currencySymbols = { UAH: '₴', USD: '$', EUR: '€' }
const currencyNames = ['UAH', 'USD', 'EUR']
const formatMasked = (n) => `•••• •••• •••• ${n.slice(-4)}`
const formatFull = (n) => n.replace(/(\d{4})(?=\d)/g, '$1 ')

export default function CardWidget({ card, gradient = 'from-pink-500 via-rose-500 to-pink-700' }){
    const [revealed, setRevealed] = useState(false)
    const [copied, setCopied] = useState(false)
    const currency = currencyNames[card.balanceCurrency] ?? 'UAH'

    const handleCopy = async () => {
        await navigator.clipboard.writeText(card.cardNumber)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return(
        <div className={`relative min-w-[280px] overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-5 text-white shadow-xl`}>
            <div className="flex items-center justify-between">
                <span>{card.cardType === 'Credit' ? 'Кредитна картка' : 'Картка для виплат'}</span>
                <button onClick={()=> setRevealed((r)=> !r)}className="rounded-full p-1 hover:bg-white/10" aria-label="Показати номер">
                    {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
            <p className="mt-6 text-2xl font-semibold tracking-tight">
                {card.balanceAmount.toLocaleString('uk-UA', { minimumFractionDigits: 2 })}{' '}
                <span className="text-white/70">{currencySymbols[currency]}</span>
            </p>

        <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
            <span className="font-mono text-sm tracking-widest text-white/90">
                {revealed ? formatFull(card.cardNumber) : formatMasked(card.cardNumber)}
            </span>
            {revealed && (
                <button onClick={handleCopy} className="rounded-full p-1 hover:bg-white/10" aria-label="Копіювати номер">
                {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
            )}
            </div>
            <span className="text-sm font-bold uppercase">{card.cardType === 'Credit' ? 'Mastercard' : 'Visa'}</span>
            </div>
        </div>

)}

