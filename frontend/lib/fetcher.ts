/**
 * swr's fetcher function. [Reference](https://swr.vercel.app/docs/data-fetching#fetch)
 * @param href An url to be fetched
 * @returns The API's response
 */
export default async function fetcher(href: string) {
  const res = await fetch(href)
  return res.json()
}


// {
//   proofs(
//     first: 10 
//     orderBy: 
//     transactionTime 
//     orderDirection: desc 
//     where: { 
//       collection: "0xbce3781ae7ca1a5e050bd9c4c77369867ebc307e"
//     }
//   ) {
//     id
//     collection
//     merkleRoot
//     url
//     transactionTime
//     transactionHash
//     accrualBlockNumber
//   }
// }

export async function fetchSubgraph(query: any) {
  const res = await fetch('https://api.thegraph.com/subgraphs/name/lljxx1/0xsauce-dev', {
    "body": JSON.stringify({
      query,
      variables: null
    }),
    "method": "POST",
    "mode": "cors",
    "credentials": "omit"
  })
  return res.json()
}