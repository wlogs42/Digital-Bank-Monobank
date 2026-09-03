import { useEffect, useState } from 'react'
import { Landmark, ArrowRight } from 'lucide-react'

import Container from '../components/common/Container'
import Button from '../components/common/Button'
import BuyBondModal from '../components/bonds/BuyBondModal'
import { useAuthStore } from '../store/useAuthStore'
import { getUserCards } from '../Servises/cardService'
import { buyBond, getBondOffers, getUserBonds, redeemBond } from '../Servises/bondService'

export default function BondsPage() {
  const user = useAuthStore((s) => s.user)
  const userId = user?.id
  const [cards, setCards] = useState([])
  const [offers, setOffers] = useState([])
  const [bonds, setBonds] = useState([])
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [pendingId, setPendingId] = useState(null)
  const [listError, setListError] = useState('')

  useEffect(() => {
    if (!userId) return
    let cancelled = false

    async function load() {
      try {
        const [cardsData, offersData, bondsData] = await Promise.all([
          getUserCards(userId),
          getBondOffers(),
          getUserBonds(userId),
        ])
        if (!cancelled) {
          setCards(cardsData)
          setOffers(offersData)
          setBonds(bondsData)
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

  async function refreshBonds() {
    try {
      setBonds(await getUserBonds(userId))
    } catch {
      setListError('Не вдалося оновити список облігацій')
    }
  }

  async function handleRedeem(bondId, cardId) {
    setPendingId(bondId)
    try {
      await redeemBond(bondId, cardId)
      await refreshBonds()
    } catch (err) {
      setListError(err.response?.data?.error ?? 'Не вдалося погасити облігацію')
    } finally {
      setPendingId(null)
    }
  }

  const activeBonds = bonds.filter((b) => !b.redeemedAtUtc)

  return (
    <Container className="space-y-8">
      <div>
        <p className="mb-1 text-sm font-medium text-brand-400">PiggyBank</p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-fg">Облігації</h1>
        <p className="mt-1 max-w-xl text-sm text-muted">
          Готові пропозиції державних облігацій — оберіть строк і дохідність, яка вам підходить.
        </p>
      </div>

      {listError && <p className="text-sm text-red-400">{listError}</p>}

      <section>
        <div className="grid gap-4 md:grid-cols-3">
          {offers.map((offer) => (
            <div key={offer.id} className="rounded-card border border-stroke bg-surface p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Landmark size={21} />
              </div>

              <h3 className="mt-5 font-display text-lg font-semibold text-fg">{offer.name}</h3>

              <div className="mt-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Сума</span>
                  <span className="font-medium text-fg">{offer.requiredAmount.toLocaleString('uk-UA')} ₴</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Строк</span>
                  <span className="font-medium text-fg">{offer.termDays} днів</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Дохідність</span>
                  <span className="font-medium text-emerald-400">{offer.annualRatePercent}% річних</span>
                </div>
              </div>

              <Button onClick={() => setSelectedOffer(offer)} className="mt-5 w-full">
                Купити
                <ArrowRight size={16} />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {activeBonds.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="font-display text-xl font-bold text-fg">Мої облігації</h2>
          </div>

          <div className="space-y-3">
            {activeBonds.map((bond) => (
              <div
                key={bond.id}
                className="flex flex-col gap-3 rounded-card border border-stroke bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-fg">{bond.offerName}</p>
                  <p className="text-sm text-muted">
                    {bond.principalAmount.toLocaleString('uk-UA')} ₴ · дохід{' '}
                    <span className="font-medium text-fg">{bond.accruedYieldNow.toLocaleString('uk-UA')} ₴</span> · до
                    виплати {bond.payoutAmountNow.toLocaleString('uk-UA')} ₴
                  </p>
                </div>
                <Button disabled={pendingId === bond.id} onClick={() => handleRedeem(bond.id, bond.cardId)}>
                  {pendingId === bond.id ? 'Гасимо...' : 'Погасити'}
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedOffer && (
        <BuyBondModal
          offer={selectedOffer}
          cards={cards}
          onClose={() => setSelectedOffer(null)}
          onSubmit={({ cardId }) => buyBond({ userId, cardId, offerId: selectedOffer.id })}
          onSuccess={() => {
            setSelectedOffer(null)
            refreshBonds()
          }}
        />
      )}
    </Container>
  )
}
