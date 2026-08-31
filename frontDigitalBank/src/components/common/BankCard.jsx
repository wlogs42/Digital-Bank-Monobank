import clsx from 'clsx'

/*
Visual bank-card tile — used in landing hero mockup, registration success screen,
 and dashboard card carousel.
 */
export default function BankCard({
  holder = 'Хрю Банк',
  last4 = '4441',
  balance,
  scheme = 'visa',
  variant = 'primary',
  className = '',
  tilt = false,
}) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-card p-6 w-full aspect-[1.586/1] shadow-2xl',
        variant === 'primary' &&
          'bg-gradient-to-br from-[#2a2a35] to-[#101014] border border-white/10',
        variant === 'salary' && 'bg-gradient-to-br from-brand-600 to-brand-500',
        tilt && 'rotate-3',
        className
      )}
    >
      <div className="absolute -right-6 -bottom-8 opacity-[0.14]">
        <svg width="180" height="180" viewBox="0 0 64 64" fill="none">
          <ellipse cx="32" cy="37" rx="24" ry="17" fill="white" />
          <ellipse cx="32" cy="28" rx="9" ry="6" fill="white" />
        </svg>
      </div>
      <div className="relative flex h-full flex-col justify-between">
        <span className="font-display font-semibold text-white/90">{holder}</span>
        <div>
          <p className="text-white/60 text-sm mb-1 tracking-wider">•••• {last4}</p>
          {balance && (
            <p className="text-2xl font-display font-bold text-white">{balance}</p>
          )}
        </div>
        <div className="flex justify-end">
          <span className="font-display italic font-bold text-xl text-white">
            {scheme === 'visa' ? 'VISA' : 'Mastercard'}
          </span>
        </div>
      </div>
    </div>
  )
}
