import { paths } from '@reservoir0x/reservoir-kit-client'
import fetcher from 'lib/fetcher'
import setParams from 'lib/params'
import useSWR from 'swr'
import { definitions } from "lib/schema";

const PROXY_API_BASE = process.env.NEXT_PUBLIC_PROXY_API_BASE

export default function useTokenProof(
  query: any
) {
  const pathname = `${PROXY_API_BASE}/api/getProof`

  const href = setParams(pathname, query)

  const details = useSWR<
    definitions['getProof']
  >(href, fetcher)

  return details
}
