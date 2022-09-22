import Layout from 'components/Layout'
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { paths } from '@reservoir0x/reservoir-kit-client'
import setParams from 'lib/params'
import Head from 'next/head'
import TrendingCollectionTable from 'components/TrendingCollectionTable'
import SortTrendingCollections from 'components/SortTrendingCollections'
import { useMediaQuery } from '@react-hookz/web'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { FC, ComponentProps } from 'react'
import { Contract, providers } from 'ethers'
import ProofRegistryABI from 'lib/abi/ProofRegistry.json'
import useOracleHistory from 'hooks/useOracleHistory'
// Environment variables
// For more information about these variables
// refer to the README.md file on this repository
// Reference: https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser
// REQUIRED
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
const RESERVOIR_API_BASE = process.env.NEXT_PUBLIC_RESERVOIR_API_BASE

// OPTIONAL
const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY
const REDIRECT_HOMEPAGE = process.env.NEXT_PUBLIC_REDIRECT_HOMEPAGE
const META_TITLE = process.env.NEXT_PUBLIC_META_TITLE
const META_DESCRIPTION = process.env.NEXT_PUBLIC_META_DESCRIPTION
const META_IMAGE = process.env.NEXT_PUBLIC_META_OG_IMAGE
const TAGLINE = process.env.NEXT_PUBLIC_TAGLINE
const COLLECTION = process.env.NEXT_PUBLIC_COLLECTION
const COMMUNITY = process.env.NEXT_PUBLIC_COMMUNITY
const COLLECTION_SET_ID = process.env.NEXT_PUBLIC_COLLECTION_SET_ID
const registryAddress = process.env.NEXT_PUBLIC_RPC_PROOF_REGISTRY || ''

const metadata = {
  title: (title: string) => <title>Notification</title>,
  description: (description: string) => (
    <meta name="description" content={description} />
  ),
  tagline: (tagline: string | undefined) => (
    <>{tagline || 'Discover, buy and sell NFTs'}</>
  ),
  image: (image?: string) => {
    if (image) {
      return (
        <>
          <meta name="twitter:image" content={image} />
          <meta name="og:image" content={image} />
        </>
      )
    }
    return null
  },
}

const LoadingIcon: FC = () => {
  return (
      <svg
        aria-hidden="true"
        className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
  )
}

const TokenQuery: FC = () => {
  const [contract, setContract] = useState<string>('')
  const [tokenId, setTokenId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string|null>(null)
  const [isBlocked, setBlocked] = useState<boolean | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [tokenProof, setTokenProof] = useState<any>(null)
  const history = useOracleHistory(contract)


  const checkToken = async () => {
    setLoading(true)
    setError(null)
    setTokenProof(null)
    try {
      const api = `${RESERVOIR_API_BASE}/api/getProof?collection=${contract}&tokenId=${tokenId}`
    const proofReq = await fetch(api)
    const proof = (await proofReq.json()).results[0]

    const registryAddress = process.env.NEXT_PUBLIC_RPC_PROOF_REGISTRY
    if (!registryAddress) return
    const provider = new providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL
    )
    console.log('registryAddress', registryAddress)
    const registry = new Contract(registryAddress, ProofRegistryABI, provider)
    console.log('checkToken', proof)
    setTokenProof(proof);
    const verifyResult = await registry.verify(
      contract,
      proof.tokenId,
      `${proof.isBlock}`,
      proof.proof
    )
    if (verifyResult) {
      setBlocked(true)
    } else {
      setBlocked(false)
    }

    const changes = history?.data.data.proofs
    setLastUpdate(new Date(changes[0].transactionTime * 1000).toISOString())
    console.log('verifyResult', verifyResult, changes[0])
    } catch(e: any) {
      setError(e.toString())
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sauce it
        </h2> */}
        {/* <p className="mt-2 text-center text-sm text-gray-600">
        Or
        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">start your 14-day free trial</a>
      </p> */}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-gray-100 py-8 px-4 shadow sm:rounded-lg sm:px-10">

        <div className="flex items-center space-x-5">
          <div className="flex-shrink-0">
            <div className="relative">
              <img className="h-32 w-32 rounded-full" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCMRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAICgAwAEAAAAAQAAAIAAAAAA/+0AOFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/AABEIAIAAgAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAgFBgcGBQgHBgcJCAgJDBMMDAsLDBgREg4THBgdHRsYGxofIywlHyEqIRobJjQnKi4vMTIxHiU2OjYwOiwwMTD/2wBDAQgJCQwKDBcMDBcwIBsgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDD/3QAEAAj/2gAMAwEAAhEDEQA/APdaKKK+XNwooooAKKKKACiiuc1Lx14e0+Vonv8Az5UO1ktY2mKn0O0ECmk3sVGEpu0VdnR0VzFh8QPDt5OsP2yS2diFX7VA8KknoNzDH6109DTW45wlB2mreoUUUUiAooooAKKKKAP/0PdaKKK+XNwooooAKKKKAOY+J5nHgq++zTNC5Mall/umRQw47EZB+teNh541CfZk2rwBHIAAPoQMV9B6jZw6hYT2d1GssM6FHRhkEEV80xXF5DGI3n3snyEyICSRwTn6itoQc1ZdD6HJ7yU4R336fqXrsXM1pPHtjhV42UsW3nBB7dK+g9CYtolgxJJNtGSSc5+UV88aWz3msadBdyeZBLeQRyRhQFdTIoII7gjgj0NfSaqqKFUBVAwABgAUVIOCszPOLxlCL8/6/AWiiisTwgooooAKKKKAP//R91ooor5c3CiiigAooooAK+ZdRAXULtR0FxMP/Ir19MsQoJPAHJr5inmFxcSzryssjyA+oZ2Yfoa6sP1PociX7yb8iXTJBDqdnKekdzC/5Soa+ma+W5s+S5U4YKSp9wMj9cV9N6Zcre6da3SEMs8SSAjuCAaeIWzKz6Npwl6/1+JZooorkPnAooooAKKKKAP/0vdaKKK+XNwooooAKKKyfFWuweHNFm1C4G8rhIogcGWQ8Ko/qewyaaV3ZDjFyajHdmL8T/E66FojWts//EwvlaOLHWJejSH6ZwPUke9eHABQFUYUAAD2q1qmo3erX8t9qM3nXMxy7DgD0VR2Udh/Uk1Vr0KcORWPucuwX1SnZ/E9/wDIAcHIr0v4W+N47WODQNWYRxAiOzuCeBnpE3p/snv0POM+aUEBgQwBBGCD0IqpRUlZm+LwkMVT5JfJ9j6horzn4T+MHvoxoeqTNJdRIWtpnOWljHVWPdl457jnqDXo1efOLg7M+Er0Z0Kjpz3QUUUVBiFFFFAH/9P3WiiivlzcKKKpa1qtpoumT6hfybIIRk4GSxJwFA7kkgAe9CV9BpNuyLteP/Gu9uZNYtLZ0dLG2jyshB2NM/UE9MhcYB/vHFQ6l48vvE+r2Nhg6ZYS3UUbxrJv83MqkByACAcbSFJHzc5Fel3EEVxeajBcxJLFIybkdQysCgHIP0rpjH2bvI76KqYLERlVhqtdT55PBwetFesat8MtJumL6bNNprH+BMSRZ/3W6fgRXHXngm5hkdLfVrG52EqW8qVVBHUFgGA/pW/tYLVux9RTzTDzXvOz9P8AI5iiuph+HuvzxLLAdMljb7rpeEqfx2Vbtvhhrch/0i70+3H+yXlP8lq+aPc1eY4ZK/P+ZyNneT6fdw3toxWe2cTRn/aXnH0IyD7E19JaXexalptrfW5BiuYlmQg9mGR/OvO9H+GOm2rpLq11LqJUhjFtEcRIOeVGSw9iSK7/AEJAmjWSqoUeQhAAwBxXNXlGS0Pm81xNLETi6a26l6iiiuU8YKKKKAP/1PdaKKK+XNwrzD436qBHp2kxv8zMbuUA9Avypn/gRJ/4DXoWtzX1vpNzLpNql3eohMMLvtDt6Z/z9RXmNh8PNf8AEGqvqPiq5FqJmDSbWDzP6KMfLGB25bH15rakknzNnfgPZwqKtVekenVvpYz/AIVeGJdW1qPU7iMrYafIHDH/AJazD7qj2XOT74HrXqkvGs3Q/vRRN/6GP6Ve0vT7XSrCGxsIVgt4F2oi9h/U+p71Ru/l1tv9u2X/AMdc/wDxVNz55MWIxUsVX9pL5ehT16WSOwCROUaeRId68FQx5x6HGayIxJFawzxNHHbmf7NHAE5Kglcg59icY6CtjXLeWe0VrdPMkgkWYR5wXAyCB74Jx71hxJ58v/EutpGuDn5pEdUhJ6s27gH1A5P615WMi5VFHkck1Zdk+/3GlN2V72LOl35tEYeSWjmnmdmB7Btp2jvjGT+mau6TdXF7dSymU/ZgPlTaB1OV9/u88/3qg1G1e0srO1tI5JRFuIYLuJfGAT6ZLE56U+yt7mz1RYwskiEbXlI4ZcZBJ/vA8fjW8faQnGG8VZfhb5r8myNGr9TVuX8u3lf+6jH8gavaYnl6dap/dhQf+OisK61G1vNP1FLSdJngjZH2HO1iCMZ7/h6V0iLsRVHYAV2TTSszlqO9rDqKKKyMgooooA//1fdaKKK+XNwooooAKydYZINQtJ5GCp5cqMxOAOFb/wBlNa1c58QbhbLw5JeywPPFbuplRCA3ltlGIzxwHz74rSn8SRUbuSSOIJnh1dbizuo3kkYzxXLOds6MSwy3PylQw24xkY44NM0rVbuG5nu0mInmhkdiXL5ZiMblPAIPQdhj1qC1tLjVdKknsQXiCNuud3yJtyT8pOVJOflx1P40ReYctKF2SrIsOBjpgDPqdwAz/tCvrHGlKL95PRLb1+7RXOR88XZprf8Ar9Df1jWrxdE0q6Ny0LEvJM0fy7/LI6+x5JFUptZ1u7W4uIGnNswkBCoBFGu0nGfvBgpU5z149hWl36zaadpUMbfLFKmez5+YsPbAA+rYq1o2pu+mPo0Ft5xviyIwfaY9y/NuHX5SP6HGOeZ0FTpu0E2t79E29fw0NFPmktdP10LnhZ/+JPcW62ywIfIUMXy8rFgrHHQKMADHHb1r0WvKfD1xZ2vie10xTHNqF3Kiyrbtvjt0jJkO9+7Ej7o+6D78+rV42P5fatxd0bcsoxjzK2gUUUVwiCiiigD/1vdaKKK+XNwooooAKo6/pqavol7p0hwt1A8WfQkcH86vUU07O407O6PmxH1Xw/qc0ayXGn38fyTBDgnHqDkMvoSCMdO9X18W6kLWK3a30uaKFzIgezxhick/Kw617fr3hzSdfiVNVso5ygwkn3XT/dYciuMv/hDYyMzWGrXcAPRZkSUD8eG/M12xrx66H0McwwldXxVP3u9v6ZxA8ba0kkktt/Z1pLL9+S3sgrN35JJrLvNY1O+dzdahcStLw+CI9/12AZ/Gu+i+Ds+/99rybf8AYs8H9XIra0v4U6HauHv5rrUSCDskcRx/iqAZ/HNN1YLW5v8AXcupK8IX+X+Zx/wb02a48Ui8jgP2SyhkVpAuEWRsAKO2cbiQOnfrXtdQ2lrb2VtHb2kMcEEY2pHGoVVHoAKmrkqT53c8HF4l4qq6jVgooorM5AooooA//9k=" alt="" />
              <span className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stolen NFT Monitor</h1>
            {/* <p className="text-sm font-medium text-gray-500">Applied for <a href="#" className="text-gray-900">Front End Developer</a> on <time datetime="2020-08-25">August 25, 2020</time></p> */}
            <a target="_blank" href="https://app.epns.io/#/channels?channel=0xEf0D8F546880d1D41e7F35c5BA06a43C7F42FF2f"><button type="button" className="mt-6 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
                        <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" x-description="Heroicon name: mini/envelope" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
  <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z"></path>
  <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z"></path>
</svg>
                        <span>Subscribe</span>
                      </button>
                      </a> 
          </div>
        </div>
        </div>



        <div className="mt-4 text-center">
            { error && (<div>error: {error}</div>)}
            {loading ? <div className="mx-auto" style={{width: "2em"}}>
              <LoadingIcon />
            </div> : isBlocked != null && (
               <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 mt-5">
                <div className="mt-2 text-center">
                  {isBlocked ? (
                    <span className="rounded-md bg-red-600 p-3 text-center text-sm text-white">
                      Blocked
                    </span>
                  ) : (
                    <span className="rounded-md bg-green-500 p-3 text-center text-sm text-white">
                      Not Block
                    </span>
                  )}
                  <div className="mt-6 text-sm">
                    Oracle last update in <span className="text-gray-600">{lastUpdate}</span>
                  </div>
                  {/* <p className="mt-2 text-sm">isBlock: {tokenProof.isBlock}</p> */}
                  <p className="mt-2 mb-2">proof:</p>
                  <pre className="text-gray-400 overflow-hidden text-sm">
                  {tokenProof.proof.join("\n")}
                  </pre>
                </div>
                </div>
              )
            }
          </div>        
      </div>
    </div>
  )
}

const Home: NextPage = () => {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 600px)')
  const router = useRouter()

  const title = META_TITLE && metadata.title(META_TITLE)
  const description = META_DESCRIPTION && metadata.description(META_DESCRIPTION)
  const image = metadata.image(META_IMAGE)
  const tagline = metadata.tagline(TAGLINE)

  useEffect(() => {
    if (REDIRECT_HOMEPAGE && COLLECTION) {
      router.push(`/collections/${COLLECTION}`)
    }
  }, [COLLECTION, REDIRECT_HOMEPAGE])

  // Return error page if the API base url or the environment's
  // chain ID are missing
  if (!CHAIN_ID) {
    console.debug({ CHAIN_ID })
    return <div>There was an error</div>
  }

  if (REDIRECT_HOMEPAGE && COLLECTION) return null

  return (
    <Layout navbar={{}}>
      <Head>
        {title}
        {description}
        {image}
      </Head>
      <div className="col-span-full px-6 md:px-16">
        <TokenQuery />
      </div>
    </Layout>
  )
}

export default Home
