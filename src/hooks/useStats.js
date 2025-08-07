import { useMemo } from 'react'
import { calculateStats } from '../utils/calculations'

export const useStats = (data) => {
  const stats = useMemo(() => {
    return calculateStats(data)
  }, [data])

  return stats
}