import { useEffect, useState } from 'react'
import { CalendarDays } from 'lucide-react'

import Container from '../components/common/Container'
import Button from '../components/common/Button'
import TermInvestmentModal from '../components/savings/TermInvestmentModal'
import { useAuthStore } from '../store/useAuthStore'
import { getUserCards } from '../Servises/cardService'
import { getDepositRates, getUserDeposits, openDeposit, withdrawDeposit } from '../Servises/depositService'
import { CURRENCY_LABELS } from '../utils/currency'

export default function DepositsPage() {
  const user = useAuthStore((s) => s.user)
  const userId = user?.id
  const [cards, setCards] = useState([])
  const [rates, setRates] = useState([])
  const [deposits, setDeposits] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [pendingId, setPendingId] = useState(null)
  const [listError, setListError] = useState('')

  useEffect(() => {
    if (!userId) return
    let cancelled = false

    async function load() {
      try {
        const [cardsData, ratesData, depositsData] = await Promise.all([
          getUserCards(userId),
          getDepositRates(),
          getUserDeposits(userId),
        ])
        if (!cancelled) {
          setCards(cardsData)
          setRates(ratesData)
          setDeposits(depositsData)
        }
      } catch {
        if (!cancelled) setListError('Не вдалося завантажити дані')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [userId])

  async function refreshDeposits() {
    try {
      setDeposits(await getUserDeposits(userId))
    } catch {
      setListError('Не вдалося оновити список депозитів')
    }
  }

  async function handleWithdraw(depositId, cardId) {
    setPendingId(depositId)
    try {
      await withdrawDeposit(depositId, cardId)
      await refreshDeposits()
    } catch (err) {
      setListError(err.response?.data?.error ?? 'Не вдалося зняти депозит')
    } finally {
      setPendingId(null)
    }
  }

  const activeDeposits = deposits.filter((d) => !d.withdrawnAtUtc)

  return (
    <Container className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-brand-400">PiggyBank</p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-fg">Депозити</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Ставка залежить від валюти картки. Тримайте гроші до кінця строку — і отримаєте вищий відсоток.
          </p>
        </div>

        <Button onClick={() => setModalOpen(true)}>
          <CalendarDays size={16} />
          Відкрити депозит
        </Button>
      </div>

      {listError && <p className="text-sm text-red-400">{listError}</p>}

      <section>
        <div className="grid gap-4 md:grid-cols-3">
          {rates.map((rate) => (
            <div key={rate.currency} className="rounded-card border border-stroke bg-surface p-5">
              <p className="text-sm text-muted">{CURRENCY_LABELS[rate.currency]}</p>
              <p className="mt-2 font-display text-2xl font-bold text-fg">{rate.maturityRatePercent}%</p>
              <p className="text-xs text-muted">річних до кінця строку</p>
              <div className="mt-4 border-t border-stroke pt-3 text-xs text-muted">
                {rate.earlyRatePercent}% при достроковому знятті
              </div>
            </div>
          ))}
        </div>
      </section>

      {activeDeposits.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="font-display text-xl font-bold text-fg">Мої депозити</h2>
          </div>

          <div className="space-y-3">
            {activeDeposits.map((deposit) => (
              <div
                key={deposit.id}
                className="flex flex-col gap-3 rounded-card border border-stroke bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-fg">
                    {deposit.principalAmount.toLocaleString('uk-UA')} {CURRENCY_LABELS[deposit.currency]} на {deposit.termDays} днів
                  </p>
                  <p className="text-sm text-muted">
                    Ставка зараз{' '}
                    <span className="font-medium text-fg">
                      {deposit.appliedRatePercentNow}% {deposit.isEarlyWithdrawalNow ? '(дострокове зняття)' : '(повний строк)'}
                    </span>{' '}
                    · нараховано {deposit.accruedInterestNow.toLocaleString('uk-UA')} · до виплати{' '}
                    {deposit.payoutAmountNow.toLocaleString('uk-UA')}
                  </p>
                </div>
                <Button
                  disabled={pendingId === deposit.id}
                  onClick={() => handleWithdraw(deposit.id, deposit.cardId)}
                >
                  {pendingId === deposit.id ? 'Знімаємо...' : 'Зняти'}
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}

      {modalOpen && (
        <TermInvestmentModal
          title="Відкрити депозит"
          description="Оберіть картку — ставка залежить від її валюти."
          ctaLabel="Відкрити депозит"
          cards={cards}
          rates={rates}
          onClose={() => setModalOpen(false)}
          onSubmit={({ cardId, amount, termDays }) => openDeposit({ userId, cardId, amount, termDays })}
          onSuccess={() => {
            setModalOpen(false)
            refreshDeposits()
          }}
        />
      )}
    </Container>
  )
}
