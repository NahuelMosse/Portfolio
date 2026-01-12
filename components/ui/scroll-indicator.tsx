export function ScrollIndicator() {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground group cursor-default">
      <span className="transition-colors duration-300 group-hover:text-foreground/60">Continue scrolling</span>
      <svg 
        className="w-4 h-4 transition-transform duration-700 ease-in-out" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        style={{
          animation: "bounce 2s cubic-bezier(0.16, 1, 0.3, 1) infinite",
        }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
}
