/* interest user */

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import Button from '../common/Button'
import BankCard from '../common/BankCard'
import Container from '../common/Container'

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-40 pb-28 md:pt-48 md:pb-36">
      {/* ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand-600/20 blur-[140px]" />

      <Container className="grid items-center gap-16 md:grid-cols-2">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface-2 px-4 py-1.5 text-sm text-muted">
            <Zap size={14} className="text-brand-400" />
            Картка приходить за 2 хвилини
          </div>

          <h1 className="font-display text-[2.75rem] font-extrabold leading-[1.05] text-balance md:text-6xl">
            Банк, який
            <br />
            росте разом з тобою
          </h1>

          <p className="mt-6 max-w-md text-lg text-muted">
            Хрю Банк — це картка, скарбнички на цілі й аналітика витрат в одному
            застосунку. Без черг у відділенні й без прихованих комісій.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button as={Link} to="/register" size="lg">
              Відкрити картку безкоштовно
              <ArrowRight size={18} />
            </Button>
            <a href="#features" className="text-sm font-medium text-muted hover:text-fg">
              Подивитись, як це працює
            </a>
          </div>

          <div className="mt-12 flex gap-10">
            <div>
              <p className="font-display text-2xl font-bold">180 000+</p>
              <p className="text-sm text-muted">карток на руках</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold">0 ₴</p>
              <p className="text-sm text-muted">за обслуговування</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold">4.8/5</p>
              <p className="text-sm text-muted">оцінка в App Store</p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative mx-auto w-full max-w-sm"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <BankCard balance="24 582.40 ₴" last4="4441" tilt />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute -left-10 bottom-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-surface-2/95 px-4 py-3 shadow-xl backdrop-blur"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mint/15 text-mint">
              ↑
            </div>
            <div>
              <p className="text-xs text-muted">Зарплата</p>
              <p className="text-sm font-semibold text-mint">+15 000.00 ₴</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="absolute -right-6 -top-6 rounded-2xl border border-white/10 bg-surface-2/95 px-4 py-3 shadow-xl backdrop-blur"
          >
            <p className="text-xs text-muted">Скарбничка «MacBook Pro»</p>
            <div className="mt-1.5 h-1.5 w-32 rounded-full bg-surface-3">
              <div className="h-full w-[62%] rounded-full bg-brand-500" />
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
