import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { formatDateTime } from '../../utils/format'
import { CURRENCY_SYMBOLS } from '../../utils/currency'



export default function TransfersList({ transfers, cardId }) {
  return (
    <div className="rounded-tile border border-white/10 bg-surface">
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <h3 className="font-display font-semibold">Останні перекази</h3>
      </div>

      {transfers.length === 0 ? (
        <p className="px-5 py-6 text-center text-sm text-faint">По цій картці ще немає переказів</p>
      ) : (
        <ul className="divide-y divide-white/5">
          {transfers.map((t) => {
            const isOutgoing = t.fromCardId === cardId
            const symbol = CURRENCY_SYMBOLS[t.currency] ?? '₴'

            return (
              <li key={t.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  isOutgoing ? 'bg-surface-3 text-fg' : 'bg-mint/15 text-mint'
                }`}>
                  {isOutgoing ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-fg">
                    {isOutgoing ? 'Переказ виконано' : 'Надходження'}
                  </p>
                  <p className="text-xs text-faint">ID операції: {t.id}</p>
                </div>

                <div className="shrink-0 text-right">
                  <p className={`text-sm font-semibold ${isOutgoing ? 'text-fg' : 'text-mint'}`}>
                    {isOutgoing ? '-' : '+'}
                    {t.amount.toLocaleString('uk-UA', { minimumFractionDigits: 2 })} {symbol}
                  </p>
                  <p className="text-xs text-faint">{formatDateTime(t.createdAtUtc)}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}