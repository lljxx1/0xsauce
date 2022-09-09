import { FC } from 'react'
import Link from 'next/link'
import { optimizeImage } from 'lib/optmizeImage'
import FormatEth from 'components/FormatEth'
import useCollections from 'hooks/useCollections'
import { paths } from '@reservoir0x/reservoir-kit-client'
import { formatNumber } from 'lib/numbers'
import { useRouter } from 'next/router'
import { PercentageChange } from './hero/HeroStats'
import { useMediaQuery } from '@react-hookz/web'
import { definitions } from "lib/schema";

type Props = {
  fallback: {
    collections: definitions['collectionGetList']
  }
}

type Volumes = '1DayVolume' | '7DayVolume' | '30DayVolume'

const TrendingCollectionTable: FC<Props> = ({ fallback }) => {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 600px)')
  const router = useRouter()
  const { collections, ref } = useCollections(router, fallback.collections)

  const { data } = collections

  const sort = router?.query['sort']?.toString()

  // Reference: https://swr.vercel.app/examples/infinite-loading
  const mappedCollections = data
    ? data.flatMap(({ result }) => result)
    : []

  const columns = isSmallDevice
    ? ['Collection', 'Floor Price']
    : ['Collection',  'Stolen', 'Floor Price']

  return (
    <div className="mb-11 overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            {columns.map((item) => (
              <th
                key={item}
                scope="col"
                className="reservoir-subtitle px-6 py-3 text-left dark:text-white"
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mappedCollections?.map((collection, index, arr) => {
            const {
              contract,
              tokenHref,
              image,
              name,
              totalStolen,
              floorPrice,
              supply,
            } = processCollection(collection)

            return (
              <tr
                key={`${contract}-${index}`}
                ref={index === arr.length - 5 ? ref : null}
                className="group h-[88px] border-b border-neutral-300 dark:border-neutral-600 dark:text-white"
              >
                {/* COLLECTION */}
                <td className="reservoir-body flex items-center gap-4 whitespace-nowrap px-6 py-4 dark:text-white">
                  <div className="reservoir-h6 mr-6 dark:text-white">
                    {index + 1}
                  </div>
                  <Link href={tokenHref}>
                    <a className="flex items-center gap-2">
                      <img
                        src={optimizeImage(image, 140)}
                        className="h-[56px] w-[56px] rounded-full object-cover"
                      />
                      <div
                        className={`reservoir-h6 overflow-hidden truncate whitespace-nowrap dark:text-white ${
                          isSmallDevice ? 'max-w-[140px]' : ''
                        }`}
                      >
                        {name}
                      </div>
                    </a>
                  </Link>
                </td>

                {/* VOLUME */}

                {/* FLOOR PRICE */}
               
                <td className="reservoir-body whitespace-nowrap px-6 py-4 dark:text-white">
                  {totalStolen ? formatNumber(+totalStolen) : '-'}
                </td>

                 {/* Stolen */}
                   {!isSmallDevice && (
                  <td className="reservoir-body whitespace-nowrap px-6 py-4 dark:text-white">
                  <FormatEth amount={floorPrice} />
                </td>
                )}

               

          

              
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default TrendingCollectionTable

function getFloorDelta(
  currentFloor: number | undefined,
  previousFloor: number | undefined
) {
  if (!currentFloor || !previousFloor) return 0

  return (currentFloor - previousFloor) / previousFloor
}

function processCollection(
  collection:
    | NonNullable<
        NonNullable<Props['fallback']['collections']>['result']
      >[0]
    | undefined
) {
  const data = {
    contract: collection?.contract,
    image: collection?.thumb,
    name: collection?.name,
    floorPrice: collection?.floorPrice ? parseFloat(collection?.floorPrice) : 0,
    supply: collection?.supply,
    totalStolen: collection?.totalStolen,
  }

  const tokenHref = `/collections/${data.contract}`

  return { ...data, tokenHref }
}
