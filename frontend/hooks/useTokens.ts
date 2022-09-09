import { paths } from '@reservoir0x/reservoir-kit-client'
import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import fetcher from 'lib/fetcher'
import setParams from 'lib/params'
import { NextRouter } from 'next/router'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite'
import { definitions } from "lib/schema";

const PROXY_API_BASE = process.env.NEXT_PUBLIC_PROXY_API_BASE

type Tokens = definitions['getTokens']

export default function useTokens(
  collectionId: string | undefined,
  fallbackData: Tokens[],
  router: NextRouter,
  source?: boolean | undefined
) {
  const { ref, inView } = useInView()
  const reservoirClient = useReservoirClient()

  function getUrl() {
    if (!collectionId) return undefined

    const pathname = `${PROXY_API_BASE}/api/tokens`

    return pathname
  }

  const pathname = getUrl()

  const tokens = useSWRInfinite<Tokens>(
    (index, previousPageData) =>
      getKey(
        pathname,
        collectionId,
        source,
        router,
        reservoirClient?.source,
        index,
        previousPageData
      ),
    fetcher,
    {
      revalidateFirstPage: false,
      fallbackData,
    }
  )

  // Fetch more data when component is visible
  useEffect(() => {
    if (inView) {
      tokens.setSize(tokens.size + 1)
    }
  }, [inView])

  return { tokens, ref }
}

const getKey: (
  pathname: string | undefined,
  collectionId: string | undefined,
  source: boolean | undefined,
  router: NextRouter,
  sourceDomain: string | undefined,
  ...base: Parameters<SWRInfiniteKeyLoader>
) => ReturnType<SWRInfiniteKeyLoader> = (
  pathname: string | undefined,
  collectionId: string | undefined,
  source: boolean | undefined,
  router: NextRouter,
  sourceDomain: string | undefined,
  index: number,
  previousPageData: definitions['getTokens']
) => {
  // Reached the end
  if (
    previousPageData &&
    (previousPageData.tokens?.length === 0)
  )
    return null

  if (!pathname) return null

  let query:any  = {
    collection: collectionId,
  }

  const href = setParams(pathname, { ...query })
  return href
}
