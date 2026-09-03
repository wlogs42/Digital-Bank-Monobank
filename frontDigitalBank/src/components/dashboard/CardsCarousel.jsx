import { Plus } from 'lucide-react'
import BankCard from '../common/BankCard'

export default function CardsCarousel({ cards, onAddCard }) {
  return (
    <div className="-mx-4 flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory touch-pan-x
        overscroll-x-contain
        sm:-mx-1
        sm:px-1">
            
      {cards.map((card) => (
        <div key={card.id} className="w-[calc(100vw-32px)]
            max-w-[360px]
            shrink-0
            snap-center
            sm:w-72">
          <BankCard card={card} />
        </div>
      ))}
      <button
        onClick={onAddCard}
        className="flex
          h-full
          min-h-[177px]
          w-[calc(100vw-32px)]
          max-w-[360px]
          shrink-0
          snap-center
          flex-col
          items-center
          justify-center
          gap-2
          rounded-card
          border
          border-dashed
          border-stroke
          text-faint
          transition
          hover:border-white/30
          hover:text-muted
          sm:w-40"
      >
        <Plus size={20} />
        <span className="text-sm">Додати картку</span>
      </button>
    </div>
  )
}