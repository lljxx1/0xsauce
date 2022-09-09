import { paths } from '@reservoir0x/reservoir-kit-client'
import fetcher from 'lib/fetcher'
import setParams from 'lib/params'
import useSWR from 'swr'
import { definitions } from "lib/schema";

const PROXY_API_BASE = process.env.NEXT_PUBLIC_PROXY_API_BASE

type Collection = definitions['getCollection']

export default function useCollection(
  fallbackData: Collection | undefined,
  collectionId?: string | undefined
) {
  function getUrl() {
    if (!collectionId) return undefined
    const pathname = `${PROXY_API_BASE}/api/collection`
    const href = setParams(pathname, {
      id: collectionId
    })

    return href
  }

  const href = getUrl()

  const collection = useSWR<Collection>(href, fetcher, {
    fallbackData,
  })

  return collection
}
