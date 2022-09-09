

export interface definitions {
    tokenProof: {
        tokenId: string
        isBlock: number
        proof: string[]
    },
    getProof: {
        results: definitions['tokenProof'][]
    },
    getTokens: {
        tokens?: definitions['tokenItem'][]
    },
    getToken: {
        token?: definitions['tokenItem']
    },
    tokenItem: {
        contract: string
        tokenId: string
        name: string
        imageOriginalUrl: string
        imagePreviewUrl: string
        imageUrl: string
        supportsWyvern: number
        scamSniffer: number
        updatedAt: string
    },
    getCollection: {
        collection?: definitions['collectionGetListItem']
    },
    collectionGetListItem: {
        name: string
        contract: string
        floorPrice: string
        slug: string
        thumb: string
        min: number
        max: number
        supply: number
        totalStolen: number
    },
    collectionGetList: {
        error?: string
        result?: definitions['collectionGetListItem'][]
    }
}