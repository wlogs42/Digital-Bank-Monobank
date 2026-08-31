import clsx from 'clsx'

const variants = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 shadow-[0_8px_24px_-8px_rgba(255,62,130,0.6)]',
  ghost:
    'bg-surface-2 text-fg hover:bg-surface-3 border border-stroke',
  outline:
    'bg-transparent text-fg border border-white/20 hover:border-white/40',
  link: 'bg-transparent text-brand-300 hover:text-brand-100 px-0',
}

const sizes = {
  sm: 'text-sm px-4 py-2',
  md: 'text-[15px] px-5 py-3',
  lg: 'text-base px-7 py-4',
}

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <Tag
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
