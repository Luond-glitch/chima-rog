import Icon from './Icon'

export const Loading = ({ label = 'Loading…' }) => (
  <div className="flex items-center justify-center gap-3 py-20 text-earth" role="status">
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-leaf border-t-transparent" />
    <span className="text-sm">{label}</span>
  </div>
)

export const ErrorBox = ({ message, onRetry }) => (
  <div className="mx-auto my-10 max-w-lg rounded-2xl border border-terracotta/30 bg-terracotta/5 p-6 text-center" role="alert">
    <Icon name="alert" className="mx-auto mb-2 h-6 w-6 text-terracotta" />
    <p className="text-sm text-earth-800">{message || 'Something went wrong.'}</p>
    {onRetry && <button onClick={onRetry} className="btn-outline mt-4">Try again</button>}
  </div>
)

export const Empty = ({ children }) => (
  <p className="rounded-2xl border border-dashed border-sand-400 bg-white/60 p-10 text-center text-sm text-earth">{children}</p>
)

/** Convenience: renders loading/error states, then children(data). */
export const Async = ({ q, children }) =>
  q.loading ? <Loading /> : q.error ? <ErrorBox message={q.error} onRetry={q.reload} /> : children(q.data)
