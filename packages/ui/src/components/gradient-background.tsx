import { cn } from '@/lib/utils'

type GradientBackgroundProps = {
  children: React.ReactNode
  className?: string
}

export function GradientBackground({ children, className }: GradientBackgroundProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.75 0.1 250 / 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 80% 50%, oklch(0.7 0.08 300 / 0.1), transparent),
            radial-gradient(ellipse 50% 60% at 20% 80%, oklch(0.8 0.06 200 / 0.08), transparent)
          `,
        }}
      />
      {children}
    </div>
  )
}
