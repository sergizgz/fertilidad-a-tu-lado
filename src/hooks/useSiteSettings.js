import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Cache en memoria para no hacer múltiples fetches en el mismo render
let cache = null

export function useSiteSettings() {
  const [settings, setSettings] = useState(cache ?? {})
  const [loading, setLoading] = useState(!cache)

  useEffect(() => {
    if (cache) return
    supabase
      .from('site_settings')
      .select('key, value')
      .then(({ data }) => {
        if (data) {
          cache = Object.fromEntries(data.map(r => [r.key, r.value]))
          setSettings(cache)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const refresh = () => {
    cache = null
    setLoading(true)
    supabase
      .from('site_settings')
      .select('key, value')
      .then(({ data }) => {
        if (data) {
          cache = Object.fromEntries(data.map(r => [r.key, r.value]))
          setSettings(cache)
        }
      })
      .finally(() => setLoading(false))
  }

  return { settings, loading, refresh }
}
