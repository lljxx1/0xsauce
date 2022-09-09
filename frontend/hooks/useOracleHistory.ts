
import { paths } from '@reservoir0x/reservoir-kit-client'
import { fetchSubgraph } from 'lib/fetcher'
import setParams from 'lib/params'
import useSWR from 'swr'
import { definitions } from "lib/schema";

const PROXY_API_BASE = process.env.NEXT_PUBLIC_PROXY_API_BASE

export default function useOracleHistory(
  collection: string
) {
  const details = useSWR<any>(`{
    proofs(
      first: 10 
      orderBy: 
      transactionTime 
      orderDirection: desc 
      where: { 
        collection: "${collection}"
      }
    ) {
      id
      collection
      merkleRoot
      url
      transactionTime
      transactionHash
      accrualBlockNumber
    }
  }`,  fetchSubgraph)

  return details
}


