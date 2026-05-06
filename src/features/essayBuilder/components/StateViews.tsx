interface ErrorViewProps {
  message?: string
  onRetry?: () => void
}

export function LoadingView({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="text-center py-16 text-sm text-gray-400" role="status">
      {label}
    </div>
  )
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-800">
      <p className="font-medium mb-1">Something went wrong.</p>
      {message && <p className="text-rose-700 mb-3 break-words">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-3 py-1.5 rounded-md bg-rose-600 text-white
                     text-xs font-medium hover:bg-rose-700 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  )
}

export function EmptyView({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center py-16 text-sm text-gray-400">
      {children}
    </div>
  )
}
