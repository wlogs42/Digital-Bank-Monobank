import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Container from '../common/Container'
import Button from '../common/Button'

export default function FinalCta() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-card border border-white/10 bg-gradient-to-br from-brand-600 to-brand-700 px-8 py-16 text-center md:px-16">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <h2 className="relative font-display text-3xl font-bold text-white md:text-4xl text-balance mx-auto max-w-xl">
            Заведи картку сьогодні, перший переказ — за хвилину
          </h2>
          <p className="relative mt-4 text-white/80 max-w-md mx-auto">
            Потрібен лише паспорт і смартфон. Без візиту у відділення, без
            паперів, без очікування.
          </p>
          <Button
            as={Link}
            to="/register"
            size="lg"
            className="relative mt-8 bg-white text-brand-600 hover:bg-white/90 shadow-none"
          >
            Стати клієнтом
            <ArrowRight size={18} />
          </Button>
        </div>
      </Container>
    </section>
  )
}
