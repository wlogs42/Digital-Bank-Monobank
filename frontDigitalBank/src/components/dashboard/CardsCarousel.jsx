import { Plus } from 'lucide-react'
import BankCard from '../common/BankCard'

export default function CardsCarousel({ cards, onAddCard }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
      {cards.map((card) => (
        <div key={card.id} className="w-64 shrink-0 snap-start sm:w-72">
          <BankCard card={card} />
        </div>
      ))}
      <button
        onClick={onAddCard}
        className="flex w-40 shrink-0 flex-col items-center justify-center gap-2 rounded-card border border-dashed border-stroke text-faint hover:border-white/30 hover:text-muted"
      >
        <Plus size={20} />
        <span className="text-sm">Додати картку</span>
      </button>
    </div>
  )
}