import {
  WalletCards,
  CalendarDays,
  Percent,
  ShieldCheck,
  ArrowRight,
  PiggyBank,
  Info,
} from 'lucide-react'

import Container from '../components/common/Container'
import piggy from '../assets/piggy.png'

export default function CreditPage({ userBalance = 0 }) {
  return (
    <Container className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-brand-400">
            PiggyBank
          </p>

          <h1 className="font-display text-3xl font-bold tracking-tight text-fg">
            Кредити
          </h1>

          <p className="mt-1 max-w-xl text-sm text-muted">
            Керуйте кредитними можливостями, переглядайте доступний ліміт
            та обирайте зручний спосіб фінансування.
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-brand-500 via-brand-600 to-purple-700 p-6 shadow-card sm:p-8">
          <div className="relative z-10 max-w-md">
            <div className="flex items-center gap-2 text-sm font-medium text-white/80">
              <WalletCards size={18} />
              Доступний кредитний ліміт
              <button
                className="rounded-full p-1 transition hover:bg-white/10"
                aria-label="Інформація"
              >
                <Info size={15} />
              </button>
            </div>
            <p className="mt-5 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {userBalance.toLocaleString('uk-UA', {
                minimumFractionDigits: 2,
              })}{' '}
              ₴
            </p>
            <p className="mt-2 text-sm text-white/60">
              Сума, доступна для використання
            </p>
            <button className="mt-6 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-white/90">
              Переглянути умови
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 right-20 h-48 w-48 rounded-full bg-white/5" />
        </div>

        <div className="rounded-card border border-stroke bg-surface p-6">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <ShieldCheck size={21} />
              </div>
              <h2 className="mt-5 font-display text-lg font-semibold text-fg">
                Ваш кредитний профіль
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Переглядайте доступні пропозиції та використовуйте кредитні
                можливості PiggyBank.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-stroke pt-4">
              <span className="text-sm text-muted">
                Статус
              </span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                Активний
              </span>
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className="mb-4">
          <h2 className="font-display text-xl font-bold text-fg">
            Кредитні можливості
          </h2>
          <p className="mt-1 text-sm text-muted">
            Оберіть потрібну послугу
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <button className="group relative min-h-[190px] overflow-hidden rounded-card border border-stroke bg-surface p-5 text-left transition hover:border-brand-500/40 hover:bg-surface-2">
            <div className="relative z-10 max-w-[65%]">
                <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                    <PiggyBank size={21} />
                </div>

                <ArrowRight
                    size={18}
                    className="text-muted transition group-hover:translate-x-1 group-hover:text-fg"
                />
                </div>

                <h3 className="mt-6 font-semibold text-fg">
                Покупка частинами
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted">
                Розподіліть вартість покупки на зручні щомісячні платежі.
                </p>

                <div className="mt-5 text-xs font-medium text-brand-400">
                Дізнатися більше
                </div>
            </div>
            <div className="pointer-events-none absolute -bottom-2 -right-2 w-42 sm:w-46">
                <img
                src={piggy}
                alt="DigitalBank mascot"
                className="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            </button>

          <button className="group rounded-card border border-stroke bg-surface p-5 text-left transition hover:border-brand-500/40 hover:bg-surface-2">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Percent size={21} />
              </div>
              <ArrowRight
                size={18}
                className="text-muted transition group-hover:translate-x-1 group-hover:text-fg"
              />
            </div>
            <h3 className="mt-6 font-semibold text-fg">
              Розстрочка на картку
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Здійснюйте великі покупки та повертайте кошти частинами.
            </p>
            <div className="mt-5 text-xs font-medium text-brand-400">
              Переглянути умови
            </div>
          </button>
          <button className="group rounded-card border border-stroke bg-surface p-5 text-left transition hover:border-brand-500/40 hover:bg-surface-2">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <CalendarDays size={21} />
              </div>
              <ArrowRight
                size={18}
                className="text-muted transition group-hover:translate-x-1 group-hover:text-fg"
              />
            </div>
            <h3 className="mt-6 font-semibold text-fg">
              Кредит «До завтра»
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Швидкий доступ до коштів, коли вони потрібні саме зараз.
            </p>
            <div className="mt-5 text-xs font-medium text-brand-400">
              Детальніше
            </div>
          </button>
        </div>
      </section>



      {/* Archive */}
      <div className="flex justify-center pb-2">
        <button className="flex items-center gap-2 rounded-xl border border-stroke bg-surface px-5 py-2.5 text-sm font-medium text-muted transition hover:bg-surface-2 hover:text-fg">
          Архів кредитів
          <ArrowRight size={15} />
        </button>
      </div>
    </Container>
  )
}