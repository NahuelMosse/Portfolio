/**
 * Tech-inspired decorative elements that blend with nature aesthetic
 * Subtle visual elements that connect software engineering with organic design
 */

interface TechDecoratorProps {
  variant?: 'brackets' | 'function' | 'binary' | 'lambda' | 'arrow' | 'git' | 'terminal'
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function TechDecorator({ variant = 'brackets', className = '', size = 'md' }: TechDecoratorProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  const symbols = {
    brackets: '</>',
    function: 'ƒ',
    binary: '01',
    lambda: 'λ',
    arrow: '→',
    git: '⎇',
    terminal: '$',
  }

  return (
    <span 
      className={`font-mono text-accent/70 select-none ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
      style={{ textShadow: '0 0 10px oklch(0.72 0.06 75 / 0.3)' }}
    >
      {symbols[variant]}
    </span>
  )
}

interface CodeLineDecoratorProps {
  className?: string
}

export function CodeLineDecorator({ className = '' }: CodeLineDecoratorProps) {
  return (
    <div className={`flex items-center gap-1 text-accent/50 font-mono text-xs ${className}`} aria-hidden="true">
      <span className="w-1 h-1 rounded-full bg-current" />
      <span className="w-8 h-px bg-current" />
      <span className="w-1 h-1 rounded-full bg-current" />
      <span className="w-12 h-px bg-current" />
    </div>
  )
}

interface TechPatternProps {
  pattern?: 'grid' | 'dots' | 'circuit'
  className?: string
}

export function TechPattern({ pattern = 'grid', className = '' }: TechPatternProps) {
  if (pattern === 'circuit') {
    return (
      <svg 
        className={`absolute opacity-[0.03] ${className}`}
        width="200" 
        height="200"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="circuit" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1.5" fill="currentColor" className="text-accent" />
            <path d="M20,0 L20,10 M20,30 L20,40 M0,20 L10,20 M30,20 L40,20" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
          </pattern>
        </defs>
        <rect width="200" height="200" fill="url(#circuit)" />
      </svg>
    )
  }

  return null
}

/**
 * Blinking cursor effect - like a terminal
 */
export function BlinkingCursor({ className = '' }: { className?: string }) {
  return (
    <span 
      className={`inline-block w-2 h-5 bg-accent/60 ml-1 ${className}`}
      style={{
        animation: 'blink 1.2s step-end infinite',
      }}
      aria-hidden="true"
    />
  )
}
