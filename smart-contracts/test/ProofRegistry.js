const {expect} = require('chai');
const MerkleTree = require('../proof/0xed5af388653567af2f388e6224dc7c4b3241c544.json');

describe('ProofRegistry', function () {
  let registry;
  beforeEach(async () => {
    ProofRegistry = await ethers.getContractFactory('ProofRegistry');
    registry = await ProofRegistry.deploy();
  });


  it('setProof', async () => {
    const res = await registry.setProof({
      collection: MerkleTree.collection,
      root: MerkleTree.root, 
      url: 'ipfs://xxxx'
    });
    const proof = await registry.getProof(MerkleTree.collection)
    expect(proof.collection.toLowerCase()).to.equal(MerkleTree.collection);
  });

  it('batchUpdate(setProof)', async () => {
    await registry.batchUpdate([
      {
        collection: MerkleTree.collection,
        root: MerkleTree.root, 
        url: 'ipfs://xxxx'
      }
    ]);
    const proof = await registry.getProof(MerkleTree.collection)
    expect(proof.collection.toLowerCase()).to.equal(MerkleTree.collection);
  });


  it('verify', async () => {
    await registry.setProof({
      collection: MerkleTree.collection,
      root: MerkleTree.root, 
      url: 'ipfs://xxxx'
    });
    const block = MerkleTree.tokens.find(_ => _.isBlock === 1);
    const blockResult = await registry.verify(MerkleTree.collection, block.tokenId, `${block.isBlock}`, block.proof)
    expect(blockResult).to.equal(true);
    const noneBlock = MerkleTree.tokens.find(_ => _.isBlock === 0);
    const noneBlockResult = await registry.verify(MerkleTree.collection, noneBlock.tokenId, `${noneBlock.isBlock}`, noneBlock.proof);
    expect(noneBlockResult).to.equal(false);
  });
});
