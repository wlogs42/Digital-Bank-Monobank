import {
  Gift,
  Headphones,
  ScanLine,
  Car,
  Smartphone,
  Fuel,
  BadgePercent,
  ShieldCheck,
  PenTool,
  ArrowRight,

} from 'lucide-react'

import Container from '../components/common/Container'

export default function MorePage() {
  return (
    <Container className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-brand-400">Сервіси та можливості</p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-fg">Ще</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Усі додаткові послуги, партнерські програми, налаштування безпеки та підтримка в одному місці.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <button
          
          className="group rounded-card border border-stroke bg-surface p-5 text-left transition hover:border-brand-500/40 hover:bg-surface-2"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-400">
              <Gift size={21} />
            </div>
            <ArrowRight
              size={18}
              className="text-muted transition group-hover:translate-x-1 group-hover:text-fg"
            />
          </div>
          <h3 className="mt-5 font-semibold text-fg">Запросити друга</h3>
          <p className="mt-1 text-xs text-muted">Отримуйте бонуси за кожного приведого друга</p>
        </button>

        <button
          className="group rounded-card border border-stroke bg-surface p-5 text-left transition hover:border-brand-500/40 hover:bg-surface-2"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Headphones size={21} />
            </div>
            <ArrowRight
              size={18}
              className="text-muted transition group-hover:translate-x-1 group-hover:text-fg"
            />
          </div>
          <h3 className="mt-5 font-semibold text-fg">Служба підтримки</h3>
          <p className="mt-1 text-xs text-muted">Задайте питання або вирішіть проблему 24/7</p>
        </button>

        <button
          className="group rounded-card border border-stroke bg-surface p-5 text-left transition hover:border-brand-500/40 hover:bg-surface-2"
        >
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <ScanLine size={21} />
            </div>
            <ArrowRight
              size={18}
              className="text-muted transition group-hover:translate-x-1 group-hover:text-fg"
            />
          </div>
          <h3 className="mt-5 font-semibold text-fg">Сканер QR-коду</h3>
          <p className="mt-1 text-xs text-muted">Швидка оплата послуг та перекази</p>
        </button>
      </div>
      <section>
        <div className="mb-4">
          <h2 className="font-display text-xl font-bold text-fg">Сервіси та партнерство</h2>
          <p className="mt-1 text-sm text-muted">Корисні послуги для щоденного використання</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <button
            className="group rounded-card border border-stroke bg-surface p-5 text-left transition hover:border-brand-500/40 hover:bg-surface-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Car size={21} />
              </div>
              <ArrowRight
                size={18}
                className="text-muted transition group-hover:translate-x-1 group-hover:text-fg"
              />
            </div>
            <h3 className="mt-6 font-semibold text-fg">Автострахування</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Швидке оформлення ОСЦПВ та Зеленої картки прямо у додатку.
            </p>
            <div className="mt-5 text-xs font-medium text-brand-400">Оформити страховку</div>
          </button>

          <button
            className="group rounded-card border border-stroke bg-surface p-5 text-left transition hover:border-brand-500/40 hover:bg-surface-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                <Smartphone size={21} />
              </div>
              <ArrowRight
                size={18}
                className="text-muted transition group-hover:translate-x-1 group-hover:text-fg"
              />
            </div>
            <h3 className="mt-6 font-semibold text-fg">Мобільний зв’язок</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Підключення eSIM, поповнення рахунку та керування номерами.
            </p>
            <div className="mt-5 text-xs font-medium text-brand-400">Переглянути тарифи</div>
          </button>

          <button
            className="group rounded-card border border-stroke bg-surface p-5 text-left transition hover:border-brand-500/40 hover:bg-surface-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Fuel size={21} />
              </div>
              <ArrowRight
                size={18}
                className="text-muted transition group-hover:translate-x-1 group-hover:text-fg"
              />
            </div>
            <h3 className="mt-6 font-semibold text-fg">WOG</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Заправка авто без черги на касі, знижки та накопичення паливних бонусів.
            </p>
            <div className="mt-5 text-xs font-medium text-brand-400">Заправити авто</div>
          </button>

          <button
            className="group rounded-card border border-stroke bg-surface p-5 text-left transition hover:border-brand-500/40 hover:bg-surface-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400">
                <BadgePercent size={21} />
              </div>
              <ArrowRight
                size={18}
                className="text-muted transition group-hover:translate-x-1 group-hover:text-fg"
              />
            </div>
            <h3 className="mt-6 font-semibold text-fg">Програми лояльності</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Кешбек від партнерів, спеціальні пропозиції та персональні знижки.
            </p>
            <div className="mt-5 text-xs font-medium text-brand-400">Детальніше про кешбек</div>
          </button>
        </div>
      </section>

      {/* Секція безпеки */}
      <section>
        <div className="mb-4">
          <h2 className="font-display text-xl font-bold text-fg">Безпека та підпис</h2>
          <p className="mt-1 text-sm text-muted">Керування захистом та цифровими документами</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <button
            className="group rounded-card border border-stroke bg-surface p-5 text-left transition hover:border-brand-500/40 hover:bg-surface-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <ShieldCheck size={21} />
              </div>
              <ArrowRight
                size={18}
                className="text-muted transition group-hover:translate-x-1 group-hover:text-fg"
              />
            </div>
            <h3 className="mt-6 font-semibold text-fg">Про безпеку в банку</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Поради щодо запобігання шахрайству та захисту своїх карткових даних.
            </p>
            <div className="mt-5 text-xs font-medium text-brand-400">Правила безпеки</div>
          </button>

          <button
            className="group rounded-card border border-stroke bg-surface p-5 text-left transition hover:border-brand-500/40 hover:bg-surface-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                <PenTool size={21} />
              </div>
              <ArrowRight
                size={18}
                className="text-muted transition group-hover:translate-x-1 group-hover:text-fg"
              />
            </div>
            <h3 className="mt-6 font-semibold text-fg">Електронний підпис</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Ваш KEP/КЕП для підписання документів прямо зі смартфона.
            </p>
            <div className="mt-5 text-xs font-medium text-brand-400">Налаштувати підпис</div>
          </button>
        </div>
      </section>
    </Container>
  )
}