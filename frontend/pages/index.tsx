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
import { Contract, providers } from 'ethers';
import ProofRegistryABI from 'lib/abi/ProofRegistry.json';

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

type Props = InferGetStaticPropsType<typeof getStaticProps>

const metadata = {
  title: (title: string) => <title>{title}</title>,
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

const TokenQuery: FC = () => {

    const [contract, setContract] = useState<string>('');
    const [tokenId, setTokenId] = useState<string>('');
    const [isBlocked, setBlocked] = useState<boolean|null>(null);

    const checkToken = async() => {
        const api = `${RESERVOIR_API_BASE}/api/getProof?collection=${contract}&tokenId=${tokenId}`
        const proofReq = await fetch(api)
        const proof = (await proofReq.json()).results[0];

        const registryAddress = process.env.NEXT_PUBLIC_RPC_PROOF_REGISTRY
        if (!registryAddress) return;
        const provider = new providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
        console.log('registryAddress', registryAddress)
        const registry = new Contract(registryAddress, ProofRegistryABI, provider)
        console.log('checkToken', proof)
        const verifyResult = await registry.verify(contract, proof.tokenId, `${proof.isBlock}`, proof.proof);
        if (verifyResult) {
            setBlocked(true)
        } else {
            setBlocked(false)
        }
        console.log('verifyResult', verifyResult)
    }

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      {/* <img className="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&amp;shade=600" alt="Your Company" /> */}
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Check Token</h2>
      {/* <p className="mt-2 text-center text-sm text-gray-600">
        Or
        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">start your 14-day free trial</a>
      </p> */}
    </div>

    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div className="space-y-6">
          <div>
            <label  className="block text-sm font-medium text-gray-700">Contract</label>
            <div className="mt-1">
              <input onChange={(event) => setContract(event.target.value)} name="contract" type="text" className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label  className="block text-sm font-medium text-gray-700">Token ID</label>
            <div 
            className="mt-1">
              <input onChange={(event) => setTokenId(event.target.value)} name="tokenId" type="text"  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>

          {/* <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <label className="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
            </div>
          </div> */}

          <div>
            <button onClick={() => checkToken()} className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Query
            </button>
          </div>
        </div>

        <div className="mt-6">
            {
               isBlocked === null ? null : isBlocked ? <div>block</div> : <div>not block</div>
            }
        </div>
      </div>
    </div>
  </div>
  )
}

const Home: NextPage<Props> = ({ fallback }) => {
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
