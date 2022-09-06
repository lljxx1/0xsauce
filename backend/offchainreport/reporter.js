const {privateKey, RPC, registryAddress} = require('./config.json');
const CollectionRegistryABI = require('./abi/CollectionRegistry');

const {ethers, Wallet} = require('ethers');
const provider = new ethers.providers.JsonRpcProvider(RPC);
const wallet = new Wallet(privateKey);
const account = wallet.connect(provider);

const Registry = new ethers.Contract(
  registryAddress,
  CollectionRegistryABI,
  account
);

async function batchReport(tokensWithPrice) {
  try {
    const tx = await Registry.batchUpdateAnswer(
      tokensWithPrice.map((_) => _.collection),
      tokensWithPrice.map((_) => _.tokenId),
      tokensWithPrice.map((_) => _.price)
    );
    await tx.wait();
  } catch (e) {
    console.log('batchReport failed', e);
  }
}

;(async () => {
  await batchReport([
    {
      collection: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
      tokenId: '838',
      price: 2000,
    },
    {
      collection: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
      tokenId: '821',
      price: 1000,
    },
    {
      collection: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
      tokenId: '869',
      price: 9000,
    },
  ]);
})();
