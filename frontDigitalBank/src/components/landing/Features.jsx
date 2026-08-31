import { PiggyBank, BarChart3, ArrowLeftRight, ShieldCheck } from 'lucide-react'
import Container from '../common/Container'

export default function Features() {
  return (
    <section id="features" className="py-24 md:py-32">
      <Container>
        <div className="mb-14 max-w-xl">
          <h2 className="font-display text-3xl font-bold md:text-4xl text-balance">
            Все, що потрібно грошам, щоб не губитися
          </h2>
          <p className="mt-4 text-muted">
            Один застосунок замінює блокнот із цілями, три банківські вкладки й
            дзвінок в підтримку.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3 md:grid-rows-2">
          <div id="savings" className="relative overflow-hidden rounded-tile border border-white/10 bg-surface p-8 md:col-span-2 md:row-span-2">
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-brand-500/15 text-brand-400">
              <PiggyBank size={20} />
            </div>
            <h3 className="font-display text-xl font-semibold">Скарбнички на будь-яку ціль</h3>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Заведи окрему скарбничку на MacBook, подорож чи подушку безпеки.
              Округлюй покупки або став автопоповнення — і дивись, як росте прогрес.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { name: 'Audi Q5', current: '100 700', goal: '800 000', pct: 62, color: 'bg-brand-500' },
                { name: 'Навколосвітня подорож', current: '15 500', goal: '50 000', pct: 25, color: 'bg-blue' },
                { name: 'Фінансова подушка', current: '8 000', goal: '30 000', pct: 27, color: 'bg-violet' },
              ].map((jar) => (
                <div key={jar.name}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-fg">{jar.name}</span>
                    <span className="text-muted">
                      {jar.current} / {jar.goal} ₴
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface-3">
                    <div
                      className={`h-full rounded-full ${jar.color}`}
                      style={{ width: `${jar.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <FeatureTile
            icon={<ArrowLeftRight size={20} />}
            title="Перекази за секунди"
            text="За номером телефону чи IBAN — гроші доходять миттєво, 24/7, без вихідних."
          />
          <FeatureTile
            icon={<BarChart3 size={20} />}
            title="Аналітика витрат"
            text="Застосунок сам розкладає покупки по категоріях і показує, куди тікають гроші."
          />
          <FeatureTile
            icon={<ShieldCheck size={20} />}
            title="Захист під ліцензією НБУ"
            text="Кошти застраховані Фондом гарантування вкладів, а картку можна миттю заморозити."
            className="md:col-span-1"
          />
        </div>
      </Container>
    </section>
  )
}

function FeatureTile({ icon, title, text, className = '' }) {
  return (
    <div className={`rounded-tile border border-white/10 bg-surface p-7 ${className}`}>
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-surface-3 text-fg">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted">{text}</p>
    </div>
  )
}
