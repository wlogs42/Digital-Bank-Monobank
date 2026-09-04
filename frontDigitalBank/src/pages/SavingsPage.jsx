import { Link } from 'react-router-dom'
import {
  Landmark,
  CalendarDays,
  ArrowRight,
  Sparkles,
  ArrowDownRight,
  PiggyBank as PiggyIcon,
  Plus,
} from 'lucide-react'

import Container from '../components/common/Container'
import piggy from '../assets/piggy.png'
import { useAuthStore } from '../store/useAuthStore'
import { useEffect, useState } from 'react'
import { getUserCards } from '../Servises/cardService'
import { getUserPiggyBanks } from '../Servises/piggyBankService'
import PiggyBankModal from '../components/savings/PiggyBankModal'
import DepositPiggyBankModal from '../components/savings/DepositPiggyBankModal'

export default function SavingsPage() {
  const user = useAuthStore((state) => state.user)
  const [piggyBanks, setPiggyBanks] = useState([])
  const [cards, setCards] = useState([])
  
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [depositTargetPiggy, setDepositTargetPiggy] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      Promise.all([
        getUserPiggyBanks(user.id),
        getUserCards(user.id), 
      ])
        .then(([piggiesData, cardsData]) => {
          setPiggyBanks(piggiesData)
          setCards(cardsData)
        })
        .catch((err) => console.error('Помилка завантаження даних:', err))
        .finally(() => setIsLoading(false))
    }
  }, [user?.id])

  const handleDepositSuccess = (updatedPiggy) => {
    setPiggyBanks((prev) =>
      prev.map((item) => (item.id === updatedPiggy.id ? updatedPiggy : item))
    )
  }
  return (
    <Container className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-brand-400">PiggyBank</p>

          <h1 className="font-display text-3xl font-bold tracking-tight text-fg">Накопичення</h1>

          <p className="mt-1 max-w-xl text-sm text-muted">
            Відкладайте на цілі, тримайте гроші під відсотком або інвестуйте в облігації —
            все в одному місці.
          </p>
        </div>
      </div>

      <button onClick={() => setIsCreateOpen(true)}
      className="group relative block w-full overflow-hidden rounded-card bg-gradient-to-br from-brand-500 via-brand-600 to-purple-700 p-8 text-left shadow-card transition hover:brightness-110 sm:p-10">
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-2 text-sm font-medium text-white/80">
            <Sparkles size={18} />
            Найпопулярніше
          </div>

          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Відкрити скарбничку
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            Заведіть окрему ціль — на подорож, подарунок чи подушку безпеки — і відкладайте
            туди гроші окремо від основного рахунку.
          </p>

          <div className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-neutral-900 transition group-hover:bg-white/90">
            Відкрити скарбничку
            <ArrowRight size={16} />
          </div>
        </div>

        <div className="pointer-events-none absolute -bottom-6 -right-6 w-48 sm:w-64">
          <img
            src={piggy}
            alt="Хрю Банк mascot"
            className="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
      </button>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-fg">Мої скарбнички</h2>
            <p className="mt-1 text-sm text-muted">Активні цілі накопичення</p>
          </div>
          {piggyBanks.length > 0 && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-stroke bg-surface px-3.5 py-2 text-xs font-semibold text-fg transition hover:bg-surface-2"
            >
              <Plus size={16} /> Створити ціль
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="rounded-card border border-stroke bg-surface p-6 text-center text-sm text-muted">
            Завантаження...
          </div>
        ) : piggyBanks.length === 0 ? (
          <div className="rounded-card border border-dashed border-stroke p-8 text-center text-sm text-muted">
            У вас немає активних скарбничок.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {piggyBanks.map((item) => {
              const progress = item.targetAmount > 0
                ? Math.min(100, Math.round((item.currentAmount / item.targetAmount) * 100))
                : 0

              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between rounded-card border border-stroke bg-surface p-5 text-left transition hover:border-brand-500/40"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                        <PiggyIcon size={20} />
                      </div>
                      <span className="text-xs font-bold text-brand-400">{progress}%</span>
                    </div>

                    <h3 className="mt-4 font-semibold text-fg">{item.name}</h3>

                    <div className="mt-3 flex justify-between text-xs text-muted">
                      <span>Накопичено:</span>
                      <span className="font-medium text-fg">{item.currentAmount} ₴</span>
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-muted">
                      <span>Ціль:</span>
                      <span>{item.targetAmount} ₴</span>
                    </div>

                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full bg-brand-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setDepositTargetPiggy(item)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-surface-2 py-2.5 text-xs font-semibold text-fg transition hover:bg-brand-500 hover:text-white"
                  >
                    <ArrowDownRight size={16} /> Поповнити
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4">
          <h2 className="font-display text-xl font-bold text-fg">Інші можливості</h2>
          <p className="mt-1 text-sm text-muted">Оберіть потрібну послугу</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            to="/bonds"
            className="group rounded-card border border-stroke bg-surface p-5 text-left transition hover:border-brand-500/40 hover:bg-surface-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Landmark size={21} />
              </div>
              <ArrowRight
                size={18}
                className="text-muted transition group-hover:translate-x-1 group-hover:text-fg"
              />
            </div>
            <h3 className="mt-6 font-semibold text-fg">Облігації</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Готові пропозиції державних облігацій — оберіть строк і дохідність.
            </p>
            <div className="mt-5 text-xs font-medium text-brand-400">Переглянути пропозиції</div>
          </Link>

          <Link
            to="/deposits"
            className="group rounded-card border border-stroke bg-surface p-5 text-left transition hover:border-brand-500/40 hover:bg-surface-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <CalendarDays size={21} />
              </div>
              <ArrowRight
                size={18}
                className="text-muted transition group-hover:translate-x-1 group-hover:text-fg"
              />
            </div>
            <h3 className="mt-6 font-semibold text-fg">Відкрити депозит</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Ставка залежить від валюти картки — гривня, долар чи євро.
            </p>
            <div className="mt-5 text-xs font-medium text-brand-400">Відкрити депозит</div>
          </Link>
        </div>
      </section>

      <PiggyBankModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={(newPiggy) => setPiggyBanks((prev) => [newPiggy, ...prev])}
      />

      {depositTargetPiggy && (
        <DepositPiggyBankModal
          open
          piggyBank={depositTargetPiggy}
          cards={cards}
          onClose={() => setDepositTargetPiggy(null)}
          onSuccess={handleDepositSuccess}
        />
      )}
    </Container>
  )
}
