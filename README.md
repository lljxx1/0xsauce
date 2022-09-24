
<h1 align="center">
  <br>
  <a href="https://0xsauce.xyz/"><img src="https://0xsauce.xyz/0xsauce-desktop.svg" alt="0xSauce
  " width="200"></a>
  <br>
0xSauce
  <br>
</h1>

<h4 align="center">A guard to the future NFT financialization. 
Let's get saucy with your NFTs!! <a href="https://0xsauce.xyz/" target="_blank">->WebSite</a>.</h4>

<p align="center">
  <a href="https://badge.fury.io/js/electron-markdownify">
    <img src="https://badge.fury.io/js/electron-markdownify.svg"
         alt="Gitter">
  <a href="https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2F0xSauce_xyz">
      <img src="https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2F0xSauce_xyz">
  </a>
  <a href="https://etherscan.io/address/0xC438f0c5F01Cb9841a26660b31a61176996e3Df8">
    <img src="https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&amp;style=flat">
  </a>
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#integration">Integration</a> •
  <a href="#subgraph">Subgraph and Dune</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#license">License</a>
</p>

![Recording 2022-09-24 at 15 29 48](https://user-images.githubusercontent.com/33161265/192085980-45722d3c-396b-455b-b47c-2cb5cfc6f280.gif)

## Key Features
With the emergence of more and more decentralized NFT finalization protocols such as NFT AMM, NFT loan, or NFT fractionalization, there is a solid need to source the NFT before a user can trade or perform other financialization tasks. Otherwise, blacklisted NFT will flow into the permissionless decentralized protocols and cause unfair trading for the user. 
To address the issue above, 0xsauce will provides three services:
1. An on-chain NFT source oracle that saves blacklisted NFT item ID with its collection address.
2. A website( 0xsauce.xyz) that can allow users to check if a specific NFT item is tagged as suspicious.
3. A EPNS message notifier that updates the newest blacklisted NFT item information to address who enables the notification setting.

> **Note**
> To learn more about 0xSauce, [see this Medium Guide](https://medium.com/p/62cae2763f53)

## Integration

### Smart Contract
```solidity
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
```
### Retrieve Proof
#### From API
```javascript

async function fetchProof(collection, tokenId) {
    const req = await fetch(`https://api.0xsauce.xyz/api/getProof?collection=${collection}&tokenId=${tokenId}`);
    const res = await req.json();
    return res.results ? res.results[0] : null
};

const proof = await fetchProof('0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', 1);
console.log('proof', proof)

```
#### From IPFS
```javascript
const prooRegistry = new ethers.Contract(registryAddr, RegistryABI, provider);
const proof = await prooRegistry.getProof(collection);
console.log('ipfs proof', proof.url)
```
### Swap
```javascript
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
```
## Subgraph And Dune Analysis
[Subgraph] : https://thegraph.com/hosted-service/subgraph/lljxx1/0xsauce-dev

[stolen tokens] as caller in blacklist :  https://dune.com/queries/1252677

[stolen token] as receiver in blacklist : https://dune.com/queries/1252680


## Deployment
- Rinkeby: `0xBcD3e73d06E1F2B546cca0BA0686c466Ac396192`
- Polygon: `0xBcD3e73d06E1F2B546cca0BA0686c466Ac396192`
- Optimistic: `0xBcD3e73d06E1F2B546cca0BA0686c466Ac396192`
- Mainnet: `0x3a5B93f8A8Fd444705F091fAb90EE45f5eEA5963`


## Roadmap

#### Data Source
- [x] Opensea Snapshot
- [x] Onchain-monitor with phishing address (Provide by ScamSniffer, SlowMist)
- [x] EPNS Notification 
- [ ] Cross-validation on multiple data sources

#### Smart Contract
- [x] Proof Registry
- [x] Example: onchain-verify && swap

#### Backend
- [x] Proof Generate / Query
- [x] Offchain-report: upload IPFS / update proof registry

#### Oracle Status
- [x] subgraph index proof-change
- [x] dune-analysis 

#### Frontend
- [x] visualize collections
- [x] visualize oracle status
- [x] query onchain Proof
- [ ] swap example

## License
MIT
---

> [fun0.eth](https://www.amitmerchant.com) &nbsp;&middot;&nbsp;
> [tztztz.eth](https://www.amitmerchant.com) &nbsp;&middot;&nbsp;
> GitHub [@lljxx1](https://github.com/lljxx1) &nbsp;&middot;&nbsp;
> GitHub [@yrao3](https://github.com/yrao3) &nbsp;&middot;&nbsp;


<p align="right">(<a href="#readme-top">back to top</a>)</p>




