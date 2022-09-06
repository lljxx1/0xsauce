
const pinataSDK = require('@pinata/sdk');
const { PINATA_KEY, PINATA_SEC, CHAIN, PROOF_REGISTRY, PROOF_REPORTER_KEY } = require('../config/config.json');
const ethers = require('ethers');
const ProofRegistryABI = require('../abi/ProofRegistry.json');
const fs = require('fs');

const pinata = pinataSDK(PINATA_KEY, PINATA_SEC);
const allCollections = require("../config/collections");

async function uploadToIPFS(collection) {
    const proofFile = __dirname + `/../proof/${collection.toLowerCase()}.json`;
    const poofDatabase = JSON.parse(fs.readFileSync(proofFile, 'utf-8'));
    const readableStreamForFile = fs.createReadStream(proofFile);
    console.log('uploadToIPFS')
    const result = await pinata.pinFileToIPFS(readableStreamForFile,  {
        pinataMetadata: {
            name: `${collection}`
        },
        pinataOptions: {
            cidVersion: 0
        }
    });
    return {
        url: `ipfs://${result.IpfsHash}`,
        ...result,
        poofDatabase
    }
}   

async function updateOracle(file, collection) {
    const provider = new ethers.providers.JsonRpcProvider(CHAIN.rpc);
    const wallet = new ethers.Wallet(PROOF_REPORTER_KEY, provider);
    const contract = new ethers.Contract(PROOF_REGISTRY, ProofRegistryABI, wallet);
    const { poofDatabase } = file;
    const lastProof = await contract.getProof(collection);
    // console.log('lastProof', lastProof);
    if (lastProof.root === poofDatabase.root) {
        console.log('same');
        return;
    }
    if (poofDatabase.root === '0x') {
        console.log('empty')
        return;
    }
    const state = {
        collection: poofDatabase.collection,
        root: poofDatabase.root, 
        url: file.url
    }
    console.log('state', state)
    const tx = await contract.setProof(state);
    console.log('tx', tx)
    const result = await tx.wait();
    console.log('result', result)
}

async function reportToChain(collection) {
    const file = await uploadToIPFS(collection);
    // if (file.isDuplicate) {
    //     console.log('skip')
    //     return;
    // }
    // console.log(file)    
    await updateOracle(file, collection);
}


async function reportAll() {
    for (let index = 0; index < allCollections.length; index++) {
      const collection = allCollections[index];
      await reportToChain(collection.contract);
    }
}
  
reportAll();