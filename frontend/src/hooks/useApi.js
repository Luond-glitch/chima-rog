import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'

/** Fetch a public API path. Returns { data, loading, error, reload }. */
export function useApi(path) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const load = useCallback(() => {
    let alive = true
    setState((s) => ({ ...s, loading: true, error: null }))
    api.get(path)
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((e) => alive && setState({ data: null, loading: false, error: e.message }))
    return () => { alive = false }
  }, [path])
  useEffect(() => load(), [load])
  return { ...state, reload: load }
}
