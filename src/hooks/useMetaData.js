import { useState, useCallback, useEffect } from 'react'
import { fetchAllData } from '../services/metaApi.js'

const STORAGE_KEY = 'hmrio_meta_credentials'

const EMPTY_DATA = {
  campaigns: [],
  adsets: [],
  ads: [],
  daily: [],
  period: 'last_30d',
  syncedAt: null,
}

/**
 * Hook principal de gerenciamento de dados Meta Ads.
 * - Persiste credenciais no localStorage
 * - Auto-refresh a cada 5 minutos
 * - Permite mudança de período
 */
export function useMetaData() {
  const [credentials, setCredentials] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [data, setData] = useState(EMPTY_DATA)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [period, setPeriod] = useState('last_30d')

  const isConnected = !!credentials

  const load = useCallback(
    async (creds, periodKey) => {
      setLoading(true)
      setError(null)
      try {
        const result = await fetchAllData(creds.token, creds.accountId, periodKey || period)
        setData(result)
        return true
      } catch (err) {
        setError(err.message || 'Erro ao buscar dados da Meta Ads.')
        return false
      } finally {
        setLoading(false)
      }
    },
    [period],
  )

  const connect = useCallback(
    async (token, accountId) => {
      const creds = { token, accountId }
      const success = await load(creds, period)
      if (success) {
        setCredentials(creds)
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(creds))
        } catch {}
      }
      return success
    },
    [load, period],
  )

  const disconnect = useCallback(() => {
    setCredentials(null)
    setData(EMPTY_DATA)
    setError(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }, [])

  const refresh = useCallback(() => {
    if (credentials) load(credentials, period)
  }, [credentials, load, period])

  const changePeriod = useCallback(
    (newPeriod) => {
      setPeriod(newPeriod)
      if (credentials) load(credentials, newPeriod)
    },
    [credentials, load],
  )

  // Auto-load se já tem credenciais salvas
  useEffect(() => {
    if (credentials && data.syncedAt === null && !loading) {
      load(credentials, period)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-refresh a cada 5 minutos
  useEffect(() => {
    if (!credentials) return
    const interval = setInterval(() => {
      load(credentials, period)
    }, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [credentials, period, load])

  return {
    data,
    loading,
    error,
    period,
    credentials,
    isConnected,
    connect,
    disconnect,
    refresh,
    changePeriod,
  }
}
