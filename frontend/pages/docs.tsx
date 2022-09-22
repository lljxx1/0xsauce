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
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkSlug from 'remark-slug'
import remarkToc from 'remark-toc'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import Script from 'next/script'
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

  const rehypePlugins = [rehypeHighlight];
  const remarkPlugins = [remarkSlug, remarkToc];

  const markdonw = `# Integration Doc
## Smart Contract
\`\`\`javascript
pragma solidity ^0.8.0;

pragma experimental ABIEncoderV2;

interface IProofRegistry {
    function verify(address collection, uint256 tokenId, uint256 isBlock, bytes32[] calldata merkleProof) external view returns (bool);
}

contract SwapGuard {

    struct SwapItem {
        address collection;
        uint256 tokenId;
        uint256 isBlock;
        bytes32[] merkleProof;
    }

    IProofRegistry public proofRegistry;

    constructor(address proofRegistry_) public {
        proofRegistry = IProofRegistry(proofRegistry_);
    }

    function swap(SwapItem[] memory items) public {
        uint256 numSwaps = items.length;
        for (uint256 i; i < numSwaps; ) {
            bool isBlockd = proofRegistry.verify(
                items[i].collection,
                items[i].tokenId,
                items[i].isBlock,
                items[i].merkleProof
            );
            require(!isBlockd, "token blocked");
            // keep swap
        }
    }
}
\`\`\`

## Retrieve Proof

### From API
\`\`\`js

async function fetchProof(collection, tokenId) {
    const req = await fetch(\`https://api.0xsauce.xyz/api/getProof?collection=\${collection}&tokenId=\${tokenId}\`);
    const res = await req.json();
    return res.results ? res.results[0] : null
};

const proof = await fetchProof('0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', 1);
console.log('proof', proof)

\`\`\`

### From IPFS
\`\`\`js
const prooRegistry = new ethers.Contract(registryAddr, RegistryABI, provider);
const proof = await prooRegistry.getProof(collection);
console.log('ipfs proof', proof.url)
\`\`\`

## Swap

\`\`\` js
const swapWithGuard = new ethers.Contract(SwapGuardAddr, SwapGuardABI, provider);

const tokenId = 1;
const collection = = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d";

// retrieve proof
const proof = await fetchProof(collection, tokenId);

// take with proof
await swapWithGuard.swap(
    [
        {
            collection,
            tokenId,
            proof.isBlock,
            proof.merkleProof
        }
    ]
)

\`\`\`


`

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto max-w-3xl">
            <ReactMarkdown className="markdown-body"
                remarkPlugins={remarkPlugins}
                rehypePlugins={rehypePlugins}>
                    {markdonw}
            </ReactMarkdown>
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
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/styles/github.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css" />
      </Head>
      <div className="col-span-full px-6 md:px-16">
        <TokenQuery />
      </div>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.25.2/mode/markdown/markdown.min.js"
          strategy="beforeInteractive" ></Script>
    </Layout>
  )
}

export default Home
