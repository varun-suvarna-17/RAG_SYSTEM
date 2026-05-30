import { forwardRef } from 'react'

const GlassCard = forwardRef(function GlassCard({ children, className = '', onClick, padding = true }, ref) {
  const interactive = onClick ? 'cursor-pointer glow-border' : ''
  return (
    <div
      ref={ref}
      className={`glass-card transition-all duration-300 ${padding ? 'p-6' : ''} ${interactive} ${className}`}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
})

export default GlassCard
