import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const pieceColors = ['bg-brand-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500']

export default function SavingsWidget({ pots = [], onCreateClick }) {
  const navigate = useNavigate()

  return (
    <div className="rounded-card border border-stroke bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display font-semibold text-fg">Мої скарбнички</h3>
        <button
          onClick={() => navigate('/savings')}
          className="text-sm font-medium text-brand-400 hover:text-brand-300 transition"
        >
          Усі
        </button>
      </div>

      {pots.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted">
          У вас поки немає активних скарбничок
        </p>
      ) : (
        <ul className="space-y-4">
          {pots.slice(0, 4).map((pot, i) => {
            const pct = pot.targetAmount > 0
              ? Math.min(100, Math.round((pot.currentAmount / pot.targetAmount) * 100))
              : 0

            return (
              <li key={pot.id} className="flex items-center gap-3">

                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-fg">{pot.name}</span>
                    <span className="text-muted">
                      {pot.currentAmount.toLocaleString('uk-UA')} ₴
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${pieceColors[i % pieceColors.length]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <button
        onClick={onCreateClick}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-stroke py-2.5 text-sm text-muted transition hover:border-brand-500/50 hover:text-fg"
      >
        <Plus size={16} />
        Створити скарбничку
      </button>
    </div>
  )
}