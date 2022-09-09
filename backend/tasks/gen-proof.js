const { Asset } = require("../schema");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const ethers = require("ethers");
const fs = require("fs");
const allCollections = require("../config/collections");

async function genProof(collection) {
  const allAssets = await Asset.findAll({
    attributes: ["supportsWyvern", "contract", "tokenId"],
    where: {
      contract: collection,
    },
  });

  const leaves = [];
  const allRows = [];

  for (let index = 0; index < allAssets.length; index++) {
    const asset = allAssets[index];
    const { tokenId, supportsWyvern, scamSniffer } = asset;
    const isBlock = supportsWyvern ? scamSniffer ? 1 : 0 : 1;
    allRows.push([tokenId, isBlock]);
    const leave = ethers.utils.solidityKeccak256(
      ["uint256", "uint256"],
      [tokenId, isBlock]
    );
    leaves.push(leave);
  }

  const tree = new MerkleTree(leaves, keccak256, { sort: true });
  const root = tree.getHexRoot();
  let proofDatabase = {
    collection,
    root: root,
    generateTime: Date.now(),
    tokens: [],
  };

  for (let i = 0; i < allRows.length; i++) {
    let row = allRows[i];
    let proof = tree.getHexProof(leaves[i]);
    proofDatabase.tokens.push({
      tokenId: row[0],
      isBlock: row[1],
      proof,
    });
  }

//   console.log("root", root);
  fs.writeFileSync(
    __dirname + "/../proof/" + collection + ".json",
    JSON.stringify(proofDatabase, null, 2)
  );
}


async function generateForAll() {
  for (let index = 0; index < allCollections.length; index++) {
    const collection = allCollections[index];
    console.log(`genProof for ${collection.contract}`)
    await genProof(collection.contract);
  }
}

(async () => {
    await generateForAll();
  })();
  