import { FC, useState } from 'react'
import LoadingCard from './LoadingCard'
import { SWRInfiniteResponse } from 'swr/infinite/dist/infinite'
import Link from 'next/link'
import { optimizeImage } from 'lib/optmizeImage'
import { useInView } from 'react-intersection-observer'
import FormatEth from './FormatEth'
import Masonry from 'react-masonry-css'
import { paths } from '@reservoir0x/reservoir-kit-client'
import Image from 'next/image'
import { FaShoppingCart } from 'react-icons/fa'
import { atom, useRecoilState, useRecoilValue } from 'recoil'
import { recoilTokensMap } from './CartMenu'
import { useAccount, useNetwork, useSigner } from 'wagmi'
import BuyNow from 'components/BuyNow'
import { useReservoirClient } from '@reservoir0x/reservoir-kit-ui'
import { definitions } from "lib/schema";
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
const SOURCE_ICON = process.env.NEXT_PUBLIC_SOURCE_ICON
const API_BASE =
  process.env.NEXT_PUBLIC_RESERVOIR_API_BASE || 'https://api.reservoir.tools'

type Props = {
  tokens: SWRInfiniteResponse<
    definitions['getTokens'],
    any
  >
  collectionImage: string | undefined
  viewRef: ReturnType<typeof useInView>['ref']
}

type Tokens = NonNullable<
definitions['getTokens']['tokens']
>

export const recoilCartTokens = atom<Tokens>({
  key: 'cartTokens',
  default: [],
})

const TokensGrid: FC<Props> = ({ tokens, viewRef, collectionImage }) => {
  const [cartTokens, setCartTokens] = useRecoilState(recoilCartTokens)
  const tokensMap = useRecoilValue(recoilTokensMap)
  const { data: signer } = useSigner()
  const { chain: activeChain } = useNetwork()
  const { data, error, mutate } = tokens
  const account = useAccount()
  const reservoirClient = useReservoirClient()

  // Reference: https://swr.vercel.app/examples/infinite-loading
  const mappedTokens = data ? data.flatMap(({ tokens }) => tokens) : []
  const isLoadingInitialData = !data && !error
  const didReachEnd =
    data &&
    (data[data.length - 1]?.tokens?.length === 0)

  if (!CHAIN_ID) return null

  const isInTheWrongNetwork = Boolean(signer && activeChain?.id !== +CHAIN_ID)

  return (
    <Masonry
      key="tokensGridMasonry"
      breakpointCols={{
        default: 6,
        1900: 5,
        1536: 4,
        1280: 3,
        1024: 2,
        768: 2,
        640: 2,
        500: 1,
      }}
      className="masonry-grid"
      columnClassName="masonry-grid_column"
    >
      {isLoadingInitialData
        ? Array(10)
            .fill(null)
            .map((_, index) => <LoadingCard key={`loading-card-${index}`} />)
        : mappedTokens?.map((token, idx) => {
            const isInCart = Boolean(
              tokensMap[`${token?.contract}:${token?.tokenId}`]
            )
            if (!token) return null
            return (
              <div
                key={`${token.contract}${token.tokenId}`}
                className="group relative mb-6 grid transform-gpu self-start overflow-hidden rounded-[16px] border border-[#D4D4D4] bg-white transition ease-in hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-lg hover:ease-out dark:border-0 dark:bg-neutral-800 dark:ring-1 dark:ring-neutral-600"
              >
                {isInCart ? (
                  <div className="absolute top-4 right-4 z-10 flex h-[34px] w-[34px] animate-slide-down items-center justify-center overflow-hidden rounded-full bg-primary-700">
                    <FaShoppingCart className="h-[18px] w-[18px] text-white" />
                  </div>
                ) : null}

                <Link
                  key={`${token?.contract}${idx}`}
                  href={`/${token?.contract}/${token?.tokenId}`}
                >
                  <a className="mb-[85px]">
                    {token?.imagePreviewUrl ? (
                      <Image
                        loader={({ src }) => src}
                        src={optimizeImage(token?.imagePreviewUrl, 250)}
                        alt={`${token?.name}`}
                        className="w-full"
                        width={250}
                        height={250}
                        objectFit="cover"
                        layout="responsive"
                      />
                    ) : (
                      <div className="relative w-full">
                        <div className="absolute inset-0 grid place-items-center backdrop-blur-lg">
                          <div>
                            <img
                              src={optimizeImage(collectionImage, 250)}
                              alt={`${token?.name}`}
                              className="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full border-2 border-white"
                              width="64"
                              height="64"
                            />
                            <div className="reservoir-h6 text-white">
                              No Content Available
                            </div>
                          </div>
                        </div>
                        <img
                          src={optimizeImage(collectionImage, 250)}
                          alt={`${token?.name}`}
                          className="aspect-square w-full object-cover"
                          width="250"
                          height="250"
                        />
                      </div>
                    )}
                  </a>
                </Link>
                <div
                  className={`absolute bottom-[0px] w-full bg-white transition-all group-hover:bottom-[0px] dark:bg-neutral-800`}
                >
                  <div
                    className="reservoir-subtitle mb-3 overflow-hidden truncate px-4 pt-4 dark:text-white lg:pt-3"
                    title={token?.name || token?.tokenId}
                  >
                    {token?.name || `#${token?.tokenId}`}
                  </div>
                  <div className="flex items-center justify-between px-4 pb-4 lg:pb-3">
                    <div className="reservoir-h6">
                      {/* <FormatEth amount={token?.floorAskPrice} logoWidth={7} /> */}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
      {!didReachEnd &&
        Array(10)
          .fill(null)
          .map((_, index) => {
            if (index === 0) {
              return (
                <LoadingCard viewRef={viewRef} key={`loading-card-${index}`} />
              )
            }
            return <LoadingCard key={`loading-card-${index}`} />
          })}
    </Masonry>
  )
}

export default TokensGrid
