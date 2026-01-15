'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  
  useEffect(() => {
    // Log the error to an error reporting service
    // In production, replace with proper error tracking (e.g., Sentry)
    if (process.env.NODE_ENV === 'development') {
      console.error('Application error:', error)
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Something went wrong</h1>
          <p className="text-lg text-muted-foreground">
            An unexpected error occurred. Please try refreshing the page.
          </p>
        </div>
        
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="p-4 bg-muted/30 rounded-lg text-left">
            <p className="text-sm font-mono text-destructive">{error.message}</p>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Button
            onClick={reset}
            className="bg-secondary hover:bg-secondary/90"
            aria-label="Try again to reload the page"
          >
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            aria-label="Go to home page"
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  )
}
