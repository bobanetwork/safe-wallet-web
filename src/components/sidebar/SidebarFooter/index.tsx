import type { ReactElement } from 'react'
import { useCallback, useEffect } from 'react'

import { SidebarList } from '@/components/sidebar/SidebarList'
import { loadBeamer } from '@/services/beamer'
import { useAppDispatch, useAppSelector } from '@/store'
import { selectCookies, CookieAndTermType } from '@/store/cookiesAndTermsSlice'
import { openCookieBanner } from '@/store/popupSlice'
import { ListItem } from '@mui/material'
import DebugToggle from '../DebugToggle'
import { IS_PRODUCTION } from '@/config/constants'
import { useCurrentChain } from '@/hooks/useChains'

const SidebarFooter = (): ReactElement => {
  const dispatch = useAppDispatch()
  const cookies = useAppSelector(selectCookies)
  const chain = useCurrentChain()

  const hasBeamerConsent = useCallback(() => cookies[CookieAndTermType.UPDATES], [cookies])

  useEffect(() => {
    // Initialise Beamer when consent was previously given
    if (hasBeamerConsent() && chain?.shortName) {
      loadBeamer(chain.shortName)
    }
  }, [hasBeamerConsent, chain?.shortName])

  const handleBeamer = () => {
    if (!hasBeamerConsent()) {
      dispatch(openCookieBanner({ warningKey: CookieAndTermType.UPDATES }))
    }
  }

  return (
    <SidebarList>
      {!IS_PRODUCTION && (
        <ListItem disablePadding>
          <DebugToggle />
        </ListItem>
      )}
    </SidebarList>
  )
}

export default SidebarFooter
