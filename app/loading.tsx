export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="sr-only">Nahuel Mosse</h1>
      <div className="space-y-4 text-center">
        <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </main>
  )
}
