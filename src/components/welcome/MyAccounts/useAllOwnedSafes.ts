import { getOwnedSafes, getAllOwnedSafes } from '@safe-global/safe-gateway-typescript-sdk'
import useAsync from '@/hooks/useAsync'

export const useBobaEthwnedSafes = (address: string) => {
  return useAsync(() => {
    if (!address) return
    return getOwnedSafes('288', address)
  }, [address])
}

export const useBobaBNBwnedSafes = (address: string) => {
  return useAsync(() => {
    if (!address) return
    return getOwnedSafes('56288', address)
  }, [address])
}

export const useAllOwnedSafes = (address: string) => {
  return useAsync(() => {
    if (!address) return
    return getAllOwnedSafes(address)
  }, [address])
}
