import { getOwnedSafes, getAllOwnedSafes } from '@safe-global/safe-gateway-typescript-sdk'
import useAsync from '@/hooks/useAsync'
import axios from 'axios'
export const useBobaEthOwnedSafes = (address: string) => {
  return useAsync(() => {
    if (!address) return
    return getOwnedSafes('288', address)
  }, [address])
}

export const useBobaBNBOwnedSafes = (address: string) => {
  return useAsync(() => {
    if (!address) return
    return getBobaBNBOwnedSafes(address)
  }, [address])
}

export const useAllOwnedSafes = (address: string) => {
  return useAsync(() => {
    if (!address) return
    return getAllOwnedSafes(address)
  }, [address])
}

const getBobaBNBOwnedSafes = async (address: string) => {
  axios.defaults.baseURL = 'https://safe-transaction.bnb.boba.network'
  // use axios to get the data
  const response = await axios.get(`/api/v1/owners/${address}/safes`)
  if (response.status !== 200) {
    return { safes: [] }
  }
  return response.data
}
