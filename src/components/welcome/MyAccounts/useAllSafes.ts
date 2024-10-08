import { useMemo } from 'react'
import uniq from 'lodash/uniq'
import isEmpty from 'lodash/isEmpty'
import { useAppSelector } from '@/store'
import { selectAllAddedSafes } from '@/store/addedSafesSlice'
import { useBobaEthOwnedSafes, useBobaBNBOwnedSafes } from './useAllOwnedSafes'
import useChains from '@/hooks/useChains'
import useWallet from '@/hooks/wallets/useWallet'
import { selectUndeployedSafes } from '@/store/slices'
import { sameAddress } from '@/utils/addresses'
import { type AllOwnedSafes } from '@safe-global/safe-gateway-typescript-sdk'

export type SafeItems = Array<{
  chainId: string
  address: string
  isWatchlist: boolean
  threshold?: number
  owners?: number
}>

const useAddedSafes = () => {
  const allAdded = useAppSelector(selectAllAddedSafes)
  return allAdded
}

export const useHasSafes = () => {
  const { address = '' } = useWallet() || {}
  const allAdded = useAddedSafes()
  const hasAdded = !isEmpty(allAdded)
  const [ethAllOwned = { safes: [] }] = useBobaEthOwnedSafes(!hasAdded ? address : '')
  const [bnbAllOwned = { safes: [] }] = useBobaBNBOwnedSafes(!hasAdded ? address : '')
  const allOwned: AllOwnedSafes = { '288': ethAllOwned?.['safes'], '56288': bnbAllOwned?.['safes'] }

  if (hasAdded) return { isLoaded: true, hasSafes: hasAdded }
  if (!allOwned) return { isLoaded: false }

  const hasOwned = !isEmpty(Object.values(allOwned).flat())
  return { isLoaded: true, hasSafes: hasOwned }
}

const useAllSafes = (): SafeItems => {
  const { address: walletAddress = '' } = useWallet() || {}
  const [ethAllOwned = { safes: [] }] = useBobaEthOwnedSafes(walletAddress)
  const [bnbAllOwned = { safes: [] }] = useBobaBNBOwnedSafes(walletAddress)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allOwned: AllOwnedSafes = { '288': ethAllOwned?.['safes'], '56288': bnbAllOwned?.['safes'] }
  const allAdded = useAddedSafes()
  const { configs } = useChains()
  const undeployedSafes = useAppSelector(selectUndeployedSafes)

  return useMemo<SafeItems>(() => {
    const chains = uniq(Object.keys(allAdded).concat(Object.keys(allOwned)))

    return chains.flatMap((chainId) => {
      if (!configs.some((item) => item.chainId === chainId)) return []
      const addedOnChain = Object.keys(allAdded[chainId] || {})
      const ownedOnChain = allOwned[chainId]
      const undeployedOnChain = Object.keys(undeployedSafes[chainId] || {})
      const uniqueAddresses = uniq(addedOnChain.concat(ownedOnChain)).filter(Boolean)

      return uniqueAddresses.map((address) => {
        const owners = allAdded?.[chainId]?.[address]?.owners
        const isOwner = owners?.some(({ value }) => sameAddress(walletAddress, value))
        const isUndeployed = undeployedOnChain.includes(address)
        const isOwned = (ownedOnChain || []).includes(address) || isOwner
        return {
          address,
          chainId,
          isWatchlist: !isOwned && !isUndeployed,
          threshold: allAdded[chainId]?.[address]?.threshold,
          owners: allAdded[chainId]?.[address]?.owners.length,
        }
      })
    })
  }, [allAdded, allOwned, configs, undeployedSafes, walletAddress])
}

export default useAllSafes
