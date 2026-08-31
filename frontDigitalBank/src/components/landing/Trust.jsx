import { Check, X } from 'lucide-react'
import Container from '../common/Container'

const rows = [
  ['Відкриття картки', '2 хвилини онлайн', 'Черга у відділенні'],
  ['Обслуговування', '0 ₴ на місяць', 'до 99 ₴ на місяць'],
  ['Перекази іншим банкам', 'Миттєво, 24/7', '1–3 робочих дні'],
  ['Скарбнички на цілі', 'Необмежена кількість', 'Зазвичай відсутні'],
]

// Демо-відгуки 
const testimonials = [
  {
    name: 'Петро Н.',
    role: 'Клієнт Premium',
    text: 'Переніс зарплатну картку сюди через тиждень після реєстрації. Скарбнички справді допомагають не спускати все на дрібниці.',
  },
  {
    name: 'Ірина К.',
    role: 'Клієнт',
    text: 'Найшвидша підтримка з усіх банків, якими я користувалась. Питання по переказу вирішили за три хвилини в чаті.',
  },
  {
    name: 'Максим О.',
    role: 'ФОП',
    text: 'Аналітика витрат чесно показала, скільки йде на підписки. Вимкнув три сервіси, якими не користувався.',
  },
]


export default function Trust() {
  return (
    <section id="trust" className="py-24 md:py-32 border-t border-white/5">
      <Container>
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl text-balance">
              Порівняно зі звичайним банком
            </h2>
            <p className="mt-4 text-muted max-w-sm">
              Ми прибрали все, що змушувало клієнтів ненавидіти класичні банки.
            </p>

            <div className="mt-8 divide-y divide-white/5 rounded-tile border border-white/10 bg-surface">
              <div className="grid grid-cols-[1.2fr_1fr_1fr] px-6 py-3 text-xs uppercase tracking-wide text-faint">
                <span></span>
                <span className="text-brand-400">Хрю Банк</span>
                <span>Класичний банк</span>
              </div>
              {rows.map(([label, us, them]) => (
                <div key={label} className="grid grid-cols-[1.2fr_1fr_1fr] items-center px-6 py-4 text-sm">
                  <span className="text-muted">{label}</span>
                  <span className="flex items-center gap-1.5 text-fg font-medium">
                    <Check size={15} className="text-mint shrink-0" /> {us}
                  </span>
                  <span className="flex items-center gap-1.5 text-faint">
                    <X size={15} className="shrink-0" /> {them}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="rounded-tile border border-white/10 bg-surface p-6"
              >
                <blockquote className="text-[15px] leading-relaxed text-fg/90">
                  «{t.text}»
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/15 font-display text-sm font-semibold text-brand-300">
                    {t.name[0]}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-fg">{t.name}</p>
                    <p className="text-faint">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
