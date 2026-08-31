import { forwardRef } from 'react'
import clsx from 'clsx'

const TextField = forwardRef(function TextField(
  { label, error, hint, className = '', ...props },
  ref
) {
  return (
    <label className={clsx('block', className)}>
      {label && (
        <span className="mb-2 block text-sm font-medium text-muted">{label}</span>
      )}
      <input
        ref={ref}
        className={clsx(
          'w-full rounded-2xl bg-surface-2 border px-4 py-3.5 text-fg placeholder:text-faint outline-none transition-colors',
          'focus:border-brand-500 focus:bg-surface-3',
          error ? 'border-red-500/70' : 'border-stroke'
        )}
        {...props}
      />
      {error && <span className="mt-1.5 block text-xs text-red-400">{error}</span>}
      {!error && hint && <span className="mt-1.5 block text-xs text-faint">{hint}</span>}
    </label>
  )
})

export default TextField
